import React, { useContext } from "react";
import {
  Account,
  clusterApiUrl,
  Connection,
  ConfirmOptions,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";

import { useLocalStorageState } from "./utils";
import { setProgramIds } from "./ids";

export type ENV = "mainnet-beta" | "testnet" | "devnet" | "localnet";

export const ENDPOINTS = [
  {
    name: "mainnet-beta" as ENV,
    endpoint: clusterApiUrl("mainnet-beta"),
  },
  { name: "testnet" as ENV, endpoint: clusterApiUrl("testnet") },
  { name: "devnet" as ENV, endpoint: clusterApiUrl("devnet") },
  { name: "localnet" as ENV, endpoint: "http://127.0.0.1:8899" },
];

const DEFAULT = ENDPOINTS[2].endpoint;
const DEFAULT_SLIPPAGE = 0.25;

interface ConnectionConfig {
  endpoint: string;
  slippage: number;
  setSlippage: (val: number) => void;
  env: ENV;
  setEndpoint: (val: string) => void;
}

const ConnectionContext = React.createContext<ConnectionConfig>({
  endpoint: DEFAULT,
  setEndpoint: () => {},
  slippage: DEFAULT_SLIPPAGE,
  setSlippage: (val: number) => {},
  env: ENDPOINTS[2].name,
});

export function ConnectionProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useLocalStorageState(
    "connectionEndpts",
    ENDPOINTS[2].endpoint
  );

  const [slippage, setSlippage] = useLocalStorageState(
    "slippage",
    DEFAULT_SLIPPAGE.toString()
  );

  const env =
    ENDPOINTS.find((end) => end.endpoint === endpoint)?.name ||
    ENDPOINTS[2].name;

  setProgramIds(env);

  return (
    <ConnectionContext.Provider
      value={{
        endpoint,
        setEndpoint,
        slippage: parseFloat(slippage),
        setSlippage: (val) => setSlippage(val.toString()),
        env,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnectionConfig() {
  const context = useContext(ConnectionContext);
  return {
    endpoint: context.endpoint,
    setEndpoint: context.setEndpoint,
    env: context.env,
  };
}

export function getEndpointName(endPoint: string) {
  const endPointObject = ENDPOINTS.find((ep) => ep.endpoint === endPoint);
  return endPointObject ? endPointObject.name : "";
};

export const sendTransaction = async (
  connection: Connection,
  walletPubKey: PublicKey,
  transaction: Transaction,
  signTransaction: SignerWalletAdapterProps['signTransaction'],
  signers: Account[],
) => {
  let txid;
  try{
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.setSigners(
      // fee payied by the wallet owner
      walletPubKey,
      ...signers.map((s) => s.publicKey)
    );
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
    
    transaction = await signTransaction(transaction);
    let options : ConfirmOptions = {
      skipPreflight: true,
      commitment: "singleGossip",
    };

    txid = await sendAndConfirmTransaction(connection, transaction, signers, options);

    if (txid) {
      console.log("sendTransaction Succeed");
    } else {
      console.log("sendTransaction failed.");
    }
  } catch (error) {
    console.log("Connection-sendTransaction error:", error);
  }
      
  return txid;
};