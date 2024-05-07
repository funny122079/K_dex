import React, { useState, useContext } from "react";
import { Button, Card, Popover } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useWallet } from '@solana/wallet-adapter-react';

import { TradeEntry } from "./trade";
import { AddToLiquidity } from "./pool/add";
import { PoolAccounts } from "./pool/view";
import { AccountInfo } from "./accountInfo";
import { Settings } from './settings';

import { WalletModal } from "./modals/wallet_connect_modal";
import { WalletContext } from "../utils/wallet";

export const ExchangeView = (props: {}) => {
  const { connectTryFlag, setConnectTryFlag } = useContext(WalletContext);
  const { publicKey, disconnect } = useWallet();
  const tabStyle: React.CSSProperties = { width: 120 };
  const tabList = [
    {
      key: "trade",
      tab: <div style={tabStyle}>Trade</div>,
      render: () => {
        return <TradeEntry />;
      },
    },
    {
      key: "pool",
      tab: <div style={tabStyle}>Pool</div>,
      render: () => {
        return <AddToLiquidity />;
      },
    },
  ];

  const [activeTab, setActiveTab] = useState(tabList[0].key);

  const onCloseModal = () => {
    setConnectTryFlag(false);
  };

  const onConnectStatusHandler = () => {
      if (publicKey) {
        disconnect();
      } else {
        setConnectTryFlag(true);
      }
  };

  const TopBar = (
    <div className="App-Bar">
      <div className="App-Bar-left">
      </div>
      <div className="App-Bar-right">
        <Button type="text" size="large" style={{ color: "#2abdd2" }}>
          <a
            href={"https://dex.projectserum.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Trade
          </a>
        </Button>
        <AccountInfo />
        {publicKey && (
          <Popover
            placement="bottomRight"
            content={<PoolAccounts />}
            trigger="click"
          >
            <Button type="text">My Pools</Button>
          </Popover>
        )}
        <div>
          {!publicKey && (
            <Button
              type="text"
              size="large"
              onClick={onConnectStatusHandler}
              style={{ color: "#2abdd2" }}
            >
              Connect
            </Button>
          )}
          {publicKey && (
            <Popover
              placement="bottomRight"
              title="Wallet public key"
              trigger="click"
            ></Popover>
          )}
        </div>
        {
          <Popover
            placement="topRight"
            title="Settings"
            content={<Settings />}
            trigger="click"
          >
            <Button
              shape="circle"
              size="large"
              type="text"
              icon={<SettingOutlined />}
            />
          </Popover>
        }
      </div>
    </div>    
  );

  return (
    <>
      {TopBar}
      <Card
        className="exchange-card"
        headStyle={{ padding: 0 }}
        tabList={tabList}
        tabProps={{
          tabBarGutter: 0,
        }}
        activeTabKey={activeTab}
        onTabChange={(key) => {
          setActiveTab(key);
        }}
      >
        {tabList.find((t) => t.key === activeTab)?.render()}
      </Card>
      <WalletModal isShow={connectTryFlag} onClose={() => onCloseModal()} />
    </>
  );
};
