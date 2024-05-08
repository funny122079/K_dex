import styled from "styled-components";

export const AppLayoutWrapper = styled.div`
  position: relative;
  max-height: 100vh;
`;

export const HeaderWrapper = styled.div`
  align-items: center;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(0deg, #191f2d, #191f2d), linear-gradient(269.92deg, rgba(149, 161, 180, .15), rgba(1, 3, 20, .5) 20.69%, rgba(149, 161, 180, .15) 49.94%, rgba(1, 3, 20, .5) 81.52%, rgba(149, 161, 180, .15));
  background-origin: border-box;
  border: 1px solid transparent;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px 15px;
`;

export const HeaderNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  div {
    display: flex;
  }
`;

export const MintButton = styled.div<{ $bg?: boolean }>`
  color: #fff;
  width: ${({ $bg }) => !$bg && "100px" };
  height: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  background: ${({ $bg }) => $bg && "linear-gradient(277.33deg, #18a672, #5ec03a 47.21%, #15a1b7 93.62%)" };
  img {
    margin-right: 10px;
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 50px 0;
  font-size: 20px;
  p {
    justify-content: center;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  }
  a {
    white-space: nowrap;
    color: #fff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
    &:last-child {
      margin-left: 14px;
    }
    @media screen and (max-width: 525px) {
      &:last-child {
        margin-left: 0;
      }
    }
  }
`;

export const AppSidebarWrapper = styled.div<{ collapse : string }>`
  width: ${({collapse}) => collapse === 'true' ? "92px" : "230px"};
  min-width: ${({collapse}) => collapse === 'true' ? "92px" : "230px"};
  align-items: flex-start;
  background: linear-gradient(180deg, #121724, #191f2d), linear-gradient(180deg, rgba(149, 161, 180, .15), rgba(1, 3, 20, .5) 20.69%, rgba(149, 161, 180, .15) 49.94%, rgba(1, 3, 20, .5) 81.52%, rgba(149, 161, 180, .15));
  background-clip: padding-box, border-box;
  background-origin: border-box;
  border: 1px solid transparent;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: calc(100vh - 112px);
  max-height: calc(100vh - 112px);
  padding: 10px 0;
  overflow-y: scroll;
  & > .ant-menu {
    background-color: transparent;
  }
  & > .ant-menu > .ant-menu-submenu > .ant-menu-sub {
    background-color: #1F2738;
  }
  /* & > .ant-menu > .ant-menu-submenu > .ant-menu > .ant-menu-item-selected {
    background-color: transparent;
  } */
  & > .ant-menu > .ant-menu-item-selected {
    background-color: #1F2738;
  }
  & > .ant-menu {
    .ant-menu-submenu:nth-child(5) {
      border: 2px dashed #B5E15E;
    }
  }
`;
export const AppContentWrapper = styled.div`
  width: 100%;
  padding: 0 25px;
`;

export const Content = styled.div`
  display: flex;
  height: 100%;
  margin-top: 20px;
`;
export const CollapseBtn = styled.div<{ collapse : string }>`
  background-color: #232B3D;
  border-radius: 8px;
  height: ${({collapse}) => collapse !== 'true' ? "30px" : "38px"};
  width: ${({collapse}) => collapse !== 'true' ? "30px" : "70px"};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #91B760;
  font-size: ${({collapse}) => collapse !== 'true' ? "12px" : "15px"};
  margin-left: 5px;
  cursor: pointer;
`
export const SearchWrapper = styled.div`
  display: flex;
  margin-bottom: 5px;
`
export const SearchBtn = styled.div<{ collapse : string }>`
  width: 140px;
  align-items: center;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(0deg, #191f2d, #191f2d), linear-gradient(269.92deg, rgba(149, 161, 180, .15), rgba(1, 3, 20, .5) 20.69%, rgba(149, 161, 180, .15) 49.94%, rgba(1, 3, 20, .5) 81.52%, rgba(149, 161, 180, .15));
  background-origin: border-box;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: ${({collapse}) => collapse === 'true' ? "none" : "flex" };
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-left: 10px;
  margin-right: 10px;
  padding: 0 8px;
  height: 30px;
  color: #b7c6c9;
  font-size: 12px;
  span {
    margin-left: 5px;
  }
`
export const DexTitle = styled.div<{ collapse : string }>`
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  margin: 15px 0 0px 5px;
  display: ${({collapse}) => collapse === 'true' && "none"};
`
export const NavWrapper = styled.div`
  div {
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    & > svg {
      margin-right: 5px;
    }
    &:nth-child(1) {
      margin-right: 20px;
    }
  }
`