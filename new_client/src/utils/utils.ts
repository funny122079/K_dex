import PopularTokens from "./token-list.json";
import { ENV } from "./connection";

export interface KnownToken {
    tokenSymbol: string;
    tokenName: string;
    icon: string;
    mintAddress: string;
  }

const AddressToToken = Object.keys(PopularTokens).reduce((map, key) => {
    const tokens = PopularTokens[key as ENV] as KnownToken[];
    const knownMints = tokens.reduce((map, item) => {
      map.set(item.mintAddress, item);
      return map;
    }, new Map<string, KnownToken>());
  
    map.set(key as ENV, knownMints);
  
    return map;
  }, new Map<ENV, Map<string, KnownToken>>());

export function getTokenIcon(
    env: ENV,
    mintAddress: string
  ): string | undefined {
    return AddressToToken.get(env)?.get(mintAddress)?.icon;
  }