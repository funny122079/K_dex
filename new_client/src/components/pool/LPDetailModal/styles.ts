import { styled } from "styled-components";

export const LPDetailModalWrapper = styled.div<{ $isshow: boolean }>`
  width: 83vw;
  height: 83vh;
  position: fixed;
  background-clip: padding-box, border-box;
  background-color: #ffffff;
  background-origin: border-box;
  border: 1px solid;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  z-index: 12;
  padding: 20px 20px 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ $isshow }) => ($isshow ? 1 : 0)};
  visibility: ${({ $isshow }) => ($isshow ? "visible" : "hidden")};
`;

export const LPDetailModalOverlay = styled.div<{ $isshow: boolean }>`
  position: fixed;
  z-index: 11;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(15, 17, 20, 0.8);
  opacity: ${({ $isshow }) => ($isshow ? 1 : 0)};
  visibility: ${({ $isshow }) => ($isshow ? "visible" : "hidden")};
`;

export const CloseBtn = styled.div`
  span {
    cursor: pointer;
  }
  color: rgb(160, 160, 160);
  font-size: 25px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const LPOperationContainer = styled.div`
  display: flex;
  flex-direction: row;

  & > *:first-child {
    margin-right: 0.5vw;
  }
`;

export const CenterElements = styled.div`
  display: flex;
  justify-content: center;  
  width: 100%;
  height: 100%;
`;