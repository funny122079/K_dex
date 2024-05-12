import { Connection, PublicKey } from "@solana/web3.js";
import { Token } from "@solana/spl-token";

// Connect to cluster
export async function checkTokenBalance(connection: Connection, tokenAddress: string, walletAddress: string): Promise<number> {
    try {
      const token = new Token(
        connection,
        new PublicKey(tokenAddress), // Token address
        {}, // We can leave this empty if we're not initializing a new token
        null // Payer, not necessary for fetching balance
      );

      // Get account info
      const walletTokenAccountInfo = await token.getAccountInfo(
        new PublicKey(walletAddress) // Wallet address/public key
      );

      // Balance as per the token’s decimal amount
      const balance = walletTokenAccountInfo.amount.toNumber();

      console.log(`Balance of token ${tokenAddress}: ${balance}`);
      return balance;
    } catch (err) {
      console.error(`Failed to fetch balance for token ${tokenAddress}`, err);
    }

    return 0;
}