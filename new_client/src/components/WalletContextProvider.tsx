import React, { FC, ReactNode, useMemo } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
// import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	CloverWalletAdapter,
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	MathWalletAdapter,
	SafePalWalletAdapter	
  } from "@solana/wallet-adapter-wallets";
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
//   const endpoint = web3.clusterApiUrl('devnet')
  const endpoint = 'http://127.0.0.1:8899';
	const wallets = useMemo(
		() => [
		  new PhantomWalletAdapter(),
		  new SolflareWalletAdapter(),
		  new CloverWalletAdapter(),
		  new MathWalletAdapter(),
		  new SafePalWalletAdapter()
		],
		[]
	  );

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
				{children}
				<ToastContainer />
			</WalletProvider>
		</ConnectionProvider>
	)
}

export default WalletContextProvider;