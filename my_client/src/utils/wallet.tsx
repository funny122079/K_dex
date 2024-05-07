import React, { useState } from "react";

interface WalletConfig {
    connectTryFlag: boolean;
    setConnectTryFlag: (val: boolean) => void;   
}

export const WalletContext = React.createContext<WalletConfig>({
    connectTryFlag: true,
    setConnectTryFlag: (val: boolean) => {}   
});

export const WalletState = ({ children = undefined as any }) => {
    const [connectTryFlag, setConnectTryFlag] = useState(true);

    return (
        <WalletContext.Provider
          value={{
            connectTryFlag,
            setConnectTryFlag
            }}
        >
          {children}
        </WalletContext.Provider>
    );
}