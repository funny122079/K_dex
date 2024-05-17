import React, { useContext, useState } from "react";
import { Avatar, Button, Col, Input, Row } from "antd";

import ColoredText from "components/typography/ColoredText";
import { SPLTokenListContext } from "context/SPLTokenListContext";

import {
  CloseBtn,
  DepositModalOverlay,
  DepositModalWrapper,
} from "components/pool/Deposit/styles";
import "components/pool/Deposit/styles.css";

interface DepositProps {
  isShow: boolean;
  mintAddressList?: string[];
  onClose: () => void;
  weightList?: number[];
}

export const Deposit: React.FC<DepositProps> = ({
  isShow,
  mintAddressList,
  onClose,
  weightList,
}) => {
  const { tokenList } = useContext(SPLTokenListContext);
  const [amounts, setAmounts] = useState<number[]>(
    Array.from(
      { length: mintAddressList ? mintAddressList.length : 0 },
      () => 0
    )
  );

  const handleBalanceInput = (event: any, index: number) => {
    try {
      if (parseFloat(event?.target?.value) > 0) {
        setAmounts(
          amounts.map((item, itemIndex) =>
            itemIndex === index ? parseFloat(event.target.value) : item
          )
        );
      }
    } catch (err) {
      console.log("Deposit-handleBalanceInput: error", err);
    }
  };

  const renderTokenInfo = () => {
    if (!mintAddressList) return <></>;

    const renderResult = mintAddressList?.map((mintAddress, index) => {
      return (
        <Row className="deposit-row">
          <Col span={1}></Col>
          <Col span={2}>
            <Avatar src={tokenList.get(mintAddress)?.logoURI} size={40} />
          </Col>
          <Col span={5}>
            <div>
              <ColoredText fonttype="semiTiny" font_name="fantasy">
                {tokenList.get(mintAddress)?.symbol}
              </ColoredText>
              <ColoredText fonttype="semiTiny" font_name="fantasy">
                {weightList && weightList[index]}%
              </ColoredText>
            </div>
          </Col>
          <Col span={10}></Col>
          <Col span={5}>
            <Input
              placeholder="Balance"
              defaultValue={0}
              onChange={(event) => {
                handleBalanceInput(event, index);
              }}
            />
          </Col>
          <Col span={1}></Col>
        </Row>
      );
    });

    return renderResult;
  };

  const onDepositHandler = () => {
    // const components: LiquidityComponent[] = [
    //   {
    //     account: ataA,
    //     mintAddress: mintAddrA,
    //     amount: 10,
    //   },
    //   {
    //     account: ataB,
    //     mintAddress: mintAddrB,
    //     amount: 10,
    //   },
    //   {
    //     account: ataS,
    //     mintAddress: mintAddrS,
    //     amount: 10,
    //   },
    // ];
    // addLiquidity();
  };

  return (
    <>
      <DepositModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <Row className="deposit-container deposit-row">
          <Col span={3}>
            <ColoredText fonttype="semiTiny" font_name="fantasy">
              Deposit
            </ColoredText>
          </Col>
          <Col span={21}></Col>
        </Row>
        {renderTokenInfo()}
        <Row className="deposit-row">
          <Col span={6}>
            <ColoredText fonttype="tiny" font_name="fantasy">
              Price impact
            </ColoredText>
          </Col>
          <Col span={14}></Col>
          <Col span={4}>%</Col>
          <Col span={6}>
            <ColoredText fonttype="tiny" font_name="fantasy">
              You will receive
            </ColoredText>
          </Col>
          <Col span={14}></Col>
          <Col span={4}>LP</Col>
        </Row>
        <Row className="deposit-row">
          <Col span={10}></Col>
          <Col span={4}>
            <Button type="primary" onClick={onDepositHandler}>
              Deposit
            </Button>
          </Col>
          <Col span={10}></Col>
        </Row>
      </DepositModalWrapper>
      <DepositModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
