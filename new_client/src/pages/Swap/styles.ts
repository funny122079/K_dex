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
  margin-top: 1vw;
  justify-content: space-between;
  width: 70%;
`;

export const SwapElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1vh;
  text-align: center;
  width: 60%;
`;

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;

  & img:first-child {
    height: 6vw;
    margin-right: 1.5vw;
    margin-left: 2vw;
    width: 6vw;
  }

  & img:last-child {
    height: 100%;
    width: auto;
  }
`;