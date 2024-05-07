import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Token, MintLayout, AccountLayout } from "@solana/spl-token";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'

import { notify } from "./notifications";
import {
  cache,
  getCachedAccount,
  useUserAccounts,
  useCachedPool,
} from "./accounts";
import {
  programIds,
  SWAP_HOST_FEE_ADDRESS,
  SWAP_PROGRAM_OWNER_FEE_ADDRESS,
  WRAPPED_SOL_MINT,
} from "./ids";
import {
  LiquidityComponent,
  PoolInfo,
  TokenAccount,
  createInitSwapInstruction,
  TokenSwapLayout,
  depositInstruction,
  withdrawInstruction,
  TokenSwapLayoutLegacyV0,
  swapInstruction,
  PoolConfig,
} from "./../models";

const LIQUIDITY_TOKEN_PRECISION = 8;

export const removeLiquidity = async (
  connection: Connection,  
  liquidityAmount: number,
  account: TokenAccount,
  pool?: PoolInfo
) => {
  if (!pool) {
    return;
  }

  const { publicKey, sendTransaction } = useWallet();

  const minAmount0 = 0;
  const minAmount1 = 0;

  const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
  const accountA = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[0]
  );
  const accountB = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[1]
  );
  if (!poolMint.mintAuthority) {
    throw new Error("Mint doesnt have authority");
  }
  const authority = poolMint.mintAuthority;

  const signers: Account[] = [];  
  const cleanupInstructions: TransactionInstruction[] = [];
  const transaction = new web3.Transaction();

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );

  if (!publicKey) {
    console.log("Please, connect to wallet");
    return;
  }

  const toAccounts: PublicKey[] = [
    await findOrCreateAccountByMint(
      publicKey,
      publicKey,
      transaction,
      cleanupInstructions,
      accountRentExempt,
      accountA.info.mint,
      signers
    ),
    await findOrCreateAccountByMint(
      publicKey,
      publicKey,
      transaction,
      cleanupInstructions,
      accountRentExempt,
      accountB.info.mint,
      signers
    ),
  ];
  
  transaction.add(Token.createApproveInstruction(
      programIds().token,
      account.pubkey,
      authority,
      publicKey,
      [],
      liquidityAmount
  ));

  // withdraw
  transaction.add(
    withdrawInstruction(
      pool.pubkeys.account,
      authority,
      pool.pubkeys.mint,
      pool.pubkeys.feeAccount,
      account.pubkey,
      pool.pubkeys.holdingAccounts[0],
      pool.pubkeys.holdingAccounts[1],
      toAccounts[0],
      toAccounts[1],
      pool.pubkeys.program,
      programIds().token,
      liquidityAmount,
      minAmount0,
      minAmount1
    )
  );

  try {
    let tx = await sendTransaction(
      transaction,
      connection    
    );
  } catch (e){
    console.log("removeLiquidity : error", e);
  }  
};

