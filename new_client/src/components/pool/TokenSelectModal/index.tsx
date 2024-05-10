import React, { useContext, useState } from "react";
import { Avatar, Input, Typography } from "antd";
import type { SearchProps } from "antd/es/input/Search";

import { SPLTokenListContext } from "context/SPLTokenListContext";

import {
  TokensContainer,
  TokenSelectModalWrapper,
  TokenSelectModalOverlay,
  CloseBtn,
} from "./styles";

const { Search } = Input;

type TokenSelectLPProps = {
  isShow: boolean;
  mintAddrList: string[];
  onClose: () => void;
  onSelectToken: (arg: string[]) => void;
  tokenIndex: number;
};

// export const Icon = (props: { mint: string }) => {
// const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

//   useEffect(() => {
//     new TokenListProvider().resolve().then(tokens => {
//       const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();

//       setTokenMap(tokenList.reduce((map, item) => {
//         map.set(item.address, item);
//         return map;
//       },new Map()));
//     });
//   }, [setTokenMap]);

//   const token = tokenMap.get(props.mint);
//   if (!token || !token.logoURI) return null;

//   return (<img src={token.logoURI} />);
// }

export const TokenSelectModal: React.FC<TokenSelectLPProps> = ({  
  isShow,
  mintAddrList,
  onClose,
  onSelectToken,
  tokenIndex
}) => {
  const { tokenList } = useContext(SPLTokenListContext);
  const [displayTokenList, setDisplayTokenList] = useState(tokenList);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input") {
      console.log(value);
      let filteredTokenList = new Map(
        [...displayTokenList].filter(([key, tokenInfo]) => tokenInfo.symbol === value)
      );

      setDisplayTokenList(filteredTokenList);
    }
  };

  const onSelectTokenHandler = (address: string) => {
    mintAddrList[tokenIndex] = address;
    onSelectToken(mintAddrList);
  }

  return (
    <>
      <TokenSelectModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: "40vw" }}
        />
        <TokensContainer>
          {Array.from(displayTokenList).map(([address, { name, symbol, logoURI }]) => (
            <div
              key={address}
              onClick={() => onSelectTokenHandler(address)}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Avatar src={logoURI} size={30} />
              <div style={{ marginLeft: "10px" }}>
                <h4>{symbol}</h4>
                <p>{name}</p>
              </div>
            </div>
          ))}
        </TokensContainer>
      </TokenSelectModalWrapper>
      <TokenSelectModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
