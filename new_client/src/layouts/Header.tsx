import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useWallet } from "@solana/wallet-adapter-react";

import { WalletModal } from "../components/wallet_connect_modal";
import {
    HeaderNavWrapper,
    HeaderWrapper,
    MintButton as MintBtn,
    NavWrapper
  } from "./styles";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [header] = useState(false);
  const [ isShow, setIsShow ] = useState(false);
  const { publicKey, disconnect } = useWallet();
  
  const onCloseModal = () => {
    setIsShow(false);
  }

  const openWalletModal = () => {
    console.log("open wallet!");
    setIsShow(true);
  }

  useEffect(() => {
    onCloseModal();
  }, [publicKey])

  return (
    <HeaderWrapper className={header ? "header" : ""}>
      <HeaderNavWrapper>
        <div />
        <NavWrapper>
          <div>K-DEX</div>
        </NavWrapper>
        <div>          
          <MintBtn onClick={() => !publicKey ? openWalletModal() : disconnect()} $bg={true}>
            <img src="/assets/wallet.png" alt=''/>
            {publicKey 
              ? `${publicKey?.toBase58().substring(0, 2)}...${publicKey?.toBase58().substring(38)}`
              : "Connect"
            }
          </MintBtn>
        </div>
      </HeaderNavWrapper>
      <WalletModal
        isShow={isShow}
        onClose={() => onCloseModal()}
      />
    </HeaderWrapper>
  );
};
