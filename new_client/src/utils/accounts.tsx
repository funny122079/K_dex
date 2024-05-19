import React, { useCallback, useContext, useEffect, useState } from "react";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "utils/ids";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountLayout, u64, MintInfo, MintLayout } from "@solana/spl-token";
import bs58 from "bs58";

import { PoolInfo } from "models";
import { usePools } from "utils/pools";

const AccountsContext = React.createContext<any>(null);

export async function findAssociatedTokenAddress(
  connection: Connection,
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): Promise<PublicKey> {
  let tokenAccountForMint;

  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletAddress,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    for (const tokenAccount of tokenAccounts.value) {
      const accountData = AccountLayout.decode(tokenAccount.account.data);            
      if (new PublicKey(accountData.mint).toString() === tokenMintAddress.toString()) {
        console.log(`account: ${tokenAccount.pubkey.toString()}, mint: ${tokenMintAddress.toString()}`);
        tokenAccountForMint = tokenAccount.pubkey;
        break;
      }
    }  

    if(!tokenAccountForMint) {
      throw new Error('No token account found for this mint address');
    }
  } catch (error) {
    console.log("accounts-findAssociatedTokenAddress: error:", error);
    return new PublicKey("");
  }

  return tokenAccountForMint;
}

// class AccountUpdateEvent extends Event {
//     static type = "AccountUpdate";
//     id: string;
//     constructor(id: string) {
//       super(AccountUpdateEvent.type);
//       this.id = id;
//     }
//   }

// class EventEmitter extends EventTarget {
//     raiseAccountUpdated(id: string) {
//       this.dispatchEvent(new AccountUpdateEvent(id));
//     }
//   }

// const accountEmitter = new EventEmitter();

// const mintCache = new Map<string, Promise<MintInfo>>();
// const pendingAccountCalls = new Map<string, Promise<TokenAccount>>();
// const accountsCache = new Map<string, TokenAccount>();

// // const getAccountInfo = async (connection: Connection, pubKey: PublicKey) => {
// //   const info = await connection.getAccountInfo(pubKey);
// //   if (info === null) {
// //     throw new Error("Failed to find mint account");
// //   }

// //   const buffer = Buffer.from(info.data);

// //   const data = deserializeAccount(buffer);

// //   const details = {
// //     pubkey: pubKey,
// //     account: {
// //       ...info,
// //     },
// //     info: data,
// //   } as TokenAccount;

// //   return details;
// // };

// // const getMintInfo = async (connection: Connection, pubKey: PublicKey) => {
// //   const info = await connection.getAccountInfo(pubKey);
// //   if (info === null) {
// //     throw new Error("Failed to find mint account");
// //   }

// //   const data = Buffer.from(info.data);

// //   return deserializeMint(data);
// // };

// // export const cache = {
// //   getAccount: async (connection: Connection, pubKey: string | PublicKey) => {
// //     let id: PublicKey;
// //     if (typeof pubKey === "string") {
// //       id = new PublicKey(pubKey);
// //     } else {
// //       id = pubKey;
// //     }

// //     const address = id.toBase58();

// //     let account = accountsCache.get(address);
// //     if (account) {
// //       return account;
// //     }

// //     let query = pendingAccountCalls.get(address);
// //     if (query) {
// //       return query;
// //     }

// //     // query = connection.getAccountInfo(id).then((data) => {
// //     //   pendingAccountCalls.delete(address);
// //     //   accountsCache.set(address, data);
// //     //   return data;
// //     // }) as Promise<TokenAccount>;

// //     pendingAccountCalls.set(address, query as any);

// //     return query;
// //   },
// //   getMint: async (connection: Connection, pubKey: string | PublicKey) => {
// //     let id: PublicKey;
// //     if (typeof pubKey === "string") {
// //       id = new PublicKey(pubKey);
// //     } else {
// //       id = pubKey;
// //     }

// //     let mint = mintCache.get(id.toBase58());
// //     if (mint) {
// //       return mint;
// //     }

// //     let query = getMintInfo(connection, id);

// //     mintCache.set(id.toBase58(), query as any);

// //     return query;
// //   },
// // };

// // function wrapNativeAccount(
// //   pubkey: PublicKey,
// //   account?: AccountInfo<Buffer>
// // ): TokenAccount | undefined {
// //   if (!account) {
// //     return undefined;
// //   }

