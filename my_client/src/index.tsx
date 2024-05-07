import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import WalletContextProvider from './components/WalletContextProvider'
import { AccountsProvider } from "./utils/accounts";
import { CurrencyPairProvider } from "./utils/currencyPair";

ReactDOM.render(
    <WalletContextProvider>
        <AccountsProvider>
          <CurrencyPairProvider>
            <App />
          </CurrencyPairProvider>
        </AccountsProvider>
    </WalletContextProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
