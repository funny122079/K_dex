import React from "react";

import WalletContextProvider from "./components/WalletContextProvider";
import { CustomRoutes } from "./customRoutes";

function App() {
  return (
    <div className="App">
      <WalletContextProvider>
        <CustomRoutes />        
      </WalletContextProvider>
    </div>
  );
}

export default App;
