//@ts-nocheck
import React, { useState } from "react";
import {
  AppSidebarWrapper,
  CollapseBtn,
  SearchWrapper,
  SearchBtn,
  DexTitle,
} from "./styles";

import { IoSearchOutline } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
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
  getItem('Tokens', '1', <img src="/assets/images/sidebar/nft.svg" draggable={false} alt="" width={16} height={16}  />),
  getItem('Pools', '2', <img src="/assets/images/sidebar/support.svg" draggable={false} alt="" width={16} height={16}  />),  
];

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
      <AppSidebarWrapper collapse={collapsed} >
        <SearchWrapper>
          <CollapseBtn onClick={toggleCollapsed} collapse={collapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </CollapseBtn>
          <SearchBtn collapse={collapsed}>
            <IoSearchOutline color="#91B760"/>
            <span>Search</span>
          </SearchBtn>
        </SearchWrapper>
        <DexTitle collapse={collapsed}>K-DEX</DexTitle>
        <Menu
          defaultSelectedKeys={['']}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
        />
      </AppSidebarWrapper>
  );
};
