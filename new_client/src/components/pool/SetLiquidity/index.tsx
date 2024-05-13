import React from "react";
import { Col, Input, Row } from "antd";

import ColoredText from "components/typography/ColoredText";
import { LPTokenSetContainer } from "./styles";

type SetLiquidityProps = {
  lpAmount: number;
  setLpAmount: (arg: number) => void;
};

export const SetLiquidity: React.FC<SetLiquidityProps> = ({
  lpAmount,
  setLpAmount,
}) => {
  const handleChange = (event: any) => {
    setLpAmount(event?.target?.value);
  };

  return (
    <LPTokenSetContainer>
      <Row style={{ width: "100%", marginTop: '5vh' }}>
        <Col className="gutter-row" span={10}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            LP Token Amount
          </ColoredText>
        </Col>
        <Col className="gutter-row" span={10}>
          <Input
            placeholder="Amount"
            defaultValue={0}
            onChange={handleChange}
            maxLength={10}
          />
        </Col>
        <Col className="gutter-row" span={4}></Col>
      </Row>
    </LPTokenSetContainer>
  );
};
