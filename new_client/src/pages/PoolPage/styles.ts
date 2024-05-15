import styled from "styled-components";
import PoolBgImg from "../../images/bg.png";

export const PoolWrapper = styled.div`
  background-image: url(${PoolBgImg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  width: 77vw;
  height: 83vh;
`;

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;

  & img:first-child {
    height: auto;
    margin-right: 1.5vw;
    margin-left: 2vw;
    width: auto;
  }

  & img:last-child {
    height: 100%;
    width: auto;
  }
`;

export const PoolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2vw 2vh;
`;
export const PoolHeaderSection = styled.div`
  .room-header-setting {
    display: flex;
    P {
      display: flex;
      align-items: center;
      color: rgb(186, 187, 183);
      margin-right: 5vw;
      font-size: 14px;
      cursor: pointer;
      svg {
        color: rgb(186, 187, 183);
      }
      span {
        margin-left: 5px;
      }
      &:hover {
        color: #fff;
        svg {
          color: #fff;
        }
      }
    }
  }
  .room-header-leaderboard {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    & > button > .ant-switch-inner > .ant-switch-inner-checked,
    & > button > .ant-switch-inner > .ant-switch-inner-unchecked {
      display: flex;
      height: 100%;
      align-items: center;
    }
  }
`;

export const PoolContainer = styled.div`
  width: 100%;
  height: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PoolControlBar = styled.div`
  width: 100%;
  height: 5vh;
  display: flex;
  flex-direction: row;
  margin-left: 4vw;
  position: relative;

  & > *:first-child {
    margin-right: 20vw;
  }
`;

export const PoolTableContainer = styled.div`
  width: 95%;
  height: 100%;
  margin-top: 1vh;

  .rounded-table .ant-table-container {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  
  .rounded-table .ant-table-body {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

export const OwnerActionContainer = styled.div`
  width: 100%;
  height: 100%;

  & > *:first-child {
    margin-right: 1vw;
  }
`;
