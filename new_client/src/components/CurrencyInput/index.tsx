import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Avatar, Button, Select } from "antd";
import { NumericInput } from "../numericInput";
import { TokenSelectModal } from "../pool/TokenSelectModal";
// // import { useUserAccounts, useMint } from "../../utils/accounts";
// // import { useUserAccounts } from "../../utils/accounts";

import {
  CurrencyInputCardWrapper,
  CurrencyInputHeader,
  CurrencyInputHeaderLeft,
  CurrencyInputHeaderRight,
} from "components/CurrencyInput/styles";

// import { PoolIcon, TokenIcon } from "../tokenIcon";
// import { TokenAccount } from "../../models";
// import PopularTokens from "../../utils/token-list.json";

// const { Option } = Select;

const cellStyle: React.CSSProperties = {
  padding: "8px 0",
  height: "fit-content",
};

export const CurrencyInput = (props: {
  avatar: string;
  mint?: string;
  amount?: number;
  title?: string;
  onInputChange?: (val: number) => void;
  onMintChange?: (account: string) => void;
}) => {
  const [isShow, setIsShow] = useState(false);
  //   const { userAccounts } = useUserAccounts();
  //   // const mint = useMint(props.mint);

  const userUiBalance = () => {
    if (props.amount) return props.amount;
    //     // const currentAccount = userAccounts?.find(
    //     //   (a: any) => a.info.mint.toBase58() === props.mint
    //     // );
    //     // if (currentAccount) {
    //     //   // if (currentAccount && mint) {
    //     //   return (
    //     //     currentAccount.info.amount.toNumber() / Math.pow(10, mint.decimals)
    //     //   );
    //     // }

    return 0;
  };

  const onCloseModal = () => {
    setIsShow(false);
  };

  return (
    <CurrencyInputCardWrapper>
      <CurrencyInputHeader>
        <CurrencyInputHeaderLeft>
          <div style={cellStyle}>
            <Avatar src={props.avatar} size={40} />
          </div>
          <div style={cellStyle}>
            <Button type="text" onClick={() => setIsShow(true)}>
              {props.title}
            </Button>
          </div>
        </CurrencyInputHeaderLeft>
        <CurrencyInputHeaderRight>
          <NumericInput
            value={props.amount}
            onChange={(val: any) => {
              if (props.onInputChange) {
                props.onInputChange(val);
              }
            }}
            style={{
              fontSize: 20,
              boxShadow: "none",
              outline: "transpaernt",
            }}
            placeholder="0.00"
          />
        </CurrencyInputHeaderRight>
      </CurrencyInputHeader>
      {/* <TokenSelectModal isShow={isShow} onClose={() => onCloseModal()} /> */}
    </CurrencyInputCardWrapper>
  );
};
