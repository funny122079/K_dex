import React, { useEffect, useState } from "react";
import { MdSettings, MdHelp } from "react-icons/md";

import type { SearchProps } from "antd/es/input/Search";
import { Button, Checkbox, Input, Table } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

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

import ColoredText from "../../components/typography/ColoredText";
import { CreateLPModal } from "../../components/pool/CreateLPModal";
import { LPDetailModal } from "../../components/pool/LPDetailModal";

const { Search } = Input;

export interface PoolTableDataType {
  key: number;
  pools: string;
  tvl: number;
  fee: string;
  contribution: string;
  volume: number;
  tokenNames: string[];
  tokenWeights: number[];
  owner: boolean;
}

const PoolData: PoolTableDataType[] = [
  {
    key: 1,
    pools: "(SOL, USDC)",
    tvl: 115.33,
    fee: "0.35%",
    contribution: "1.32 LP",
    volume: 56.27,
    tokenNames: ["SOL", "USDC"],
    tokenWeights: [50, 50],
    owner: true,
  },
  {
    key: 2,
    pools: "(C98, USDC)",
    tvl: 585.14,
    fee: "0.25%",    
    contribution: "0 LP",
    volume: 230.13,
    tokenNames: ["C98", "USDC"],
    tokenWeights: [80, 20],
    owner: false,
  },
];

export const Pool: React.FC = () => {
  const [poolData, setPoolData] = useState(PoolData);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
  const [showLPDetailModal, setShowLPDetailModal] = useState(false);
  const [activePoolData, setActivePoolData] = useState({  
    key: 0,
    pools: "",
    tvl: 0,
    fee: "",
    contribution: "",
    volume: 0,
    tokenNames: ["",""],
    tokenWeights: [50,50],
    owner: false,
  });
  const [headerItem, setHeaderItem] = useState([
    {
      icon: <MdSettings size={20} />,
      label: "Preferences",
    },
    {
      icon: <MdHelp size={20} />,
      label: "Help",
    },
  ]);

  const poolTableColumns: TableProps<PoolTableDataType>["columns"] = [
    {
      title: "NO",
      key: "no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "POOLS",
      dataIndex: "pools",
      key: "pools",
      //   render: (text) => <a>{text}</a>,
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
      //   render: (_, { tags }) => (
      //     <>
      //       {tags.map((tag) => {
      //         let color = tag.length > 5 ? 'geekblue' : 'green';
      //         if (tag === 'loser') {
      //           color = 'volcano';
      //         }
      //         return (
      //           <Tag color={color} key={tag}>
      //             {tag.toUpperCase()}
      //           </Tag>
      //         );
      //       })}
      //     </>
      //   ),
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
    const poolDatabyKey = PoolData.find(data => data.key === LPKey);
    if (poolDatabyKey !== undefined) {
      setActivePoolData(poolDatabyKey);
    }
    
    setShowLPDetailModal(true);
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
          <PoolHeaderSection>
            <div className="room-header-setting">
              {headerItem.map((item) => (
                <p key={item.label}>
                  {item.icon}
                  <span>{item.label}</span>
                </p>
              ))}
            </div>
          </PoolHeaderSection>
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
