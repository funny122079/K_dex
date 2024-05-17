import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Button, Col, Row } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

import ColoredText from "components/typography/ColoredText";
import { Deposit } from "components/pool/Deposit";
import { Withdraw } from "components/pool/Withdraw";

import { PoolTableDataType } from "pages/PoolPage";
import {
  LPDetailModalWrapper,
  LPDetailModalOverlay,
  CenterElements,
  CloseBtn,
  LPOperationContainer,
} from "./styles";
import "components/pool/LPDetailModal/styles.css";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip);

type LPDetailProps = {
  isShow: boolean;
  onClose: () => void;
  poolData: PoolTableDataType;
};

const GraphColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

export const LPDetailModal: React.FC<LPDetailProps> = ({
  isShow,
  onClose,
  poolData,
}) => {
  const [weightGraphColors, setWeightGraphColors] = useState([""]);
  const [ depositShowFlag, setDepositShowFlag] = useState(false);
  const [ withdrawShowFlag, setWithdrawShowFlag] = useState(false);

  useEffect(() => {
    try {
      if (poolData && poolData.tokenWeights) {
        const tokenCount = poolData.tokenWeights.length;
        setWeightGraphColors(GraphColors.slice(0, tokenCount));
      }
    } catch (e) {
      console.log("setWeightGraphColor-useEffect: error", e);
    }
  }, [poolData?.tokenWeights]);

  const getLastSevenDays = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }).reverse();
  };

  const data = {
    labels: getLastSevenDays(),
    datasets: [
      {
        label: "Volumes",
        data: [130, 49, 13, 58, 27, 103, 70],
        backgroundColor: ["rgba(53, 162, 235, 0.5)"],
        borderColor: ["rgba(53, 162, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  const weightGraphData = {
    labels: poolData.tokenNames,
    datasets: [
      {
        label: "Weights",
        data: poolData.tokenWeights,
        backgroundColor: weightGraphColors,
        borderColor: weightGraphColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const closeDepositModal = () => {
    setDepositShowFlag(false);
  }

  const closeWithdrawModal = () => {
    setWithdrawShowFlag(false);
  }

  const onWithdrawHandler = () => {
    setWithdrawShowFlag(true);
  };

  const onDepositHandler = () => {
    setDepositShowFlag(true);    
  };

  return (
    <>
      <LPDetailModalWrapper $isshow={isShow}>
        <CloseBtn>
          <span onClick={onClose}>&times;</span>
        </CloseBtn>
        <Row style={{ width: "100%", marginBottom: "3vh" }}>
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={4}>
            <ColoredText fonttype="small" font_name="fantasy">
              {poolData.poolName}
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={12}></Col>
          <Col className="gutter-row" span={6}>
            <LPOperationContainer>
              <Button onClick={onWithdrawHandler}>Withdraw</Button>
              <Button type="primary" onClick={onDepositHandler}>
                Deposit
              </Button>
            </LPOperationContainer>
          </Col>
        </Row>
        <Row style={{ width: "100%", marginBottom: "3vh" }}>
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="small" font_name="fantasy">
              TVL
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="small" font_name="fantasy">
              APY
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="small" font_name="fantasy">
              My Contribution
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={4}></Col>
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="semiSmallTiny" font_name="fantasy">
              {poolData.tvl}
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="semiSmallTiny" font_name="fantasy">
              {poolData.fee}
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={6}>
            <ColoredText fonttype="semiSmallTiny" font_name="fantasy">
              {poolData.contribution}
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={4}></Col>
        </Row>
        <Row style={{ width: "100%", marginBottom: "2vh" }}>
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={10}>
            <ColoredText fonttype="small" font_name="fantasy">
              Volume 24h
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={10}>
            <ColoredText fonttype="small" font_name="fantasy">
              Pool Weight
            </ColoredText>
          </Col>
          <Col className="gutter-row" span={2}></Col>
        </Row>
        <Row
          style={{
            width: "100%",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={10}>
            <div id="date-bar-graph">
              <Bar data={data} options={options} />
            </div>
          </Col>
          <Col className="gutter-row" span={2}></Col>
          <Col className="gutter-row" span={8}>
            <div id="weight-pie-graph">
              <Pie
                data={weightGraphData}
                options={options}
              />
            </div>
          </Col>
          <Col className="gutter-row" span={2}></Col>
        </Row>
      </LPDetailModalWrapper>
      <LPDetailModalOverlay $isshow={isShow} onClick={onClose} />
      <Deposit isShow={depositShowFlag} onClose={closeDepositModal} />
      <Withdraw isShow={withdrawShowFlag} onClose={closeWithdrawModal} />
    </>
  );
};
