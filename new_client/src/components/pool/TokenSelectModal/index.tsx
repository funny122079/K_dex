import React, { useContext, useEffect, useState } from "react";
import { Avatar, Input, Pagination } from "antd";
import type { SearchProps } from "antd/es/input/Search";

import { TokenInfo } from "@solana/spl-token-registry";
import { SPLTokenListContext } from "context/SPLTokenListContext";

import {
  TokensContainer,
  TokenLabelContainer,
  TokenSelectModalWrapper,
  TokenSelectModalOverlay,
  CloseBtn,
} from "./styles";
import ColoredText from "components/typography/ColoredText";

const { Search } = Input;

type TokenSelectLPProps = {
  isShow: boolean;
  mintAddrList: string[];
  onClose: () => void;
  onSelectToken: (arg: string[]) => void;
  tokenIndex: number;
};

export const DISPLAY_TOKEN_CNT_PER_PAGE = 5;

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
  tokenIndex,
}) => {
  const { tokenList } = useContext(SPLTokenListContext);
  const [baseTokenListToDisplay, setBaseTokenListToDisplay] =
    useState(tokenList);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayTokenList, setDisplayTokenList] = useState<
    Array<[string, TokenInfo]>
  >([]);

  useEffect(() => {
    if (baseTokenListToDisplay) {
      const indexOfLastToken = currentPage * DISPLAY_TOKEN_CNT_PER_PAGE;
      const indexOfFirstToken = indexOfLastToken - DISPLAY_TOKEN_CNT_PER_PAGE;

      const tokenEntries = Array.from(baseTokenListToDisplay.entries());
      if (tokenEntries.length > indexOfFirstToken) {
        setDisplayTokenList(
          tokenEntries.slice(indexOfFirstToken, indexOfLastToken)
        );
      }
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input") {
      if (value === "") {
        setBaseTokenListToDisplay(tokenList);
      } else {
        let filteredTokenList = new Map(
          [...baseTokenListToDisplay].filter(([key, tokenInfo]) =>
            tokenInfo.symbol.includes(value)
          )
        );

        setBaseTokenListToDisplay(filteredTokenList);
      }

      setCurrentPage(1);
    }
  };

  const onSelectTokenHandler = (address: string, logoURI: string) => {
    mintAddrList[tokenIndex] = address;
    onSelectToken(mintAddrList);
    onClose();
  };

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
        <div style={{ width: "100%", marginTop: "1vh" }}>
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={baseTokenListToDisplay.size}
            pageSize={DISPLAY_TOKEN_CNT_PER_PAGE}
            showSizeChanger={false}
          />
        </div>
        <TokensContainer>
          {displayTokenList.map(([address, { name, symbol, logoURI }]) => (
            <div
              key={address}
              onClick={() =>
                onSelectTokenHandler(address, logoURI ? logoURI : "")
              }
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "3vh",
              }}
            >
              <Avatar src={logoURI} size={40} />
              <TokenLabelContainer>
                <ColoredText fonttype="semiMidTiny" font_name="fantasy">
                  {symbol}
                </ColoredText>
                <ColoredText fonttype="semiMidTiny" font_name="fantasy">
                  {name}
                </ColoredText>
              </TokenLabelContainer>
            </div>
          ))}
        </TokensContainer>
      </TokenSelectModalWrapper>
      <TokenSelectModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