export const swap = async (
  connection: Connection,
  wallet: any,
  components: LiquidityComponent[],
  SLIPPAGE: number,
  pool?: PoolInfo
) => {
  if (!pool || !components[0].account) {
    return;
  }

  const { sendTransaction } = useWallet();

  const amountIn = components[0].amount; // these two should include slippage
  const minAmountOut = components[1].amount * (1 - SLIPPAGE);
  const holdingA =
    pool.pubkeys.holdingMints[0].toBase58() ===
    components[0].account.info.mint.toBase58()
      ? pool.pubkeys.holdingAccounts[0]
      : pool.pubkeys.holdingAccounts[1];
  const holdingB =
    holdingA === pool.pubkeys.holdingAccounts[0]
      ? pool.pubkeys.holdingAccounts[1]
      : pool.pubkeys.holdingAccounts[0];

  const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
  if (!poolMint.mintAuthority || !pool.pubkeys.feeAccount) {
    throw new Error("Mint doesnt have authority");
  }
  const authority = poolMint.mintAuthority;

  let transaction = new web3.Transaction();
  const cleanupInstructions: TransactionInstruction[] = [];
  const signers: Account[] = [];

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );

  const fromAccount = getWrappedAccount(
    transaction,
    cleanupInstructions,
    components[0].account,
    wallet.publicKey,
    amountIn + accountRentExempt,
    signers
  );

  let toAccount = findOrCreateAccountByMint(
    wallet.publicKey,
    wallet.publicKey,
    transaction,
    cleanupInstructions,
    accountRentExempt,
    new PublicKey(components[1].mintAddress),
    signers
  );

  // create approval for transfer transactions
  transaction.add(
    Token.createApproveInstruction(
      programIds().token,
      fromAccount,
      authority,
      wallet.publicKey,
      [],
      amountIn
    )
  );

  let hostFeeAccount = SWAP_HOST_FEE_ADDRESS
    ? findOrCreateAccountByMint(
        wallet.publicKey,
        SWAP_HOST_FEE_ADDRESS,
        transaction,
        cleanupInstructions,
        accountRentExempt,
        pool.pubkeys.mint,
        signers
      )
    : undefined;

  // swap
  transaction.add(
    swapInstruction(
      pool.pubkeys.account,
      authority,
      fromAccount,
      holdingA,
      holdingB,
      toAccount,
      pool.pubkeys.mint,
      pool.pubkeys.feeAccount,
      pool.pubkeys.program,
      programIds().token,
      amountIn,
      minAmountOut,
      hostFeeAccount
    )
  );

  let tx = await sendTransaction(
    transaction,
    connection
  );
};

export const addLiquidity = async (
  connection: Connection,
  wallet: any,
  components: LiquidityComponent[],
  slippage: number,
  pool?: PoolInfo,
  options?: PoolConfig
) => {
  if (!pool) {
    if (!options) {
      throw new Error("Options are required to create new pool.");
    }

    await _addLiquidityNewPool(wallet, connection, components, options);
  } else {
    await _addLiquidityExistingPool(
      pool,
      components,
      connection,
      wallet,
      slippage
    );
  }
};

const getHoldings = (connection: Connection, accounts: string[]) => {
  return accounts.map((acc) =>
    cache.getAccount(connection, new PublicKey(acc))
  );
};

const toPoolInfo = (item: any, program: PublicKey, toMerge?: PoolInfo) => {
  const mint = new PublicKey(item.data.tokenPool);
  return {
    pubkeys: {
      account: item.pubkey,
      program: program,
      mint,
      holdingMints: [] as PublicKey[],
      holdingAccounts: [item.data.tokenAccountA, item.data.tokenAccountB].map(
        (a) => new PublicKey(a)
      ),
    },
    legacy: false,
    raw: item,
  } as PoolInfo;
};

