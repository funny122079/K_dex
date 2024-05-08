import React, { useState } from "react";
import { Row, Col, Avatar, Button, Input, Popover, Modal, Radio } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

import ColoredText from "components/typography/ColoredText";

import { TokenWrapper, CaptionContainer } from "./styles";
import { TokenSelectModal } from "../TokenSelectModal";
interface Token {
  symbol: string;
  avatar: string;
}

const initialTokens: Token[] = [
  { symbol: "TOKN", avatar: "" },
  { symbol: "TOKN", avatar: "" },
];

const tokensList: Token[] = [
  { symbol: "BTC", avatar: "https://example.com/btc.png" },
  { symbol: "ETH", avatar: "https://example.com/eth.png" },
  //...
];

export const SelectToken: React.FC = () => {
  const [tokens, setTokens] = useState(initialTokens);
  const [modalVisible, setModalVisible] = useState(false);
  const [tokenIndex, setTokenIndex] = useState<number | null>(null);
    const [isShow, setIsShow] = useState(false);

  const handleAddToken = () => {
    const newToken: Token = tokensList[tokenIndex!] || {
      symbol: "New Token",
      avatar: "https://example.com/new.png",
    };
    setTokens((prev) => [...prev, newToken]);
    setTokenIndex(null);
  };

  const handleRemoveToken = (index: number) => {
    setTokens((prev) => prev.filter((_, i) => i !== index));
  };

  const cellStyle: React.CSSProperties = {
    padding: "8px 0",
    height: "fit-content",
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  const renderRow = (token: Token, index: number) => {
    console.log(`${token.symbol} and index:${index}`);
    return (
      <>
        <Col className="gutter-row" span={3}>
          <div style={cellStyle}>
            <Avatar src={token.avatar} />
          </div>
        </Col>
        <Col className="gutter-row" span={5}>
          <div style={cellStyle}>
            <Button type="text" onClick={() => setIsShow(true)}>
              {token.symbol}
            </Button>
          </div>
        </Col>
        <Col className="gutter-row" span={12}>
          <div style={cellStyle}>
            <Input placeholder="Weight" />
          </div>
        </Col>
        <Col className="gutter-row" span={4}>
          <div style={cellStyle}>
            <Popover content="Remove">
              <Button
                icon={<CloseOutlined />}
                onClick={() => handleRemoveToken(index)}
              />
            </Popover>
          </div>
        </Col>
      </>
    );
  };

  return (
    <TokenWrapper>
      <Row gutter={10} style={{ width: "100%" }}>
        <Col className="gutter-row" span={8}>
          <div style={cellStyle}>
            <ColoredText fonttype="semiMidTiny" font_name="fantasy">
              Token
            </ColoredText>
          </div>
        </Col>
        <Col className="gutter-row" span={16}>
          <div style={cellStyle}>
            <ColoredText fonttype="semiMidTiny" font_name="fantasy">
              Weight
            </ColoredText>
          </div>
        </Col>
        {tokens.map(renderRow)}
      </Row>
      <Popover content="New Token">
        <Button icon={<PlusOutlined />} onClick={handleAddToken} />
      </Popover>
      <TokenSelectModal isShow={isShow} onClose={() => onCloseModal()}  />
    </TokenWrapper>
  );
};
