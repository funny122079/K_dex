import React from "react";
import ReactDOM from "react-dom";
// import { WalletProvider } from '@solana/wallet-adapter-react'
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
// import * as walletAdapterWallets from '@solana/wallet-adapter-wallets'
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { WalletProvider } from "./utils/wallet";
import { ConnectionProvider } from "./utils/connection";
import { AccountsProvider } from "./utils/accounts";
import { CurrencyPairProvider } from "./utils/currencyPair";

// const wallets = [
//   new walletAdapterWallets.PhantomWalletAdapter(),
//   new walletAdapterWallets.SolflareWalletAdapter(),
// ]

ReactDOM.render(
    <ConnectionProvider>
      <WalletProvider>
        <AccountsProvider>
          <CurrencyPairProvider>
            <App />
          </CurrencyPairProvider>
        </AccountsProvider>
      </WalletProvider>
    </ConnectionProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
