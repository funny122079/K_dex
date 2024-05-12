import * as BufferLayout from "buffer-layout";

export const MAX_TOKEN_CNT_PROVIDE = 7;

export const publicKey = (property: string = "publicKey"): Object => {
  return BufferLayout.blob(32, property);
};

export const uint64 = (property: string = "uint64"): Object => {
  return BufferLayout.blob(8, property);
};

export const TokenSwapLayout: typeof BufferLayout.Structure =
  BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("nonce"),
    publicKey("tokenProgramId"),
    BufferLayout.seq(publicKey(), MAX_TOKEN_CNT_PROVIDE, "tokenAccounts"),
    BufferLayout.seq(publicKey(), MAX_TOKEN_CNT_PROVIDE, "mints"),    
    publicKey("tokenPool"),    
    publicKey("feeAccount"),
    BufferLayout.u8("curveType"),
    uint64("tradeFeeNumerator"),
    uint64("tradeFeeDenominator"),
    uint64("ownerTradeFeeNumerator"),
    uint64("ownerTradeFeeDenominator"),
    uint64("ownerWithdrawFeeNumerator"),
    uint64("ownerWithdrawFeeDenominator"),
    BufferLayout.blob(16, "padding"),
  ]);
