import styled from "styled-components";
import SwapBgImg from "../../images/bg.png";

export const SwapWrapper = styled.div`
  align-items: center;
  background-image: url(${SwapBgImg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 77vw;
  height: 83vh;
`;

export const SwapTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;
`;

export const SwapElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1vh;
  width: 60%;
`;
