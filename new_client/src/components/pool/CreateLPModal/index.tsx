import React, { useEffect, useState } from "react";
import { Button, message, Steps, theme } from 'antd';

import { SelectToken } from '../SelectToken';
import {
  CreateLPModalWrapper,
  CreateLPModalOverlay,
  CloseBtn,
  StepContainer,
  TitleContainer,
} from "./styles";

type CreateLPProps = {
  isShow: boolean;
  onClose: () => void;
};

const createLPSteps = [
  {
    title: 'Select token & weights',
    content: <SelectToken />,
  },
  {
    title: 'Set liquidity',
    content: 'Second-content',
  },
  {
    title: 'Confirm',
    content: 'Last-content',
  },
];

export const CreateLPModal: React.FC<CreateLPProps> = ({ isShow, onClose }) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = createLPSteps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    height: '40vh',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <CreateLPModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <TitleContainer></TitleContainer>
        <StepContainer>
          <Steps current={current} labelPlacement="vertical" items={items} className="custom-step" />
          <div style={contentStyle}>{createLPSteps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < createLPSteps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === createLPSteps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}            
          </div>
        </StepContainer>
      </CreateLPModalWrapper>
      <CreateLPModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
