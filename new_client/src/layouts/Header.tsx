import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

import type { MenuProps } from "antd";

import { WalletModal } from "components/wallet_connect_modal";
import {
  ENDPOINTS,
  getEndpointName,
  useConnectionConfig,
} from "utils/connection";
import {
  HeaderOperatorContainer,
  HeaderNavWrapper,
  HeaderWrapper,
  MintButton as MintBtn,
  NavWrapper,
} from "./styles";

export const Header: React.FC = () => {
  const { endpoint, setEndpoint } = useConnectionConfig();
  const navigate = useNavigate();
  const [header] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const { publicKey, disconnect } = useWallet();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
    setEndpoint(e.key);
  };

  const endPointListForMenu = useMemo(
    () =>
      ENDPOINTS.map(({ name, endpoint }) => ({
        label: name,
        key: endpoint,
      })),
    []
  );

  const menu = (
    <Menu onClick={handleMenuClick}>
      { endPointListForMenu.map(({ label, key }) => <Menu.Item key={key}>{label}</Menu.Item>) }
    </Menu>
  );

  const onCloseModal = () => {
    setIsShow(false);
  };

  const openWalletModal = () => {
    console.log("open wallet!");
    setIsShow(true);
  };

  useEffect(() => {
    onCloseModal();
  }, [publicKey]);

  return (
    <HeaderWrapper className={header ? "header" : ""}>
      <HeaderNavWrapper>
        <div />
        <NavWrapper>
          <div>K-DEX</div>
        </NavWrapper>
        <HeaderOperatorContainer>
          <MintBtn
            onClick={() => (!publicKey ? openWalletModal() : disconnect())}
            $bg={true}
          >
            <img src="/assets/wallet.png" alt="" />
            {publicKey
              ? `${publicKey?.toBase58().substring(0, 2)}...${publicKey
                  ?.toBase58()
                  .substring(38)}`
              : "Connect"}
          </MintBtn>
          <Dropdown overlay={menu}>
            <Button>
              <Space>
                {getEndpointName(endpoint)}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </HeaderOperatorContainer>
      </HeaderNavWrapper>
      <WalletModal isShow={isShow} onClose={() => onCloseModal()} />
    </HeaderWrapper>
  );
};
