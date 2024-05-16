import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as BufferLayout from "buffer-layout";

export interface PoolInfo {
  pubkeys: {
    program: PublicKey;
    account: PublicKey;
    holdingAccounts: PublicKey[];
    holdingMints: PublicKey[];
    mint: PublicKey;
    feeAccount?: PublicKey;
  };  
  raw: any;
}

export interface LiquidityComponent {
  amount: number;
  account?: PublicKey;
  mintAddress: string;
}

export interface PoolConfig {
  curveType: 0 | 1;
  tradeFeeNumerator: number;
  tradeFeeDenominator: number;
  ownerTradeFeeNumerator: number;
  ownerTradeFeeDenominator: number;
  ownerWithdrawFeeNumerator: number;
  ownerWithdrawFeeDenominator: number;
}

export const publicKey = (property: string = "publicKey"): Object => {
  return BufferLayout.blob(32, property);
};

export const PoolLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    publicKey("owner"),
    BufferLayout.u8("state"),    
    publicKey("mint_lpt"),
    publicKey("vault"),
    publicKey("mint_s"),
    publicKey("treasury_s"),
    publicKey("reserve_s"),
    publicKey("mint_a"),
    publicKey("treasury_a"),
    publicKey("reserve_a"),
    publicKey("mint_b"),
    publicKey("treasury_b"),
    publicKey("reserve_b"),
  ]
);

export const createInitPoolInstruction = (
  payerAccount: PublicKey,
  ownerAccount: PublicKey,
  poolAccount: PublicKey,
  lptAccount: PublicKey,
  mintLptAccount: PublicKey,
  vaultAccount: PublicKey,
  proofAccount: PublicKey,
  srcSAccount: PublicKey,
  mintSAccount: PublicKey,
  treasurySAccount: PublicKey,
  srcAAccount: PublicKey,
  mintAAccount: PublicKey,
  treasuryAAccount: PublicKey,
  srcBAccount: PublicKey,
  mintBAccount: PublicKey,
  treasuryBAccount: PublicKey,
  treasurerAccount: PublicKey,
  sysProgramId: PublicKey,
  spltProgramId: PublicKey,
  sysVarRentAccount: PublicKey,
  splAtaProgramId: PublicKey,
  poolProgramId: PublicKey,
): TransactionInstruction => {
  const keys = [
    { pubkey: payerAccount, isSigner: false, isWritable: true },
    { pubkey: ownerAccount, isSigner: false, isWritable: false },
    { pubkey: poolAccount, isSigner: false, isWritable: false },
    { pubkey: lptAccount, isSigner: false, isWritable: false },
    { pubkey: mintLptAccount, isSigner: false, isWritable: true },
    { pubkey: vaultAccount, isSigner: false, isWritable: false },
    { pubkey: proofAccount, isSigner: false, isWritable: true },
    { pubkey: srcSAccount, isSigner: false, isWritable: false },
    { pubkey: mintSAccount, isSigner: false, isWritable: false },
    { pubkey: treasurySAccount, isSigner: false, isWritable: false },
    { pubkey: srcAAccount, isSigner: false, isWritable: false },
    { pubkey: mintAAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryAAccount, isSigner: false, isWritable: false },
    { pubkey: srcBAccount, isSigner: false, isWritable: false },
    { pubkey: mintBAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryBAccount, isSigner: false, isWritable: false },
    { pubkey: treasurerAccount, isSigner: false, isWritable: false },
    { pubkey: sysProgramId, isSigner: false, isWritable: false },
    { pubkey: spltProgramId, isSigner: false, isWritable: false },
    { pubkey: sysVarRentAccount, isSigner: false, isWritable: false },
    { pubkey: splAtaProgramId, isSigner: false, isWritable: false },
  ];

  const commandDataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),    
    BufferLayout.nu64("reserve_s"),
    BufferLayout.nu64("reserve_a"),
    BufferLayout.nu64("reserve_b"),    
  ]);

  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 0,
        reserve_s: 10,
        reserve_a: 10,
        reserve_b: 10,        
      },
      data
    );
    data = data.slice(0, encodeLength);
  }

  return new TransactionInstruction({
    keys,
    programId: poolProgramId,
    data,
  });
}

export const addLPInstruction = (  
  ownerAccount: PublicKey,
  poolAccount: PublicKey,
  lptAccount: PublicKey,
  mintLptAccount: PublicKey,
  srcSAccount: PublicKey,
  treasurySAccount: PublicKey,
  srcAAccount: PublicKey,
  treasuryAAccount: PublicKey,
  srcBAccount: PublicKey,
  treasuryBAccount: PublicKey,
  treasurerAccount: PublicKey,
  spltProgramId: PublicKey,
  poolProgramId: PublicKey,
): TransactionInstruction => {
  const keys = [
    { pubkey: ownerAccount, isSigner: false, isWritable: false },
    { pubkey: poolAccount, isSigner: false, isWritable: false },
    { pubkey: lptAccount, isSigner: false, isWritable: false },
    { pubkey: mintLptAccount, isSigner: false, isWritable: true },
    { pubkey: srcSAccount, isSigner: false, isWritable: false },
    { pubkey: treasurySAccount, isSigner: false, isWritable: false },
    { pubkey: srcAAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryAAccount, isSigner: false, isWritable: false },
    { pubkey: srcBAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryBAccount, isSigner: false, isWritable: false },
    { pubkey: treasurerAccount, isSigner: false, isWritable: false },
    { pubkey: spltProgramId, isSigner: false, isWritable: false },
  ];

  const commandDataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),    
    BufferLayout.nu64("delta_s"),
    BufferLayout.nu64("delta_a"),
    BufferLayout.nu64("delta_b"),    
  ]);

  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 1,
        delta_s: 5,
        delta_a: 5,
        delta_b: 5,        
      },
      data
    );
    data = data.slice(0, encodeLength);
  }

  return new TransactionInstruction({
    keys,
    programId: poolProgramId,
    data,
  });
}

export const removeLPInstruction = (  
  ownerAccount: PublicKey,
  poolAccount: PublicKey,
  lptAccount: PublicKey,
  mintLptAccount: PublicKey,
  srcSAccount: PublicKey,
  treasurySAccount: PublicKey,
  srcAAccount: PublicKey,
  treasuryAAccount: PublicKey,
  srcBAccount: PublicKey,
  treasuryBAccount: PublicKey,
  treasurerAccount: PublicKey,
  spltProgramId: PublicKey,
  poolProgramId: PublicKey,
): TransactionInstruction => {
  const keys = [
    { pubkey: ownerAccount, isSigner: false, isWritable: false },
    { pubkey: poolAccount, isSigner: false, isWritable: false },
    { pubkey: lptAccount, isSigner: false, isWritable: false },
    { pubkey: mintLptAccount, isSigner: false, isWritable: true },
    { pubkey: srcSAccount, isSigner: false, isWritable: false },
    { pubkey: treasurySAccount, isSigner: false, isWritable: false },
    { pubkey: srcAAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryAAccount, isSigner: false, isWritable: false },
    { pubkey: srcBAccount, isSigner: false, isWritable: false },
    { pubkey: treasuryBAccount, isSigner: false, isWritable: false },
    { pubkey: treasurerAccount, isSigner: false, isWritable: false },
    { pubkey: spltProgramId, isSigner: false, isWritable: false },
  ];

  const commandDataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),    
    BufferLayout.nu64("lpt"),    
  ]);

  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 2,
        lpt: 8,        
      },
      data
    );
    data = data.slice(0, encodeLength);
  }

  return new TransactionInstruction({
    keys,
    programId: poolProgramId,
    data,
  });
}