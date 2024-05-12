import React, { useContext, useState } from "react";
import { Button, Input } from "antd";

import ColoredText from "components/typography/ColoredText";
import { LPTokenAmountContainer, LPTokenSetContainer } from "./styles";

export const SetLiquidity: React.FC = () => {
  const onSupplyHandler = () => {};

  return (
    <LPTokenSetContainer>
      <LPTokenAmountContainer>
        <ColoredText>Amount</ColoredText>
        <Input placeholder="Amount"></Input>
      </LPTokenAmountContainer>
      <Button onClick={onSupplyHandler}>Supply</Button>
    </LPTokenSetContainer>
  );
};
