import React, { useEffect, useState } from "react";
import { MdSettings, MdHelp } from "react-icons/md";

import type { SearchProps } from "antd/es/input/Search";
import { Button, Input, Table } from "antd";
import type { TableProps } from "antd";

import {
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

const { Search } = Input;

interface PoolTableDataType {
  key: string;
  pools: string;
  tvl: number;
  fee: string;
  contribution: string;
  owner: boolean;
}

export const Pool: React.FC = () => {
  const [poolData, setPoolData] = useState([]);
  const [showCreatePoolModal, setShowCreatePoolModal] = useState(false);
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
      title: "No",
      key: "no",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Pools",
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
      //   render: (_, record) => (
      //     <Space size="middle">
      //       <a>Invite {record.name}</a>
      //       <a>Delete</a>
      //     </Space>
      //   ),
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    if (info?.source === "input") {
      console.log(value);
    }
  };

  const onNewPoolHandler = () => {
    setShowCreatePoolModal(true);
  }

  const onCloseModal = () => {
    setShowCreatePoolModal(false);
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
          <Button type="primary" onClick={onNewPoolHandler}>+ New Pool</Button>
        </PoolControlBar>
        <PoolTableContainer>
          <Table
            className="rounded-table"
            columns={poolTableColumns}
            dataSource={poolData}
          />
        </PoolTableContainer>
      </PoolContainer>
    </PoolWrapper>
    <CreateLPModal isShow={showCreatePoolModal} onClose={() => onCloseModal()} />
    </>
  );
};
