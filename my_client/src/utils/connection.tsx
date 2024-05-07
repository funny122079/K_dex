import React, { useContext, useEffect, useMemo } from "react";

// export type ENV = "mainnet-beta" | "testnet" | "devnet" | "localnet";
export type ENV = "localnet";

export const ENDPOINTS = [
    // {
    //   name: "mainnet-beta" as ENV,
    //   endpoint: "https://solana-api.projectserum.com/",
    // },
    // { name: "testnet" as ENV, endpoint: clusterApiUrl("testnet") },
    // { name: "devnet" as ENV, endpoint: clusterApiUrl("devnet") },
    { name: "localnet" as ENV, endpoint: "http://127.0.0.1:8899" },
  ];

  const DEFAULT = ENDPOINTS[0].endpoint;
  const DEFAULT_SLIPPAGE = 0.25;

interface ConnectionConfig {    
    endpoint: string;
    slippage: number;
    setSlippage: (val: number) => void;
    env: ENV;
    setEndpoint: (val: string) => void;
  }

export const ConnectionContext = React.createContext<ConnectionConfig>({
    endpoint: DEFAULT,
    setEndpoint: () => {},
    slippage: DEFAULT_SLIPPAGE,
    setSlippage: (val: number) => {},
    env: ENDPOINTS[0].name,
  });

  export function useConnectionConfig() {
    const context = useContext(ConnectionContext);
    return {
      endpoint: context.endpoint,
      setEndpoint: context.setEndpoint,
      env: context.env,
    };
  }

  export function useSlippageConfig() {
    const { slippage, setSlippage } = useContext(ConnectionContext);
    return { slippage, setSlippage };
  }