import React from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { shortenAddress } from "./../utils/utils";
import { useNativeAccount } from "./../utils/accounts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const AccountInfo = (props: {}) => {
  const { publicKey } = useWallet();
  const { account } = useNativeAccount();

  if (!publicKey) {
    return null;
  }

  return (
    <div className="wallet-wrapper">
      <span>
        {((account?.lamports || 0) / LAMPORTS_PER_SOL).toFixed(6)} SOL
      </span>
      <div className="wallet-key">
        {shortenAddress(`${publicKey}`)}
      </div>
    </div>
  );
};
