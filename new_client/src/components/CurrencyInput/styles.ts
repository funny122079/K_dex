import styled from "styled-components";
import { Card } from "antd";

export const CurrencyInputCardWrapper = styled(Card)`
  borderradius: 2vw;
  padding: 0;

  .ant-select-selector,
  .ant-select-selector:focus,
  .ant-select-selector:active {
    border-color: transparent !important;
    box-shadow: none !important;
  }
`;

export const CurrencyInputHeader = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1vw;

  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  flex-direction: row;
  padding: 0.2vh 0.5vw 0vh 0.5vw;
`;

export const CurrencyInputHeaderLeft = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-width: 0px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  width: fit-content;
`;

export const CurrencyInputHeaderRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  justify-self: flex-end;
  justify-content: flex-end;
`;
