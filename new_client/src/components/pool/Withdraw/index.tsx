import React, { useContext, useState } from "react";
import { TokenInfo } from "@solana/spl-token-registry";
import { Avatar, Button, Col, Input, Row } from "antd";

import { SPLTokenListContext } from "context/SPLTokenListContext";
import ColoredText from "components/typography/ColoredText";

import {
  CloseBtn,
  WithdrawModalOverlay,
  WithdrawModalWrapper,
} from "components/pool/Withdraw/styles";
import "components/pool/Withdraw/styles.css";

interface WithdrawProps {
  isShow: boolean;
  mintAddressList?: string[];
  onClose: () => void;
  lptAccountInfo?: TokenInfo;
}

export const Withdraw: React.FC<WithdrawProps> = ({
  isShow,
  mintAddressList,
  onClose,
  lptAccountInfo,
}) => {
  const { tokenList } = useContext(SPLTokenListContext);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  const onWithdrawHandler = () => {
    
  };

  const handleBalanceInput = (event: any) => {
    setWithdrawAmount(event?.target?.value);
  };

  const renderTokenInfo = () => {
    if (!mintAddressList) return <></>;

    const renderResult = mintAddressList?.map((mintAddress, index) => {
      return (
        <Row className="withdraw-row">
          <Col span={2}>
            <Avatar src={tokenList.get(mintAddress)?.logoURI} size={40} />
          </Col>
          <Col span={5}>
            <ColoredText fonttype="semiTiny" font_name="fantasy">
              {tokenList.get(mintAddress)?.symbol}
            </ColoredText>
          </Col>
          <Col span={10}></Col>
          <Col span={5}></Col>
        </Row>
      );
    });

    return renderResult;
  };

  return (
    <>
      <WithdrawModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <Row className="withdraw-row">
          <Col span={3}>
            <ColoredText fonttype="semiTiny" font_name="fantasy">
              Withdraw
            </ColoredText>
          </Col>
          <Col span={21}></Col>
        </Row>
        {lptAccountInfo && (
          <Row className="withdraw-row">
            <Col span={1}></Col>
            <Col span={2}>
              <Avatar src={lptAccountInfo.logoURI} size={40} />
            </Col>
            <Col span={7}>
              <div>
                <ColoredText fonttype="semiTiny" font_name="fantasy">
                  {lptAccountInfo.symbol}
                </ColoredText>
              </div>
            </Col>
            <Col span={8}></Col>
            <Col span={5}>
              <Input
                placeholder="Balance"
                defaultValue={0}
                onChange={(event) => {
                  handleBalanceInput(event);
                }}
              />
            </Col>
            <Col span={1}></Col>
          </Row>
        )}
        <Row className="withdraw-row">
          <Col span={6}>
            <ColoredText fonttype="tiny" font_name="fantasy">
              You will receive
            </ColoredText>
          </Col>
          <Col span={18}></Col>
        </Row>
        {renderTokenInfo()}
        <Row className="withdraw-row">
          <Col span={10}></Col>
          <Col span={4}>
            <Button type="primary" onClick={onWithdrawHandler}>
              Withdraw
            </Button>
          </Col>
          <Col span={10}></Col>
        </Row>
      </WithdrawModalWrapper>
      <WithdrawModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
