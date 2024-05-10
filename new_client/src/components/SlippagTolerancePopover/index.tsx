import React from "react";
import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";

import ColoredText from "components/typography/ColoredText";
import { SlippagToleranceWrapper } from "./styles";

type SlippagTolerancePopoverProps = {
    slipTol: number;
    setSlipTol: (arg: number) => void;
  };

export const SlippagTolerancePopover: React.FC<SlippagTolerancePopoverProps> = ({slipTol, setSlipTol}) => {
  const onChange = (e: RadioChangeEvent) => {
    setSlipTol(e.target.value);
  };

  return (
    <SlippagToleranceWrapper>
      <ColoredText fonttype="semiSmallTiny" font_name="fantasy">
        Slippage Tolerance
      </ColoredText>
      <Radio.Group value={slipTol} onChange={onChange} style={{ marginBottom: 16 }}>
        <Radio.Button value={1}>1%</Radio.Button>
        <Radio.Button value={5}>5%</Radio.Button>
        <Radio.Button value={10}>10%</Radio.Button>
        <Radio.Button value={0}>Free</Radio.Button>
      </Radio.Group>
    </SlippagToleranceWrapper>
  );
};