export const usePools = () => {
  const { connection } = useConnection();
  const [pools, setPools] = useState<PoolInfo[]>([]);

  // initial query
  useEffect(() => {
    setPools([]);

    const queryPools = async (swapId: PublicKey, isLegacy = false) => {
      let poolsArray: PoolInfo[] = [];
      (await connection.getProgramAccounts(swapId))
        .filter(
          (item: any) =>
            item.account.data.length === TokenSwapLayout.span ||
            item.account.data.length === TokenSwapLayoutLegacyV0.span
        )
        .map((item: any) => {
          let result = {
            data: undefined as any,
            account: item.account,
            pubkey: item.pubkey,
            init: async () => {},
          };

          // handling of legacy layout can be removed soon...
          if (item.account.data.length === TokenSwapLayoutLegacyV0.span) {
            result.data = TokenSwapLayoutLegacyV0.decode(item.account.data);
            let pool = toPoolInfo(result, swapId);
            pool.legacy = isLegacy;
            poolsArray.push(pool as PoolInfo);

            result.init = async () => {
              try {
                // TODO: this is not great
                // Ideally SwapLayout stores hash of all the mints to make finding of pool for a pair easier
                const holdings = await Promise.all(
                  getHoldings(connection, [
                    result.data.tokenAccountA,
                    result.data.tokenAccountB,
                  ])
                );

                pool.pubkeys.holdingMints = [
                  holdings[0].info.mint,
                  holdings[1].info.mint,
                ] as PublicKey[];
              } catch (err) {
                console.log(err);
              }
            };
          } else {
            result.data = TokenSwapLayout.decode(item.account.data);
            let pool = toPoolInfo(result, swapId);
            pool.legacy = isLegacy;
            pool.pubkeys.feeAccount = new PublicKey(result.data.feeAccount);
            pool.pubkeys.holdingMints = [
              new PublicKey(result.data.mintA),
              new PublicKey(result.data.mintB),
            ] as PublicKey[];

            poolsArray.push(pool as PoolInfo);
          }

          return result;
        });

      return poolsArray;
    };

    Promise.all([
      queryPools(programIds().swap),
      // ...programIds().swap_legacy.map((leg) => queryPools(leg, true)),
    ]).then((all) => {
      setPools(all.flat());
    });
  }, [connection]);

  useEffect(() => {
    const subID = connection.onProgramAccountChange(
      programIds().swap,
      async (info:any) => {
        const id = (info.accountId as unknown) as string;
        if (info.accountInfo.data.length === TokenSwapLayout.span) {
          const account = info.accountInfo;
          const updated = {
            data: TokenSwapLayout.decode(account.data),
            account: account,
            pubkey: new PublicKey(id),
          };

          const index =
            pools &&
            pools.findIndex((p) => p.pubkeys.account.toBase58() === id);
          if (index && index >= 0 && pools) {
            // TODO: check if account is empty?

            const filtered = pools.filter((p, i) => i !== index);
            setPools([...filtered, toPoolInfo(updated, programIds().swap)]);
          } else {
            let pool = toPoolInfo(updated, programIds().swap);

            pool.pubkeys.feeAccount = new PublicKey(updated.data.feeAccount);
            pool.pubkeys.holdingMints = [
              new PublicKey(updated.data.mintA),
              new PublicKey(updated.data.mintB),
            ] as PublicKey[];

            setPools([...pools, pool]);
          }
        }
      },
      "singleGossip"
    );

    return () => {
      connection.removeProgramAccountChangeListener(subID);
    };
  }, [connection, pools]);

  return { pools };
};

export const usePoolForBasket = (mints: (string | undefined)[]) => {
  const { connection } = useConnection();
  const { pools } = useCachedPool();
  const [pool, setPool] = useState<PoolInfo>();
  const sortedMints = [...mints].sort();
  useEffect(() => {
    (async () => {
      setPool(undefined);

      let matchingPool = pools
        .filter((p) => !p.legacy)
        .filter((p) =>
          p.pubkeys.holdingMints
            .map((a: any) => a.toBase58())
            .sort()
            .every((address: any, i: any) => address === sortedMints[i])
        );

      for (let i = 0; i < matchingPool.length; i++) {
        const p = matchingPool[i];

        const account = await cache.getAccount(
          connection,
          p.pubkeys.holdingAccounts[0]
        );

        if (!account.info.amount.eqn(0)) {
          setPool(p);
          return;
        }
      }
    })();
  }, [connection, ...sortedMints, pools]);

  return pool;
};

export const useOwnedPools = () => {
  const { pools } = useCachedPool();
  const { userAccounts } = useUserAccounts();

  const map = userAccounts.reduce((acc, item) => {
    const key = item.info.mint.toBase58();
    acc.set(key, [...(acc.get(key) || []), item]);
    return acc;
  }, new Map<string, TokenAccount[]>());

  return pools
    .filter((p) => map.has(p.pubkeys.mint.toBase58()))
    .map((item) => {
      let feeAccount = item.pubkeys.feeAccount?.toBase58();
      return map.get(item.pubkeys.mint.toBase58())?.map((a:any) => {
        return {
          account: a as TokenAccount,
          isFeeAccount: feeAccount === a.pubkey.toBase58(),
          pool: item,
        };
      });
    })
    .flat();
};

