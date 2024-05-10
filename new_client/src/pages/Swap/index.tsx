import React, { useEffect, useState } from "react";
import { Button, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import { CurrencyInput } from "../../components/CurrencyInput";
import { SlippagTolerancePopover } from "../../components/SlippagTolerancePopover";
// import { useCurrencyPairState } from "../../utils/currencyPair";
import {
  SwapElementContainer,
  SwapWrapper,
  SwapTitleContainer,
} from "./styles";
import ColoredText from "components/typography/ColoredText";

interface Token {
  symbol: string;
  avatar: string;
}

const initialTokens: Token[] = [
  { symbol: "USDC", avatar: "" },
  { symbol: "SNTR", avatar: "" },
];

export const Swap: React.FC = () => {
  const [tokens, setTokens] = useState(initialTokens);
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [tokenAmount, setTokenAmount] = useState(0);
  // const { A, B, setLastTypedAccount } = useCurrencyPairState();

  const swapAccounts = () => {
    //   const tempMint = A.mintAddress;
    //   const tempAmount = A.amount;
    //   A.setMint(B.mintAddress);
    //   A.setAmount(B.amount);
    //   B.setMint(tempMint);
    //   B.setAmount(tempAmount);
  };

  const onSwapHandler = () => {

  }

  return (
    <SwapWrapper>
      <SwapTitleContainer>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="small"
          font_name="fantasy"
        >
          Swap
        </ColoredText>
        <Popover
          placement="bottomRight"
          content={
            <SlippagTolerancePopover
              slipTol={slippageTolerance}
              setSlipTol={setSlippageTolerance}
            />
          }
          trigger="click"
        >
          <SettingOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
        </Popover>
      </SwapTitleContainer>
      <CurrencyInput title={tokens[0].symbol} avatar={tokens[0].avatar} onInputChange={(val: number) => {
        setTokenAmount(val);
        }} amount={tokenAmount} />
      <Button type="primary" className="swap-button" onClick={swapAccounts}>
        ⇅
      </Button>
      <CurrencyInput
        title={tokens[1].symbol} avatar={tokens[1].avatar}
        onInputChange={(val: any) => {
          // if (B.amount !== val) {
          //   setLastTypedAccount(B.mintAddress);
          // }
          // B.setAmount(val);
        }}
        // amount={B.amount}
        // mint={B.mintAddress}
        // onMintChange={(item) => {
        // B.setMint(item);
        // }}
      />
      <SwapElementContainer>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="semiSmallTiny"
          font_name="fantasy"
        >
          Price
        </ColoredText>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="Tiny"
          font_name="fantasy"
        >
          {(tokenAmount * 1.5).toFixed(3)} 
        </ColoredText>
      </SwapElementContainer>
      <SwapElementContainer>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="semiSmallTiny"
          font_name="fantasy"
        >
          Price Impact
        </ColoredText>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="Tiny"
          font_name="fantasy"
        >
          {(tokenAmount / 20).toFixed(3)} %
        </ColoredText>
      </SwapElementContainer>
      <SwapElementContainer>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="semiSmallTiny"
          font_name="fantasy"
        >
          Slippage Tolerance
        </ColoredText>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="Tiny"
          font_name="fantasy"
          backgroundType={1}
        >
          {slippageTolerance} %
        </ColoredText>
      </SwapElementContainer>
      <SwapElementContainer>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="semiSmallTiny"
          font_name="fantasy"
        >
          Routes
        </ColoredText>
        <ColoredText
          text_attr_kinds="other_color"
          fonttype="Tiny"
          font_name="fantasy"
        >
          {tokens[0].symbol} - {tokens[1].symbol}
        </ColoredText>
      </SwapElementContainer>
      <Button type="primary" onClick={onSwapHandler} style={{ width: '30vw'}}>Swap</Button>
    </SwapWrapper>
  );
};
