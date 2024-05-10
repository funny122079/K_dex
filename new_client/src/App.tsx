import React from "react";

import WalletContextProvider from "./components/WalletContextProvider";
import { SPLTokenListProvider } from "context/SPLTokenListContext";
import { CustomRoutes } from "./customRoutes";

function App() {
  return (
    <div className="App">
      <WalletContextProvider>
        <SPLTokenListProvider>
          <CustomRoutes />      
        </SPLTokenListProvider>  
      </WalletContextProvider>
    </div>
  );
}

export default App;
