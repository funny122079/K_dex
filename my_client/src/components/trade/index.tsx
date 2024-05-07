import { Button, Spin } from "antd";
import React, { useState, useContext } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import {  
  useConnectionConfig,
  useSlippageConfig,
} from "../../utils/connection";
import { CurrencyInput } from "../currencyInput";
import { LoadingOutlined } from "@ant-design/icons";
import { swap, usePoolForBasket } from "../../utils/pools";
import { notify } from "../../utils/notifications";
import { useCurrencyPairState } from "../../utils/currencyPair";
import { generateActionLabel, POOL_NOT_AVAILABLE, SWAP_LABEL } from "../labels";
import "./trade.less";
import { getTokenName } from "../../utils/utils";
import { WalletContext } from "../../utils/wallet";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const TradeEntry = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { setConnectTryFlag } = useContext(WalletContext);
  const [pendingTx, setPendingTx] = useState(false);
  const { A, B, setLastTypedAccount } = useCurrencyPairState();
  const pool = usePoolForBasket([A?.mintAddress, B?.mintAddress]);
  const { slippage } = useSlippageConfig();
  const { env } = useConnectionConfig();

  const swapAccounts = () => {
    const tempMint = A.mintAddress;
    const tempAmount = A.amount;
    A.setMint(B.mintAddress);
    A.setAmount(B.amount);
    B.setMint(tempMint);
    B.setAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (A.account && B.mintAddress) {
      try {
        setPendingTx(true);

        const components = [
          {
            account: A.account,
            mintAddress: A.mintAddress,
            amount: A.convertAmount(),
          },
          {
            mintAddress: B.mintAddress,
            amount: B.convertAmount(),
          },
        ];

        await swap(connection, publicKey, components, slippage, pool);
      } catch {
        notify({
          description:
            "Please try again and approve transactions from your wallet",
          message: "Swap trade cancelled.",
          type: "error",
        });
      } finally {
        setPendingTx(false);
      }
    }
  };

  return (
    <>
      <div>
        <CurrencyInput
          title="Input"
          onInputChange={(val: any) => {
            if (A.amount !== val) {
              setLastTypedAccount(A.mintAddress);
            }

            A.setAmount(val);
          }}
          amount={A.amount}
          mint={A.mintAddress}
          onMintChange={(item) => {
            A.setMint(item);
          }}
        />
        <Button type="primary" className="swap-button" onClick={swapAccounts}>
          ⇅
        </Button>
        <CurrencyInput
          title="To (Estimate)"
          onInputChange={(val: any) => {
            if (B.amount !== val) {
              setLastTypedAccount(B.mintAddress);
            }

            B.setAmount(val);
          }}
          amount={B.amount}
          mint={B.mintAddress}
          onMintChange={(item) => {
            B.setMint(item);
          }}
        />
      </div>
      <Button
        className="trade-button"
        type="primary"
        size="large"
        onClick={publicKey ? handleSwap : () => {
          setConnectTryFlag(true);
        }} 
        style={{ width: "100%" }}
        disabled={
          (publicKey ? true : false) &&
          (pendingTx ||
            !A.account ||
            !B.mintAddress ||
            A.account === B.account ||
            !A.sufficientBalance() ||
            !pool)
        }
      >
        {generateActionLabel(
          !pool
            ? POOL_NOT_AVAILABLE(
                getTokenName(env, A.mintAddress),
                getTokenName(env, B.mintAddress)
              )
            : SWAP_LABEL,
            publicKey ? true : false,
          env,
          A,
          B,
          true
        )}
        {pendingTx && <Spin indicator={antIcon} className="trade-spinner" />}
      </Button>
    </>
  );
};
