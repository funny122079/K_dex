import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  Keypair,
} from "@solana/web3.js";
//   import { sendTransaction, useConnection } from "./connection";
import { useEffect, useState } from "react";
import { Token, MintLayout, AccountLayout } from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
//   import { notify } from "./notifications";
//   import {
//     cache,
//     getCachedAccount,
//     useUserAccounts,
//     useCachedPool,
//   } from "./accounts";
import { programIds } from "./ids";

import { sendTransaction } from "utils/connection";

import {
  createInitPoolInstruction,
  LiquidityComponent,
  PoolConfig,
  PoolInfo,
  PoolLayout,
} from "models";

export const LIQUIDITY_TOKEN_PRECISION = 8;

//   export const removeLiquidity = async (
//     connection: Connection,
//     wallet: any,
//     liquidityAmount: number,
//     account: TokenAccount,
//     pool?: PoolInfo
//   ) => {
//     if (!pool) {
//       return;
//     }

//     notify({
//       message: "Removing Liquidity...",
//       description: "Please review transactions to approve.",
//       type: "warn",
//     });

//     // TODO get min amounts based on total supply and liquidity
//     const minAmount0 = 0;
//     const minAmount1 = 0;

//     const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
//     const accountA = await cache.getAccount(
//       connection,
//       pool.pubkeys.holdingAccounts[0]
//     );
//     const accountB = await cache.getAccount(
//       connection,
//       pool.pubkeys.holdingAccounts[1]
//     );
//     if (!poolMint.mintAuthority) {
//       throw new Error("Mint doesnt have authority");
//     }
//     const authority = poolMint.mintAuthority;

//     const signers: Account[] = [];
//     const instructions: TransactionInstruction[] = [];
//     const cleanupInstructions: TransactionInstruction[] = [];

//     const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
//       AccountLayout.span
//     );

//     // TODO: check if one of to accounts needs to be native sol ... if yes unwrap it ...
//     const toAccounts: PublicKey[] = [
//       await findOrCreateAccountByMint(
//         wallet.publicKey,
//         wallet.publicKey,
//         instructions,
//         cleanupInstructions,
//         accountRentExempt,
//         accountA.info.mint,
//         signers
//       ),
//       await findOrCreateAccountByMint(
//         wallet.publicKey,
//         wallet.publicKey,
//         instructions,
//         cleanupInstructions,
//         accountRentExempt,
//         accountB.info.mint,
//         signers
//       ),
//     ];

//     instructions.push(
//       Token.createApproveInstruction(
//         programIds().token,
//         account.pubkey,
//         authority,
//         wallet.publicKey,
//         [],
//         liquidityAmount
//       )
//     );

//     // withdraw
//     instructions.push(
//       withdrawInstruction(
//         pool.pubkeys.account,
//         authority,
//         pool.pubkeys.mint,
//         pool.pubkeys.feeAccount,
//         account.pubkey,
//         pool.pubkeys.holdingAccounts[0],
//         pool.pubkeys.holdingAccounts[1],
//         toAccounts[0],
//         toAccounts[1],
//         pool.pubkeys.program,
//         programIds().token,
//         liquidityAmount,
//         minAmount0,
//         minAmount1
//       )
//     );

//     let tx = await sendTransaction(
//       connection,
//       wallet,
//       instructions.concat(cleanupInstructions),
//       signers
//     );

//     notify({
//       message: "Liquidity Returned. Thank you for your support.",
//       type: "success",
//       description: `Transaction - ${tx}`,
//     });
//   };

//   export const swap = async (
//     connection: Connection,
//     wallet: any,
//     components: LiquidityComponent[],
//     SLIPPAGE: number,
//     pool?: PoolInfo
//   ) => {
//     if (!pool || !components[0].account) {
//       notify({
//         type: "error",
//         message: `Pool doesn't exsist.`,
//         description: `Swap trade cancelled`,
//       });
//       return;
//     }

