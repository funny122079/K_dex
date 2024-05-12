import React, { useContext, useState } from "react";
import { Avatar, Col, Row } from "antd";

import ColoredText from "components/typography/ColoredText";
import { SPLTokenListContext } from "context/SPLTokenListContext";

import { ConfirmWrapper } from "./styles";

type ConfirmCreateLPProps = {
  mintAddrList: string[];
  tokenAmountList: number[];
  lpTAmount: number;
};

const cellStyle: React.CSSProperties = {
  padding: "8px 0",
  height: "fit-content",
};

export const ConfirmCreateLP: React.FC<ConfirmCreateLPProps> = ({
  mintAddrList,
  tokenAmountList,
  lpTAmount,
}) => {
  const { tokenList } = useContext(SPLTokenListContext);

  const renderRow = (mintAddress: string, index: number) => {
    const tokenInfo = tokenList.get(mintAddress);
    return (
      <Row key={index} style={{ width: "100%" }}>
        <Col className="gutter-row" span={5}>
          <div style={cellStyle}>
            {tokenInfo ? (
              <Avatar src={tokenInfo.logoURI} size={40} />
            ) : (
              <Avatar size={40} />
            )}
          </div>
        </Col>
        <Col className="gutter-row" span={7}>
          <div style={cellStyle}>
            <ColoredText fonttype="Tiny" font_name="fantasy">
              {tokenInfo ? tokenInfo.symbol : "UNK_TOKN"}
            </ColoredText>
          </div>
        </Col>
        <Col className="gutter-row" span={12}>
          <div style={cellStyle}>
            <ColoredText fonttype="Tiny" font_name="fantasy">
              {tokenAmountList[index]}
            </ColoredText>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <ConfirmWrapper>
      <Row style={{ width: "100%" }}>
        <Col className="gutter-row" span={24}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            Provided Tokens
          </ColoredText>
        </Col>
        <Col className="gutter-row" span={12}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            Tokens
          </ColoredText>
        </Col>
        <Col className="gutter-row" span={12}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            Amounts
          </ColoredText>
        </Col>
      </Row>
      {mintAddrList.map(renderRow)}
      <Row style={{ width: "100%" }}>
        <Col className="gutter-row" span={12}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            LP Token Amount
          </ColoredText>
        </Col>
        <Col className="gutter-row" span={12}>
          <ColoredText fonttype="Tiny" font_name="fantasy">
            {lpTAmount}
          </ColoredText>
        </Col>
      </Row>
    </ConfirmWrapper>
  );
};
