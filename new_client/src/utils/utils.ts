import { useContext, useCallback, useState } from "react";
import { SPLTokenListContext } from "context/SPLTokenListContext";

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState: string) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export function useTokenIcon(  
  mintAddress: string
): string {
  const { tokenList } = useContext(SPLTokenListContext);

  const tokenIconURI = tokenList.get(mintAddress)?.logoURI;
  if (tokenIconURI) {
    return tokenIconURI;
  }

  return "";
}