//     // Uniswap whitepaper: https://uniswap.org/whitepaper.pdf
//     // see: https://uniswap.org/docs/v2/advanced-topics/pricing/
//     // as well as native uniswap v2 oracle: https://uniswap.org/docs/v2/core-concepts/oracles/
//     const amountIn = components[0].amount; // these two should include slippage
//     const minAmountOut = components[1].amount * (1 - SLIPPAGE);
//     const holdingA =
//       pool.pubkeys.holdingMints[0].toBase58() ===
//       components[0].account.info.mint.toBase58()
//         ? pool.pubkeys.holdingAccounts[0]
//         : pool.pubkeys.holdingAccounts[1];
//     const holdingB =
//       holdingA === pool.pubkeys.holdingAccounts[0]
//         ? pool.pubkeys.holdingAccounts[1]
//         : pool.pubkeys.holdingAccounts[0];

//     const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
//     if (!poolMint.mintAuthority || !pool.pubkeys.feeAccount) {
//       throw new Error("Mint doesnt have authority");
//     }
//     const authority = poolMint.mintAuthority;

//     const instructions: TransactionInstruction[] = [];
//     const cleanupInstructions: TransactionInstruction[] = [];
//     const signers: Account[] = [];

//     const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
//       AccountLayout.span
//     );

//     const fromAccount = getWrappedAccount(
//       instructions,
//       cleanupInstructions,
//       components[0].account,
//       wallet.publicKey,
//       amountIn + accountRentExempt,
//       signers
//     );

//     let toAccount = findOrCreateAccountByMint(
//       wallet.publicKey,
//       wallet.publicKey,
//       instructions,
//       cleanupInstructions,
//       accountRentExempt,
//       new PublicKey(components[1].mintAddress),
//       signers
//     );

//     // create approval for transfer transactions
//     instructions.push(
//       Token.createApproveInstruction(
//         programIds().token,
//         fromAccount,
//         authority,
//         wallet.publicKey,
//         [],
//         amountIn
//       )
//     );

//     let hostFeeAccount = SWAP_HOST_FEE_ADDRESS
//       ? findOrCreateAccountByMint(
//           wallet.publicKey,
//           SWAP_HOST_FEE_ADDRESS,
//           instructions,
//           cleanupInstructions,
//           accountRentExempt,
//           pool.pubkeys.mint,
//           signers
//         )
//       : undefined;

//     // swap
//     instructions.push(
//       swapInstruction(
//         pool.pubkeys.account,
//         authority,
//         fromAccount,
//         holdingA,
//         holdingB,
//         toAccount,
//         pool.pubkeys.mint,
//         pool.pubkeys.feeAccount,
//         pool.pubkeys.program,
//         programIds().token,
//         amountIn,
//         minAmountOut,
//         hostFeeAccount
//       )
//     );

//     let tx = await sendTransaction(
//       connection,
//       wallet,
//       instructions.concat(cleanupInstructions),
//       signers
//     );

//     notify({
//       message: "Trade executed.",
//       type: "success",
//       description: `Transaction - ${tx}`,
//     });
//   };

export const addLiquidity = async (
  walletPubKey: PublicKey,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  connection: Connection,
  components: LiquidityComponent[],
  slippage: number,
  pool?: PoolInfo,
  options?: PoolConfig
) => {
  if (!pool) {
    if (!options) {
      throw new Error("Options are required to create new pool.");
    }

    await _addLiquidityNewPool(
      walletPubKey,
      signTransaction,
      connection,
      components
    );
  } else {
    // await _addLiquidityExistingPool(
    //   pool,
    //   components,
    //   connection,
    //   slippage
    // );
  }
};

//   const getHoldings = (connection: Connection, accounts: string[]) => {
//     return accounts.map((acc) =>
//       cache.getAccount(connection, new PublicKey(acc))
//     );
//   };

