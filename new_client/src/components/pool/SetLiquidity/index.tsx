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
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value: inputValue } = e.target;
  //   const reg = /^-?\d*(\.\d*)?$/;
  //   if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
  //     setLpAmount(Number(inputValue));
  //   }
  // };

  // // '.' at the end or only '-' in the input box.
  // const handleBlur = () => {
  //   let value = lpAmount.toString();
  //   let valueTemp = value;
  //   if (value.charAt(value.length - 1) === "." || value === "-") {
  //     valueTemp = value.slice(0, -1);
  //   }

  //   setLpAmount(Number(valueTemp.replace(/0*(\d+)/, "$1")));
  // };

  return (
    <LPTokenSetContainer>
      <Row style={{ width: "100%" }}>
        <Col className="gutter-row" span={10}>
          <ColoredText fonttype="semiMidTiny" font_name="fantasy">
            LP Token Amount
          </ColoredText>
        </Col>
        <Col className="gutter-row" span={10}>
          <Input
            placeholder="Amount"
            // value={lpAmount}
            onChange={handleChange}
            // onBlur={handleBlur}
            maxLength={10}
          />
        </Col>
        <Col className="gutter-row" span={4}></Col>
      </Row>
    </LPTokenSetContainer>
  );
};
