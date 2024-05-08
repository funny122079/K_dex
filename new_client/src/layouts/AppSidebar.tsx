//@ts-nocheck
import React, { useContext, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";
import { useWallet } from "@solana/wallet-adapter-react";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import { SelectedMenuContext } from "../context/SelectedMenuContext";
import {
  AppSidebarWrapper,
  CollapseBtn,
  SearchWrapper,
  SearchBtn,
  DexTitle,
} from "./styles";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Swap",
    "1",
    <img
      src="/assets/images/sidebar/nft.svg"
      draggable={false}
      alt=""
      width={16}
      height={16}
    />
  ),
  getItem(
    "Pools",
    "2",
    <img
      src="/assets/images/sidebar/support.svg"
      draggable={false}
      alt=""
      width={16}
      height={16}
    />
  ),
];

export const AppSidebar: React.FC = () => {
  const { setSelectedMenuKey } = useContext(SelectedMenuContext);
  const [collapsed, setCollapsed] = useState(false);
  const { publicKey } = useWallet();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: MenuItem) => {
    // if (e && e.key && publicKey) {
    if (e && e.key) {
      console.log(e.key);
      setSelectedMenuKey(e.key.toString());
    }
  };

  return (
    <AppSidebarWrapper collapse={collapsed ? "true" : "false"}>
      <SearchWrapper>
        <CollapseBtn
          onClick={toggleCollapsed}
          collapse={collapsed ? "true" : "false"}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </CollapseBtn>
        <SearchBtn collapse={collapsed ? "true" : "false"}>
          <IoSearchOutline color="#91B760" />
          <span>Search</span>
        </SearchBtn>
      </SearchWrapper>
      <DexTitle collapse={collapsed ? "true" : "false"}>K-DEX</DexTitle>
      <Menu
        defaultSelectedKeys={[""]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        onClick={handleMenuClick}
      />
    </AppSidebarWrapper>
  );
};
