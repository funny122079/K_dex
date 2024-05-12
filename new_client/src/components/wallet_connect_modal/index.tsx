import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";

import {
  WalletModalWrapper,
  WalletModalOverlay,
  WalletList,
  ListItem,
  CloseBtn,
  TitleContainer,
  TitleImageWrapper,
  TitlePrimaryCaptionWrapper,
  TitleSecondaryCaptionWrapper,
} from "./styles";
import { connnectWalletList } from "../../layouts/data";
import { toast } from "react-toastify";

type SidebarProps = {
  isShow: boolean;
  onClose: () => void;
};

export const WalletModal: React.FC<SidebarProps> = ({ isShow, onClose }) => {
  const [connectList] = useState(connnectWalletList);
  const { connect, wallet, wallets, select } = useWallet();

  const selectWallet = (walletName: WalletName) => {
    console.log("selectWallet!", walletName);
    select(walletName);
    if (wallet) {
      console.log("wallet selected");
      connect();
    } else {
      console.log("Failed to select");
    }
  };

  return (
    <>
      <WalletModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <TitleContainer>
          <TitleImageWrapper />
          <TitlePrimaryCaptionWrapper />
          <TitleSecondaryCaptionWrapper />
        </TitleContainer>
        <WalletList>
          {wallets.map((wallet: any) => {
            if (
              connectList.filter(
                (connectable: any) => wallet.adapter.name === connectable.label
              ).length > 0
            ) {
              if (
                wallet.readyState === "Installed" ||
                wallet.readyState === "Loadable"
              ) {
                return (
                  <ListItem
                    key={wallet.adapter.name}
                    onClick={() => selectWallet(wallet.adapter.name)}
                  >
                    <img src={wallet.adapter.icon} alt="" draggable="false" />
                    {wallet.adapter.name}
                  </ListItem>
                );
              } else {
                return (
                  <ListItem
                    key={wallet.adapter.name}
                    onClick={() => {
                                  console.log(
                        `${wallet.adapter.name} is not supported in your environment`
                      );
                      toast(
                        `${wallet.adapter.name} is not supported in your environment`,
                        {
                          theme: "dark",
                        }
                      );
                    }}
                  >
                    <img src={wallet.adapter.icon} alt="" draggable="false" />
                    {wallet.adapter.name}
                  </ListItem>
                );
              }
            }
          })}
          {connectList.map((item: any, key: any) => {
            if (item.type === "web3") {
              if (
                wallets.filter((wallet) => item.label === wallet.adapter.name)
                  .length === 0
              ) {
                return (
                  <ListItem
                    key={item.label}
                    onClick={() => {
                      console.log("Install the wallet!");
                      toast(`Please install the ${item.label} wallet`, {
                        theme: "dark",
                      })
                    }}
                  >
                    <img src={item.img} alt="" draggable="false" />
                    <span>{item.label}</span>
                  </ListItem>
                );
              }
            }

            return null; // Default return value
          })}
        </WalletList>
      </WalletModalWrapper>
      <WalletModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
