import React, { useEffect, useState } from "react";
import { PoolTableDataType } from "../../../pages/Pool";

import { LPDetailModalWrapper, LPDetailModalOverlay, CloseBtn } from "./styles";

type LPDetailProps = {
  isShow: boolean;
  onClose: () => void;
  poolKey: number;
  poolData: PoolTableDataType[];
};

export const LPDetailModal: React.FC<LPDetailProps> = ({
  isShow,
  onClose,
  poolKey,
  poolData,
}) => {
  return (
    <>
      <LPDetailModalWrapper $isshow={isShow}></LPDetailModalWrapper>
      <LPDetailModalOverlay $isshow={isShow} onClick={onClose} />
    </>
  );
};
