import React, { useEffect, useState } from "react";
import { SelectedMenuContext } from '../../context/SelectedMenuContext';
import { Pool } from '../Pool';
import { Swap } from '../Swap';
import {
  LandingPageWrapper,
} from "./styles";

import { AppLayout } from "../../layouts/AppLayout";

export const Landing: React.FC = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState("");  

  useEffect(() => {
    console.log('selectedMenuKey in Landing', selectedMenuKey);  // Here
  }, [selectedMenuKey]);

  return (
    <SelectedMenuContext.Provider
      value={{ selectedMenuKey, setSelectedMenuKey }}
    >
      <AppLayout>
        <LandingPageWrapper id="home">
          {selectedMenuKey === "1" && <Swap />}
          {selectedMenuKey === "2" && <Pool />}
        </LandingPageWrapper>
      </AppLayout>
    </SelectedMenuContext.Provider>
  );
};