async function _addLiquidityExistingPool(
  pool: PoolInfo,
  components: LiquidityComponent[],
  connection: Connection,
  wallet: any,
  SLIPPAGE: number
) {
  const { sendTransaction } = useWallet();

  const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
  if (!poolMint.mintAuthority) {
    throw new Error("Mint doesnt have authority");
  }

  if (!pool.pubkeys.feeAccount) {
    throw new Error("Invald fee account");
  }

  const accountA = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[0]
  );
  const accountB = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[1]
  );

  const reserve0 = accountA.info.amount.toNumber();
  const reserve1 = accountB.info.amount.toNumber();
  const fromA =
    accountA.info.mint.toBase58() === components[0].mintAddress
      ? components[0]
      : components[1];
  const fromB = fromA === components[0] ? components[1] : components[0];

  if (!fromA.account || !fromB.account) {
    throw new Error("Missing account info.");
  }

  const supply = poolMint.supply.toNumber();
  const authority = poolMint.mintAuthority;

  const amount0 = fromA.amount;
  const amount1 = fromB.amount;

  const liquidity = Math.min(
    (amount0 * (1 - SLIPPAGE) * supply) / reserve0,
    (amount1 * (1 - SLIPPAGE) * supply) / reserve1
  );

  let transaction = new web3.Transaction();
  const cleanupInstructions: TransactionInstruction[] = [];

  const signers: Account[] = [];

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  const fromKeyA = getWrappedAccount(
    transaction,
    cleanupInstructions,
    fromA.account,
    wallet.publicKey,
    amount0 + accountRentExempt,
    signers
  );
  const fromKeyB = getWrappedAccount(
    transaction,
    cleanupInstructions,
    fromB.account,
    wallet.publicKey,
    amount1 + accountRentExempt,
    signers
  );

  let toAccount = findOrCreateAccountByMint(
    wallet.publicKey,
    wallet.publicKey,
    transaction,
    [],
    accountRentExempt,
    pool.pubkeys.mint,
    signers,
    new Set<string>([pool.pubkeys.feeAccount.toBase58()])
  );

  // create approval for transfer transactions
  transaction.add(
    Token.createApproveInstruction(
      programIds().token,
      fromKeyA,
      authority,
      wallet.publicKey,
      [],
      amount0
    )
  );

  transaction.add(
    Token.createApproveInstruction(
      programIds().token,
      fromKeyB,
      authority,
      wallet.publicKey,
      [],
      amount1
    )
  );

  // depoist
  transaction.add(
    depositInstruction(
      pool.pubkeys.account,
      authority,
      fromKeyA,
      fromKeyB,
      pool.pubkeys.holdingAccounts[0],
      pool.pubkeys.holdingAccounts[1],
      pool.pubkeys.mint,
      toAccount,
      pool.pubkeys.program,
      programIds().token,
      liquidity,
      amount0,
      amount1
    )
  );

  let tx = await sendTransaction(
    transaction,
    connection,    
  );
}

