import React, { useContext, useState } from "react";
import { Row, Col, Avatar, Button, Input, Popover, Modal, Radio } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { TokenInfo } from "@solana/spl-token-registry";

import { SPLTokenListContext } from "context/SPLTokenListContext";
import ColoredText from "components/typography/ColoredText";

import { TokenWrapper, CaptionContainer } from "./styles";
import { TokenSelectModal } from "../TokenSelectModal";

const cellStyle: React.CSSProperties = {
  padding: "8px 0",
  height: "fit-content",
};

type SelectTokenProps = {
  mintAddrList: string[];
  setMintAddrList: (arg: string[]) => void;
  addMintAddrList: (arg: string) => void;
  removeMintAddrList: (arg: number) => void;
  tokenAmountList: number[];
  // setTokenAmountList: (index: number, value: number) => void;
  setTokenAmountList: (arg: number[]) => void;
  addTAmount: (arg: number) => void;
  removeTAmount: (arg: number) => void;
  tokenWeightList: number[];
  // setTokenWeightList: (index: number, value: number) => void;
  setTokenWeightList: (arg: number[]) => void;
  addTWeight: (arg: number) => void;
  removeTWeight: (arg: number) => void;
};

export const SelectToken: React.FC<SelectTokenProps> = ({
  mintAddrList,
  setMintAddrList,
  addMintAddrList,
  removeMintAddrList,
  tokenAmountList,
  setTokenAmountList,
  tokenWeightList,
  setTokenWeightList,
  addTAmount,
  removeTAmount,            
  addTWeight,
  removeTWeight,
}) => {
  const { tokenList } = useContext(SPLTokenListContext);

  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);
  const [isShow, setIsShow] = useState(false);

  const handleAddToken = () => {
    addMintAddrList("");
    addTAmount(0);
    addTWeight(0);
  };

  const handleAmountInput = (event: any, index: number) => {
    tokenAmountList[index] = event?.target?.value;
    setTokenAmountList(tokenAmountList);
  };

  const handleWeightInput = (event: any, index: number) => {
    event.persist();
    const newTokenWeightList = [...tokenWeightList]; 
    newTokenWeightList[index] = event?.target?.value;     
    setTokenWeightList(newTokenWeightList);
    
  // const newValue = Number(event.target.value);
  // setTokenWeightList((prev:any[]) => {
  //   const newTokenWeightList = [...prev];
  //   newTokenWeightList[index] = newValue;
  //   return newTokenWeightList;
  // });
  }
  
  const handleRemoveToken = (index: number) => {
    removeMintAddrList(index);
    removeTAmount(index);
    removeTWeight(index);
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  const renderRow = (mintAddress: string, index: number) => {
    console.log(`${mintAddress} and index:${index}`);
    const tokenInfo = tokenList.get(mintAddress);
    return (
      <Row key={index} style={{ width: "100%" }}>
        <Col className="gutter-row" span={3}>
          <div style={cellStyle}>
            {tokenInfo ? (
              <Avatar src={tokenInfo.logoURI} size={40} />
            ) : (
              <Avatar size={40} />
            )}
          </div>
        </Col>
        <Col className="gutter-row" span={5}>
          <div style={cellStyle}>
            <Button
              type="text"
              onClick={() => {
                setActiveTokenIndex(index);
                setIsShow(true);
              }}
            >
              {tokenInfo ? tokenInfo.symbol : "TOKN"}
            </Button>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={cellStyle}>
            {index == 0 && (
              <Input
                placeholder="Amount"
                // value={tokenAmountList[index]}
                onChange={(event) => {
                  handleAmountInput(event, index);
                }}
              />
            )}
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={cellStyle}>
            <Input
              placeholder="Weight"
              // value={tokenWeightList[index]}
              onChange={(event) => {
                handleWeightInput(event, index);
              }}
            />
          </div>
        </Col>
        <Col className="gutter-row" span={4}>
          <div style={cellStyle}>
            <Popover content="Remove">
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveToken(index)}
              />
            </Popover>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <TokenWrapper>
      <Row gutter={10} style={{ width: "100%" }}>
        <Col className="gutter-row" span={3}></Col>
        <Col className="gutter-row" span={5}>
          <div style={cellStyle}>
            <ColoredText fonttype="semiMidTiny" font_name="fantasy">
              Token
            </ColoredText>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={cellStyle}>
            <ColoredText fonttype="semiMidTiny" font_name="fantasy">
              Amount
            </ColoredText>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={cellStyle}>
            <ColoredText fonttype="semiMidTiny" font_name="fantasy">
              Weight
            </ColoredText>
          </div>
        </Col>
        <Col className="gutter-row" span={4}></Col>
        {mintAddrList.map(renderRow)}
      </Row>
      <Popover content="New Token">
        <Button icon={<PlusOutlined />} onClick={handleAddToken} />
      </Popover>
      <TokenSelectModal
        isShow={isShow}
        tokenIndex={activeTokenIndex}
        mintAddrList={mintAddrList}
        onSelectToken={setMintAddrList}
        onClose={() => onCloseModal()}
      />
    </TokenWrapper>
  );
};
