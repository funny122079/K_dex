import React, { useContext, useState } from "react";
import { Row, Col, Avatar, Button, Input, Popover, Modal, Radio } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { TokenInfo } from "@solana/spl-token-registry";

import { SPLTokenListContext } from "context/SPLTokenListContext";
import ColoredText from "components/typography/ColoredText";

import { TokenWrapper, CaptionContainer } from "./styles";
import { TokenSelectModal } from "../TokenSelectModal";

const cellStyle: React.CSSProperties = {
  padding: "8px 0",
  height: "fit-content",
};

const initialTokenAddressList: string[] = ["", ""];

export const SelectToken: React.FC = () => {
  const { tokenList } = useContext(SPLTokenListContext);
  const [mintAddresss, setMintAddresss] = useState(initialTokenAddressList);
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [isShow, setIsShow] = useState(false);

  const handleAddToken = () => {
    setMintAddresss((prev) => [...prev, ""]);
  };

  const handleRemoveToken = (index: number) => {
    setMintAddresss((prev) => prev.filter((_, i) => i !== index));
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  const renderRow = (mintAddress: string, index: number) => {
    console.log(`${mintAddress} and index:${index}`);
    const tokenInfo = tokenList.get(mintAddress);
    return (
      <>
        <Col className="gutter-row" span={3}>
          <div style={cellStyle}>
            {tokenInfo?(<Avatar src={tokenInfo.logoURI} />):(<Avatar />)}
          </div>
        </Col>
        <Col className="gutter-row" span={5}>
          <div style={cellStyle}>
            <Button type="text" onClick={() => {
              setActiveTokenIndex(index);
              setIsShow(true);              
            }}>
              {tokenInfo?tokenInfo.symbol:"TOKN"}
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
        {mintAddresss.map(renderRow)}
      </Row>
      <Popover content="New Token">
        <Button icon={<PlusOutlined />} onClick={handleAddToken} />
      </Popover>
      <TokenSelectModal isShow={isShow} tokenIndex={activeTokenIndex} mintAddrList={mintAddresss} onSelectToken={setMintAddresss} onClose={() => onCloseModal()} />
    </TokenWrapper>
  );
};