function findOrCreateAccountByMint(
  payer: PublicKey,
  owner: PublicKey,
  transaction: web3.Transaction,
  cleanupInstructions: TransactionInstruction[],
  accountRentExempt: number,
  mint: PublicKey, // use to identify same type
  signers: Account[],
  excluded?: Set<string>
): PublicKey {
  const accountToFind = mint.toBase58();
  const account = getCachedAccount(
    (acc) =>
      acc.info.mint.toBase58() === accountToFind &&
      acc.info.owner.toBase58() === owner.toBase58() &&
      (excluded === undefined || !excluded.has(acc.pubkey.toBase58()))
  );
  const isWrappedSol = accountToFind === WRAPPED_SOL_MINT.toBase58();

  let toAccount: PublicKey;
  if (account && !isWrappedSol) {
    toAccount = account.pubkey;
  } else {
    // creating depositor pool account
    const newToAccount = createSplAccount(
      transaction,
      payer,
      accountRentExempt,
      mint,
      owner,
      AccountLayout.span
    );

    toAccount = newToAccount.publicKey;
    signers.push(newToAccount);

    if (isWrappedSol) {
      cleanupInstructions.push(
        Token.createCloseAccountInstruction(
          programIds().token,
          toAccount,
          payer,
          payer,
          []
        )
      );
    }
  }

  return toAccount;
}

export async function calculateDependentAmount(
  connection: Connection,
  independent: string,
  amount: number,
  pool: PoolInfo
): Promise<number | undefined> {
  const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
  const accountA = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[0]
  );
  const accountB = await cache.getAccount(
    connection,
    pool.pubkeys.holdingAccounts[1]
  );
  if (!poolMint.mintAuthority) {
    throw new Error("Mint doesnt have authority");
  }

  if (poolMint.supply.eqn(0)) {
    return;
  }

  const mintA = await cache.getMint(connection, accountA.info.mint);
  const mintB = await cache.getMint(connection, accountB.info.mint);

  if (!mintA || !mintB) {
    return;
  }

  const isFirstIndependent = accountA.info.mint.toBase58() === independent;
  const depPrecision = Math.pow(
    10,
    isFirstIndependent ? mintB.decimals : mintA.decimals
  );
  const indPrecision = Math.pow(
    10,
    isFirstIndependent ? mintA.decimals : mintB.decimals
  );
  const adjAmount = amount * indPrecision;

  const dependentTokenAmount = isFirstIndependent
    ? (accountB.info.amount.toNumber() / accountA.info.amount.toNumber()) *
      adjAmount
    : (accountA.info.amount.toNumber() / accountB.info.amount.toNumber()) *
      adjAmount;

  return dependentTokenAmount / depPrecision;
}

