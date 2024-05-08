import React, { useState } from "react";
import { Modal, Button, List, Avatar, Input, Typography } from "antd";
import type { SearchProps } from "antd/es/input/Search";

import {
  TokenSelectModalWrapper,
  TokenSelectModalOverlay,
  CloseBtn,
} from "./styles";

const { Title, Text } = Typography;
const { Search } = Input;

const tokens = [
  {
    avatar: "",
    name: "Token 1",
    description: "This is token 1",
  },
  {
    avatar: "",
    name: "Token 2",
    description: "This is token 2",
  },
  // Add more tokens
];

type TokenSelectLPProps = {
  isShow: boolean;
  onClose: () => void;
};

export const TokenSelectModal: React.FC<TokenSelectLPProps> = ({
  isShow,
  onClose,
}) => {
  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input") {
      console.log(value);
    }
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
        <List
          style={{ width: "40vw" }}
          itemLayout="horizontal"
          dataSource={tokens}
          renderItem={(token) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={token.avatar} />}
                title={<Title level={4}>{token.name}</Title>}
                description={token.description}
              />
            </List.Item>
          )}
        />
      </TokenSelectModalWrapper>
      <TokenSelectModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
