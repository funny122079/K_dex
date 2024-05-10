import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { useConnectionConfig } from "../utils/connection";

export const SPLTokenListContext = createContext<{ tokenList: Map<string, TokenInfo> }>({ tokenList: new Map()});

export const SPLTokenListProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { env } = useConnectionConfig();
  const [tokenList, setTokenList] = useState<Map<string, TokenInfo>>(new Map());

  useEffect(() => {
    const fetchTokenList = async () => {
      const tokens = await new TokenListProvider().resolve();
      const list = tokens.filterByClusterSlug(env).getList();
      setTokenList(
        list.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
    };
  
    fetchTokenList();
  }, []);

  return (
    <SPLTokenListContext.Provider value={{ tokenList }}>
      {children}
    </SPLTokenListContext.Provider>
  );
};