// TODO: add ui to customize curve type
async function _addLiquidityNewPool(
  wallet_publicKey: any,
  connection: Connection,
  components: LiquidityComponent[],
  options: PoolConfig
) {
  if (components.some((c) => !c.account)) {
    return;
  }

  const { sendTransaction } = useWallet();
  let instructions: TransactionInstruction[] = [];
  let cleanupInstructions: TransactionInstruction[] = [];

  let transaction = new web3.Transaction();
  const liquidityTokenAccount = new Account();
  // Create account for pool liquidity token
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: wallet_publicKey,
      newAccountPubkey: liquidityTokenAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      space: MintLayout.span,
      programId: programIds().token,
    })
  );

  const tokenSwapAccount = new Account();

  const [authority, nonce] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    programIds().swap
  );

  // create mint for pool liquidity token
  transaction.add(
    Token.createInitMintInstruction(
      programIds().token,
      liquidityTokenAccount.publicKey,
      LIQUIDITY_TOKEN_PRECISION,
      // pass control of liquidity mint to swap program
      authority,
      // swap program can freeze liquidity token mint
      null
    )
  );

  // Create holding accounts for
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  const holdingAccounts: Account[] = [];
  let signers: Account[] = [];

  components.forEach((leg) => {
    if (!leg.account) {
      return;
    }

    const mintPublicKey = leg.account.info.mint;
    // component account to store tokens I of N in liquidity poll
    holdingAccounts.push(
      createSplAccount(
        transaction,
        wallet_publicKey,
        accountRentExempt,
        mintPublicKey,
        authority,
        AccountLayout.span
      )
    );
  });

  // creating depositor pool account
  const depositorAccount = createSplAccount(
    transaction,
    wallet_publicKey,
    accountRentExempt,
    liquidityTokenAccount.publicKey,
    wallet_publicKey,
    AccountLayout.span
  );

  // creating fee pool account its set from env variable or to creater of the pool
  // creater of the pool is not allowed in some versions of token-swap program
  const feeAccount = createSplAccount(
    transaction,
    wallet_publicKey,
    accountRentExempt,
    liquidityTokenAccount.publicKey,
    SWAP_PROGRAM_OWNER_FEE_ADDRESS || wallet_publicKey,
    AccountLayout.span
  );

  // create all accounts in one transaction
  let tx = await sendTransaction(transaction, connection);
  // let tx = await sendTransaction(connection, wallet_publicKey, instructions, [
  //   liquidityTokenAccount,
  //   depositorAccount,
  //   feeAccount,
  //   ...holdingAccounts,
  //   ...signers,
  // ]);

  let secondTransaction = new web3.Transaction();
  signers = [];
  cleanupInstructions = [];

  secondTransaction.add(
    SystemProgram.createAccount({
      fromPubkey: wallet_publicKey,
      newAccountPubkey: tokenSwapAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        TokenSwapLayout.span
      ),
      space: TokenSwapLayout.span,
      programId: programIds().swap,
    })
  );

  components.forEach((leg, i) => {
    if (!leg.account) {
      return;
    }

    // create temporary account for wrapped sol to perform transfer
    const from = getWrappedAccount(
      secondTransaction,
      cleanupInstructions,
      leg.account,
      wallet_publicKey,
      leg.amount + accountRentExempt,
      signers
    );

    secondTransaction.add(
      Token.createTransferInstruction(
        programIds().token,
        from,
        holdingAccounts[i].publicKey,
        wallet_publicKey,
        [],
        leg.amount
      )
    );
  });

  secondTransaction.add(
    createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      holdingAccounts[0].publicKey,
      holdingAccounts[1].publicKey,
      liquidityTokenAccount.publicKey,
      feeAccount.publicKey,
      depositorAccount.publicKey,
      programIds().token,
      programIds().swap,
      nonce,
      options.curveType,
      options.tradeFeeNumerator,
      options.tradeFeeDenominator,
      options.ownerTradeFeeNumerator,
      options.ownerTradeFeeDenominator,
      options.ownerWithdrawFeeNumerator,
      options.ownerWithdrawFeeDenominator
    )
  );

  // All instructions didn't fit in single transaction
  // initialize and provide inital liquidity to swap in 2nd (this prevents loss of funds)

  tx = await sendTransaction(secondTransaction, connection);
  // tx = await sendTransaction(
  //   connection,
  //   wallet_publicKey,
  //   instructions.concat(cleanupInstructions),
  //   [tokenSwapAccount, ...signers]
  // );
}

function getWrappedAccount(
  transaction: web3.Transaction,
  cleanupInstructions: TransactionInstruction[],
  toCheck: TokenAccount,
  payer: PublicKey,
  amount: number,
  signers: Account[]
) {
  if (!toCheck.info.isNative) {
    return toCheck.pubkey;
  }

  const account = new Account();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: amount,
      space: AccountLayout.span,
      programId: programIds().token,
    })
  );

  transaction.add(
    Token.createInitAccountInstruction(
      programIds().token,
      WRAPPED_SOL_MINT,
      account.publicKey,
      payer
    )
  );

  cleanupInstructions.push(
    Token.createCloseAccountInstruction(
      programIds().token,
      account.publicKey,
      payer,
      payer,
      []
    )
  );

  signers.push(account);

  return account.publicKey;
}

function createSplAccount(
  transaction : web3.Transaction,
  payer: PublicKey,
  accountRentExempt: number,
  mint: PublicKey,
  owner: PublicKey,
  space: number
) {
  const account = new Account();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: accountRentExempt,
      space,
      programId: programIds().token,
    })
  );

  transaction.add(
    Token.createInitAccountInstruction(
      programIds().token,
      mint,
      account.publicKey,
      owner
    )
  );

  return account;
}