// //   return {
// //     pubkey: pubkey,
// //     account,
// //     info: {
// //       mint: WRAPPED_SOL_MINT,
// //       owner: pubkey,
// //       amount: new u64(account.lamports),
// //       delegate: null,
// //       delegatedAmount: new u64(0),
// //       isInitialized: true,
// //       isFrozen: false,
// //       isNative: true,
// //       rentExemptReserve: null,
// //       closeAuthority: null,
// //     },
// //   };
// // }

// // const UseNativeAccount = (
// //   connection: Connection,
// //   publicKey: PublicKey | null
// // ) => {
// //   const [nativeAccount, setNativeAccount] = useState<AccountInfo<Buffer>>();
// //   useEffect(() => {
// //     if (!connection || !publicKey) {
// //       return;
// //     }

// //     connection.getAccountInfo(publicKey).then((acc) => {
// //       if (acc) {
// //         setNativeAccount(acc);
// //       }
// //     });
// //     connection.onAccountChange(publicKey, (acc) => {
// //       if (acc) {
// //         setNativeAccount(acc);
// //       }
// //     });
// //   }, [setNativeAccount, publicKey, connection]);

// //   return { nativeAccount };
// // };

// const PRECACHED_OWNERS = new Set<string>();
// const precacheUserTokenAccounts = async (
//   connection: Connection,
//   owner?: PublicKey
// ) => {
//   if (!owner) {
//     return;
//   }

//   // used for filtering account updates over websocket
//   PRECACHED_OWNERS.add(owner.toBase58());

//   // user accounts are update via ws subscription
//   const accounts = await connection.getTokenAccountsByOwner(owner, {
//     programId: programIds().token,
//   });
//   accounts.value
//     .map((info) => {
//       const data = deserializeAccount(info.account.data);
//       // need to query for mint to get decimals

//       // TODO: move to web3.js for decoding on the client side... maybe with callback
//       const details = {
//         pubkey: info.pubkey,
//         account: {
//           ...info.account,
//         },
//         info: data,
//       } as TokenAccount;

//       return details;
//     })
//     .forEach((acc) => {
//       accountsCache.set(acc.pubkey.toBase58(), acc);
//     });
// };

export function AccountsProvider({ children = null as any }) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { pools } = usePools(connection);

  return (
    <AccountsContext.Provider
      value={{
        pools
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

// // export function useMint(id?: string) {
// //   const { connection } = useConnection();
// //   const [mint, setMint] = useState<MintInfo>();

// //   useEffect(() => {
// //     if (!id) {
// //       return;
// //     }

// //     cache
// //       .getMint(connection, id)
// //       .then(setMint)
// //       .catch((err) => console.log("useMint-error", err.message));
// //     const onAccountEvent = (e: Event) => {
// //       const event = e as AccountUpdateEvent;
// //       if (event.id === id) {
// //         cache.getMint(connection, id).then(setMint);
// //       }
// //     };

// //     accountEmitter.addEventListener(AccountUpdateEvent.type, onAccountEvent);
// //     return () => {
// //       accountEmitter.removeEventListener(
// //         AccountUpdateEvent.type,
// //         onAccountEvent
// //       );
// //     };
// //   }, [connection, id]);

// //   return mint;
// // }

// export function useUserAccounts() {
//   const context = useContext(AccountsContext);
//   return {
//     userAccounts: context.userAccounts as TokenAccount[],
//   };
// }

const deserializeAccount = (data: Buffer) => {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};

export function useCachedPool() {
  const context = useContext(AccountsContext);
  return {
    pools: context.pools as PoolInfo[],
  };
}

// // const deserializeMint = (data: Buffer) => {
// //   if (data.length !== MintLayout.span) {
// //     throw new Error("Not a valid Mint");
// //   }

// //   const mintInfo = MintLayout.decode(data);

// //   if (mintInfo.mintAuthorityOption === 0) {
// //     mintInfo.mintAuthority = null;
// //   } else {
// //     mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
// //   }

// //   mintInfo.supply = u64.fromBuffer(mintInfo.supply);
// //   mintInfo.isInitialized = mintInfo.isInitialized !== 0;

// //   if (mintInfo.freezeAuthorityOption === 0) {
// //     mintInfo.freezeAuthority = null;
// //   } else {
// //     mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
// //   }

// //   return mintInfo as MintInfo;
// // };
