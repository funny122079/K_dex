import React, { useContext, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import type { SearchProps } from "antd/es/input/Search";
import { Button, Checkbox, Input, Table } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { SPLTokenListContext } from "context/SPLTokenListContext";
import ColoredText from "../../components/typography/ColoredText";
import { CreateLPModal } from "../../components/pool/CreateLPModal";
import { LPDetailModal } from "../../components/pool/LPDetailModal";
import { usePools } from "utils/pools";

import {
  OwnerActionContainer,
  PoolContainer,
  PoolControlBar,
  PoolHeader,
  PoolHeaderSection,
  PoolTableContainer,
  PoolWrapper,
  TitleContainer,
} from "./styles";
import "pages/PoolPage/styles.css";

const { Search } = Input;

export interface PoolTableDataType {
  key: number;
  poolName: string;
  tvl: number;
  fee: string;
  contribution: string;
  volume: number;
  mintAddresses: PublicKey[];
  tokenNames: string[];
  tokenWeights: number[];
  owner: boolean;
}

// const PoolData: PoolTableDataType[] = [
//   {
//     key: 1,
//     poolName: "(SOL, USDC)",
//     tvl: 115.33,
//     fee: "0.35%",
//     contribution: "1.32 LP",
//     volume: 56.27,
//     mintAddresses: [],
//     tokenNames: ["SOL", "USDC"],
//     tokenWeights: [50, 50],
//     owner: true,
//   },
//   {
//     key: 2,
//     poolName: "(C98, USDC)",
//     tvl: 585.14,
//     fee: "0.25%",    
//     contribution: "0 LP",
//     volume: 230.13,
//     mintAddresses: [],
//     tokenNames: ["C98", "USDC"],
//     tokenWeights: [80, 20],
//     owner: false,
//   },
// ];

export const PoolPage: React.FC = () => {
  const { connection } = useConnection();
  const { tokenList } = useContext(SPLTokenListContext);  
  const { pools } = usePools(connection);  
  const { signTransaction } = useWallet();

  const [poolData, setPoolData] = useState<PoolTableDataType[]>([]);
  // const [poolData, setPoolData] = useState<PoolTableDataType[]>(PoolData);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [showLPDetailModal, setShowLPDetailModal] = useState(false);
  const [activePoolData, setActivePoolData] = useState<PoolTableDataType>({  
    key: 0,
    poolName: "",
    tvl: 0,
    fee: "",
    contribution: "",
    volume: 0,
    mintAddresses: [],
    tokenNames: [],
  tokenWeights: [],
    owner: false,
  });

  const getTokenName = (mintAddress: string): string => {    
    const knownSymbol = tokenList.get(mintAddress)?.symbol;
    if (knownSymbol) {
      return knownSymbol;
    }
  
    return "UNK_TOKN";
  }

  useEffect(() => {
    const data:PoolTableDataType[] = pools.map((pool, index) => {
      // these are placeholders, replace with actual calculation
      // const tvl = calculateTVL(pool);
      // const fee = calculateFee(pool);
      // const contribution = calculateContribution(pool);
      const tvl = 0;
      const fee = "";
      const contribution = "";      
      
      const tokenNames: string[] = pool.pubkeys.holdingMints.map(mintAddress => getTokenName(mintAddress.toString()));
      
      return {
        key: Number(index) + 1,
        poolName: tokenNames.join(','),
        tvl: tvl,
        fee: fee,
        contribution: contribution,
        volume: 0,
        mintAddresses: pool.pubkeys.holdingMints,
        tokenNames: [],
        tokenWeights: [],
        owner: false, //temp
      };
    });
  
    setPoolData(data);
  }, [pools]);

  const poolTableColumns: TableProps<PoolTableDataType>["columns"] = [
    {
      title: "NO",
      key: "no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "POOLS",
      dataIndex: "poolName",
      key: "pools",
    },
    {
      title: "TVL",
      dataIndex: "tvl",
      key: "tvl",
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
    },
    {
      title: "My Contribution",
      key: "contribution",
      dataIndex: "contribution",
    },
    {
      title: "Owner",
      key: "owner",
      dataIndex: "owner",
      render: (_, { owner }) => (
        <>
          {owner && (
            <OwnerActionContainer>
              <Checkbox checked={true} />
              <DeleteOutlined />
            </OwnerActionContainer>
          )}
          {!owner && <Checkbox />}
        </>
      ),
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input") {
      console.log(value);
    }
  };

  const onNewPoolHandler = () => {
    setShowCreatePoolModal(true);
  };

  const onCloseModal = () => {
    setShowCreatePoolModal(false);
  };

  const onCloseLPDetailModal = () => {
    setShowLPDetailModal(false);
  };

  const showLPDetails = (LPKey: number) => {
    console.log("key:", LPKey);
    const poolDatabyKey = poolData.find(data => Number(data.key) === LPKey);
    if (poolDatabyKey !== undefined) {
      console.log("selected LP details", JSON.stringify(poolDatabyKey));
      setActivePoolData(poolDatabyKey);
      setShowLPDetailModal(true);
    }
  };

  return (
    <>
      <PoolWrapper>
        <PoolHeader>
          <TitleContainer>
            <img src="/assets/images/room-logo.png" alt="" draggable="false" />
            <ColoredText
              text_attr_kinds="other_color"
              fonttype="medium"
              font_name="fantasy"
            >
              Liquidity Pool
            </ColoredText>
          </TitleContainer>
          <PoolHeaderSection></PoolHeaderSection>
        </PoolHeader>
        <PoolContainer>
          <PoolControlBar>
            <Search
              placeholder="input search token"
              onSearch={onSearch}
              style={{ width: "40vw" }}
            />
            <Button type="primary" onClick={onNewPoolHandler}>
              + New Pool
            </Button>
          </PoolControlBar>
          <PoolTableContainer>
            <Table
              className="rounded-table"
              columns={poolTableColumns}
              dataSource={poolData}
              onRow={(record) => ({
                onClick: () => {
                  if (record && record.key) showLPDetails(record.key);
                },
              })}
            />
          </PoolTableContainer>
        </PoolContainer>
      </PoolWrapper>
      <CreateLPModal
        isShow={showCreatePoolModal}
        onClose={() => onCloseModal()}
      />
      <LPDetailModal        
        poolData={activePoolData}
        isShow={showLPDetailModal}
        onClose={() => onCloseLPDetailModal()}
      />
    </>
  );
};
