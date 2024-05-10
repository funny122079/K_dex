import React from "react";

import WalletContextProvider from "./components/WalletContextProvider";
import { SPLTokenListProvider } from "context/SPLTokenListContext";
import { CustomRoutes } from "./customRoutes";
import { ConnectionProvider } from "utils/connection";

function App() {
  return (
    <ConnectionProvider>
      <WalletContextProvider>
        <SPLTokenListProvider>
          <CustomRoutes />
        </SPLTokenListProvider>
      </WalletContextProvider>
    </ConnectionProvider>
  );
}

export default App;