//item: typeof TokenSwapLayout
const toPoolInfo = (item: any, program: PublicKey, toMerge?: PoolInfo) => {
  const mint = new PublicKey(item.data.tokenPool);
  return {
    pubkeys: {
      account: item.pubkey,
      program: program,
      mint,
      holdingMints: [] as PublicKey[],
      holdingAccounts: [item.data.tokenAccounts].map((a) => new PublicKey(a)),
    },
    raw: item,
  } as PoolInfo;
};

export const usePools = (connection: Connection) => {
  const [pools, setPools] = useState<PoolInfo[]>([]);

  // initial query
  useEffect(() => {
    setPools([]);

    const queryPools = async (swapId: PublicKey) => {
      let poolsArray: PoolInfo[] = [];
      (await connection.getProgramAccounts(swapId))
        .filter((item) => item.account.data.length === PoolLayout.span)
        .map((item) => {
          let result = {
            data: undefined as any,
            account: item.account,
            pubkey: item.pubkey,
            init: async () => {},
          };

          result.data = PoolLayout.decode(item.account.data);
          let pool = toPoolInfo(result, swapId);
          pool.pubkeys.feeAccount = new PublicKey(result.data.feeAccount);
          pool.pubkeys.holdingMints = result.data.mints.map(
            (buffer: any) => new PublicKey(buffer)
          );

          poolsArray.push(pool as PoolInfo);

          return result;
        });

      return poolsArray;
    };

    Promise.all([queryPools(programIds().swap)]).then((all) => {
      const flattenPoolList = all.reduce((acc, val) => acc.concat(val), []);
      setPools(flattenPoolList);
    });
  }, [connection]);

  useEffect(() => {
    const subID = connection.onProgramAccountChange(
      programIds().swap,
      async (info) => {
        const id = info.accountId as unknown as string;
        if (info.accountInfo.data.length === PoolLayout.span) {
          const account = info.accountInfo;
          const updated = {
            data: PoolLayout.decode(account.data),
            account: account,
            pubkey: new PublicKey(id),
          };

          const index =
            pools &&
            pools.findIndex((p) => p.pubkeys.account.toBase58() === id);
          if (index && index >= 0 && pools) {
            const filtered = pools.filter((p, i) => i !== index);
            setPools([...filtered, toPoolInfo(updated, programIds().swap)]);
          } else {
            let pool = toPoolInfo(updated, programIds().swap);

            pool.pubkeys.feeAccount = new PublicKey(updated.data.feeAccount);
            pool.pubkeys.holdingMints = updated.data.mints.map(
              (buffer: any) => new PublicKey(buffer)
            );

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

// export const usePoolForBasket = (
//   connection: Connection,
//   mints: (string | undefined)[]
// ) => {
//   const { pools } = useCachedPool();
//   const [pool, setPool] = useState<PoolInfo>();
//   const sortedMints = [...mints].sort();
//   useEffect(() => {
//     (async () => {
//       // reset pool during query
//       setPool(undefined);

//       let matchingPool = pools
//         .filter((p) => !p.legacy)
//         .filter((p) =>
//           p.pubkeys.holdingMints
//             .map((a) => a.toBase58())
//             .sort()
//             .every((address, i) => address === sortedMints[i])
//         );

//       for (let i = 0; i < matchingPool.length; i++) {
//         const p = matchingPool[i];

//         const account = await cache.getAccount(
//           connection,
//           p.pubkeys.holdingAccounts[0]
//         );

//         if (!account.info.amount.eqn(0)) {
//           setPool(p);
//           return;
//         }
//       }
//     })();
//   }, [connection, ...sortedMints, pools]);

//   return pool;
// };

//   export const useOwnedPools = () => {
//     const { pools } = useCachedPool();
//     const { userAccounts } = useUserAccounts();

//     const map = userAccounts.reduce((acc, item) => {
//       const key = item.info.mint.toBase58();
//       acc.set(key, [...(acc.get(key) || []), item]);
//       return acc;
//     }, new Map<string, TokenAccount[]>());

//     return pools
//       .filter((p) => map.has(p.pubkeys.mint.toBase58()))
//       .map((item) => {
//         let feeAccount = item.pubkeys.feeAccount?.toBase58();
//         return map.get(item.pubkeys.mint.toBase58())?.map((a) => {
//           return {
//             account: a as TokenAccount,
//             isFeeAccount: feeAccount === a.pubkey.toBase58(),
//             pool: item,
//           };
//         });
//       })
//       .flat();
//   };

async function _addLiquidityExistingPool(
  pool: PoolInfo,
  components: LiquidityComponent[],
  connection: Connection,
  wallet: any,
  SLIPPAGE: number
) {
  //     notify({
  //       message: "Adding Liquidity...",
  //       description: "Please review transactions to approve.",
  //       type: "warn",
  //     });
  //     const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
  //     if (!poolMint.mintAuthority) {
  //       throw new Error("Mint doesnt have authority");
  //     }
  //     if (!pool.pubkeys.feeAccount) {
  //       throw new Error("Invald fee account");
  //     }
  //     const accountA = await cache.getAccount(
  //       connection,
  //       pool.pubkeys.holdingAccounts[0]
  //     );
  //     const accountB = await cache.getAccount(
  //       connection,
  //       pool.pubkeys.holdingAccounts[1]
  //     );
  //     const reserve0 = accountA.info.amount.toNumber();
  //     const reserve1 = accountB.info.amount.toNumber();
  //     const fromA =
  //       accountA.info.mint.toBase58() === components[0].mintAddress
  //         ? components[0]
  //         : components[1];
  //     const fromB = fromA === components[0] ? components[1] : components[0];
  //     if (!fromA.account || !fromB.account) {
  //       throw new Error("Missing account info.");
  //     }
  //     const supply = poolMint.supply.toNumber();
  //     const authority = poolMint.mintAuthority;
  //     // Uniswap whitepaper: https://uniswap.org/whitepaper.pdf
  //     // see: https://uniswap.org/docs/v2/advanced-topics/pricing/
  //     // as well as native uniswap v2 oracle: https://uniswap.org/docs/v2/core-concepts/oracles/
  //     const amount0 = fromA.amount;
  //     const amount1 = fromB.amount;
  //     const liquidity = Math.min(
  //       (amount0 * (1 - SLIPPAGE) * supply) / reserve0,
  //       (amount1 * (1 - SLIPPAGE) * supply) / reserve1
  //     );
  //     const instructions: TransactionInstruction[] = [];
  //     const cleanupInstructions: TransactionInstruction[] = [];
  //     const signers: Account[] = [];
  //     const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
  //       AccountLayout.span
  //     );
  //     const fromKeyA = getWrappedAccount(
  //       instructions,
  //       cleanupInstructions,
  //       fromA.account,
  //       wallet.publicKey,
  //       amount0 + accountRentExempt,
  //       signers
  //     );
  //     const fromKeyB = getWrappedAccount(
  //       instructions,
  //       cleanupInstructions,
  //       fromB.account,
  //       wallet.publicKey,
  //       amount1 + accountRentExempt,
  //       signers
  //     );
  //     let toAccount = findOrCreateAccountByMint(
  //       wallet.publicKey,
  //       wallet.publicKey,
  //       instructions,
  //       [],
  //       accountRentExempt,
  //       pool.pubkeys.mint,
  //       signers,
  //       new Set<string>([pool.pubkeys.feeAccount.toBase58()])
  //     );
  //     // create approval for transfer transactions
  //     instructions.push(
  //       Token.createApproveInstruction(
  //         programIds().token,
  //         fromKeyA,
  //         authority,
  //         wallet.publicKey,
  //         [],
  //         amount0
  //       )
  //     );
  //     instructions.push(
  //       Token.createApproveInstruction(
  //         programIds().token,
  //         fromKeyB,
  //         authority,
  //         wallet.publicKey,
  //         [],
  //         amount1
  //       )
  //     );
  //     // depoist
  //     instructions.push(
  //       depositInstruction(
  //         pool.pubkeys.account,
  //         authority,
  //         fromKeyA,
  //         fromKeyB,
  //         pool.pubkeys.holdingAccounts[0],
  //         pool.pubkeys.holdingAccounts[1],
  //         pool.pubkeys.mint,
  //         toAccount,
  //         pool.pubkeys.program,
  //         programIds().token,
  //         liquidity,
  //         amount0,
  //         amount1
  //       )
  //     );
  //     let tx = await sendTransaction(
  //       connection,
  //       wallet,
  //       instructions.concat(cleanupInstructions),
  //       signers
  //     );
  //     notify({
  //       message: "Pool Funded. Happy trading.",
  //       type: "success",
  //       description: `Transaction - ${tx}`,
  //     });
}

//   function findOrCreateAccountByMint(
//     payer: PublicKey,
//     owner: PublicKey,
//     instructions: TransactionInstruction[],
//     cleanupInstructions: TransactionInstruction[],
//     accountRentExempt: number,
//     mint: PublicKey, // use to identify same type
//     signers: Account[],
//     excluded?: Set<string>
//   ): PublicKey {
//     const accountToFind = mint.toBase58();
//     const account = getCachedAccount(
//       (acc) =>
//         acc.info.mint.toBase58() === accountToFind &&
//         acc.info.owner.toBase58() === owner.toBase58() &&
//         (excluded === undefined || !excluded.has(acc.pubkey.toBase58()))
//     );
//     const isWrappedSol = accountToFind === WRAPPED_SOL_MINT.toBase58();

//     let toAccount: PublicKey;
//     if (account && !isWrappedSol) {
//       toAccount = account.pubkey;
//     } else {
//       // creating depositor pool account
//       const newToAccount = createSplAccount(
//         instructions,
//         payer,
//         accountRentExempt,
//         mint,
//         owner,
//         AccountLayout.span
//       );

//       toAccount = newToAccount.publicKey;
//       signers.push(newToAccount);

//       if (isWrappedSol) {
//         cleanupInstructions.push(
//           Token.createCloseAccountInstruction(
//             programIds().token,
//             toAccount,
//             payer,
//             payer,
//             []
//           )
//         );
//       }
//     }

//     return toAccount;
//   }

//   export async function calculateDependentAmount(
//     connection: Connection,
//     independent: string,
//     amount: number,
//     pool: PoolInfo
//   ): Promise<number | undefined> {
//     const poolMint = await cache.getMint(connection, pool.pubkeys.mint);
//     const accountA = await cache.getAccount(
//       connection,
//       pool.pubkeys.holdingAccounts[0]
//     );
//     const accountB = await cache.getAccount(
//       connection,
//       pool.pubkeys.holdingAccounts[1]
//     );
//     if (!poolMint.mintAuthority) {
//       throw new Error("Mint doesnt have authority");
//     }

//     if (poolMint.supply.eqn(0)) {
//       return;
//     }

//     const mintA = await cache.getMint(connection, accountA.info.mint);
//     const mintB = await cache.getMint(connection, accountB.info.mint);

//     if (!mintA || !mintB) {
//       return;
//     }

//     const isFirstIndependent = accountA.info.mint.toBase58() === independent;
//     const depPrecision = Math.pow(
//       10,
//       isFirstIndependent ? mintB.decimals : mintA.decimals
//     );
//     const indPrecision = Math.pow(
//       10,
//       isFirstIndependent ? mintA.decimals : mintB.decimals
//     );
//     const adjAmount = amount * indPrecision;

//     const dependentTokenAmount = isFirstIndependent
//       ? (accountB.info.amount.toNumber() / accountA.info.amount.toNumber()) *
//         adjAmount
//       : (accountA.info.amount.toNumber() / accountB.info.amount.toNumber()) *
//         adjAmount;

//     return dependentTokenAmount / depPrecision;
//   }

// TODO: add ui to customize curve type

async function createTreasurerPubkey(
  poolAcc: PublicKey,
  programId: PublicKey
): Promise<PublicKey> {
  const seed = Buffer.from(poolAcc.toBytes()).toString();
  const expectedAcc = await PublicKey.createWithSeed(
    poolAcc, // base
    seed, // seed
    programId // derived from this program_id
  );
  return expectedAcc; // this is Treasurer Account's PDA
}

async function _addLiquidityNewPool(
  walletPubKey: PublicKey,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  connection: Connection,
  components: LiquidityComponent[]
) {
  if (components.some((c) => !c.account)) {
    console.log("_addLiquidityNewPool - account is missing");
    return;
  }

  let transactions = new Transaction();
  const liquidityTokenAccount = new Account();
  // Create account for pool liquidity token
  transactions.add(
    SystemProgram.createAccount({
      fromPubkey: walletPubKey,
      newAccountPubkey: liquidityTokenAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      space: MintLayout.span,
      programId: programIds().token,
    })
  );

  const poolAccount = new Account();

  const [authority_PDA_poolAccount, nonce] = await PublicKey.findProgramAddress(
    [poolAccount.publicKey.toBuffer()],
    programIds().swap
  );

  // create mint for pool liquidity token
  transactions.add(
    Token.createInitMintInstruction(
      programIds().token,
      liquidityTokenAccount.publicKey,
      LIQUIDITY_TOKEN_PRECISION,
      // pass control of liquidity mint to swap program
      authority_PDA_poolAccount,
      // swap program can freeze liquidity token mint
      null
    )
  );

  let treasurerAccount = createTreasurerPubkey(
    authority_PDA_poolAccount,
    programIds().swap
  );

  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  // Create holding accounts for
  const holdingAccounts: Account[] = [];
  let signers: Account[] = [];

  components.forEach((leg) => {
    if (!leg.account) {
      return;
    }

    // component account to store tokens I of N in liquidity pool
    holdingAccounts.push(
      createSplAccountWithoutInit(
        transactions,
        walletPubKey,
        accountRentExempt,
        AccountLayout.span
      )
    );
  });

  await sendTransaction(
    connection,
    walletPubKey,
    transactions,
    signTransaction,
    []
  );

  transactions = new Transaction();

  transactions.add(
    SystemProgram.createAccount({
      fromPubkey: walletPubKey,
      newAccountPubkey: poolAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        PoolLayout.span
      ),
      space: PoolLayout.span,
      programId: programIds().swap,
    })
  );

  // transactions.add(
  //   createInitPoolInstruction(
  //     walletPubKey,
  //     walletPubKey,
  //     poolAccount,
  //     authority_PDA_poolAccount,
  //     liquidityTokenAccount,
  //     vaultAccount,
  //     proofAccount,
  //     components[0].account,
  //     components[0].mintAddress,
  //     holdingAccounts[0].publicKey,
  //     components[1].account,
  //     components[1].mintAddress,
  //     holdingAccounts[1].publicKey,
  //     components[2].account,
  //     components[2].mintAddress,
  //     holdingAccounts[2].publicKey,
  //     treasurerAccount,
  //     SystemProgram.programId,
  //     programIds().token,
  //     sysVarRentAccount,
  //     programIds().ata,
  //     programIds().swap,
  //   )
  // );
}

function createSplAccountWithoutInit(
  transactions: Transaction,
  payer: PublicKey,
  accountRentExempt: number,
  space: number
) {
  const account = new Account();
  transactions.add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: accountRentExempt,
      space,
      programId: programIds().token,
    })
  );

  return account;
}
