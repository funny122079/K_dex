import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button, message, Steps, theme } from "antd";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Token } from "@solana/spl-token";

import { SelectToken } from "../SelectToken";
import { SetLiquidity } from "../SetLiquidity";
import { ConfirmCreateLP } from "../ConfirmCreateLP";
import { findAssociatedTokenAddress } from "utils/accounts";
import { addLiquidity } from "utils/pools";
import { checkTokenBalances } from "utils/walletUtil";

import {
  CreateLPModalWrapper,
  CreateLPModalOverlay,
  CloseBtn,
  StepContainer,
  TitleContainer,
} from "./styles";
import { LiquidityComponent } from "models";

type CreateLPProps = {
  isShow: boolean;
  onClose: () => void;
};

export const CreateLPModal: React.FC<CreateLPProps> = ({ isShow, onClose }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [mintAddresss, setMintAddresss] = useState<string[]>(["", ""]);
  const [tokenAmounts, setTokenAmounts] = useState<number[]>([0, 0]);
  const [tokenWeights, setTokenWeights] = useState<number[]>([0, 0]);
  const [lpTokenAmount, setLpTokenAmount] = useState(0);

  const addMintAddress = (newMintAddress: string) => {
    setMintAddresss([...mintAddresss, newMintAddress]);
  };

  const addTAmount = (amount: number) => {
    setTokenAmounts([...tokenAmounts, amount]);
  };

  const addTWeight = (weight: number) => {
    setTokenWeights([...tokenWeights, weight]);
  };

  const removeTAmount = (indexToRemove: number) => {
    setTokenAmounts(tokenAmounts.filter((_, index) => index !== indexToRemove));
  };

  const removeTWeight = (indexToRemove: number) => {
    setTokenWeights(tokenWeights.filter((_, index) => index !== indexToRemove));
  };

  const removeMintAddress = (indexToRemove: number) => {
    setMintAddresss(mintAddresss.filter((_, index) => index !== indexToRemove));
  };

  const createLPSteps = [
    {
      title: "Select token & weights",
      content: (
        <SelectToken
          mintAddrList={mintAddresss}
          setMintAddrList={setMintAddresss}
          addMintAddrList={addMintAddress}
          removeMintAddrList={removeMintAddress}
          tokenAmountList={tokenAmounts}
          setTokenAmountList={setTokenAmounts}
          addTAmount={addTAmount}
          removeTAmount={removeTAmount}
          tokenWeightList={tokenWeights}
          setTokenWeightList={setTokenWeights}
          addTWeight={addTWeight}
          removeTWeight={removeTWeight}
        />
      ),
    },
    {
      title: "Set liquidity",
      content: (
        <SetLiquidity lpAmount={lpTokenAmount} setLpAmount={setLpTokenAmount} />
      ),
    },
    {
      title: "Confirm",
      content: (
        <ConfirmCreateLP
          mintAddrList={mintAddresss}
          tokenAmountList={tokenAmounts}
          lpTAmount={lpTokenAmount}
        />
      ),
    },
  ];

  const next = async () => {
    switch (current) {
      case 0:
        
        if (tokenAmounts[0] <= 0) {
          toast(`Please, input correct token amount`, {
            theme: "dark",
          });

          return;
        }

        let totalWeight = 0;
        let newTokenAmountList = [...tokenAmounts];
        tokenWeights.map((tokenWeight, index) => {
          newTokenAmountList[index] =
            (newTokenAmountList[0] * tokenWeight) / tokenWeights[0];
          totalWeight += Number(tokenWeight);
        });

        if (totalWeight != 100) {
          toast(
            `Please, input correct token weight. Sum of weights should be 100`,
            {
              theme: "dark",
            }
          );

          return;
        }

        setTokenAmounts(newTokenAmountList);

        if (publicKey) {
          console.log(`pubKey: ${publicKey}`);
          if (
            !(await checkTokenBalances(
              connection,
              mintAddresss,
              tokenAmounts,
              publicKey
            ))
          ) {
            toast(`Not sufficient balance in your wallet. Please, charge!`, {
              theme: "dark",
            });
            return;
          }
        } else {
          toast(`Please, connect your wallet!`, {
            theme: "dark",
          });
          
          return;
        }

        const mintAddrA = "";
        const mintAddrB = "";
        const mintAddrS = "";

        let ataA, ataB, ataS;
        if (publicKey) {
          ataA = findAssociatedTokenAddress(
            publicKey,
            new PublicKey(mintAddrA)
          );
          ataB = findAssociatedTokenAddress(
            publicKey,
            new PublicKey(mintAddrB)
          );
          ataS = findAssociatedTokenAddress(
            publicKey,
            new PublicKey(mintAddrS)
          );

          const components: LiquidityComponent[] = [
            {
              account: ataA,
              mintAddress: mintAddrA,
              amount: 10,
            },
            {
              account: ataB,
              mintAddress: mintAddrB,
              amount: 10,
            },
            {
              account: ataS,
              mintAddress: mintAddrS,
              amount: 10,
            },
          ];

          if (signTransaction) {
            addLiquidity(publicKey, signTransaction, connection, components, 0);
          } else {
            toast(`Please, connect your wallet!`, {
              theme: "dark",
            });
          }
        }

        break;
      case 1:
        if (lpTokenAmount <= 0) {
          toast(`Please, input correct amount`, {
            theme: "dark",
          });

          return;
        }

        break;
      case 2:
        break;
    }

    setCurrent(current + 1);
  };

  const items = createLPSteps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle: React.CSSProperties = {
    height: "60vh",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <CreateLPModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <TitleContainer></TitleContainer>
        <StepContainer>
          <Steps
            current={current}
            labelPlacement="vertical"
            items={items}
            className="custom-step"
          />
          <div style={contentStyle}>{createLPSteps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < createLPSteps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === createLPSteps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
          </div>
        </StepContainer>
      </CreateLPModalWrapper>
      <CreateLPModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
