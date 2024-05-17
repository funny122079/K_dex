import { Account, Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";
import { programIds } from "./ids";

// export async function getTokenBalance(connection: Connection, tokenAddress: string, walletAddress: string): Promise<number> {
//     try {
//       const token = new Token(
//         connection,
//         new PublicKey(tokenAddress), // Token address
//         new PublicKey(""), // We can leave this empty if we're not initializing a new token
//         new Account() // Payer, not necessary for fetching balance
//       );

//       // Get account info
//       const walletTokenAccountInfo = await token.getAccountInfo(
//         new PublicKey(walletAddress) // Wallet address/public key
//       );

//       // Balance as per the token’s decimal amount
//       const balance = walletTokenAccountInfo.amount.toNumber();

//       console.log(`Balance of token ${tokenAddress}: ${balance}`);
//       return balance;
//     } catch (err) {
//       console.error(`Failed to fetch balance for token ${tokenAddress}`, err);
//     }

//     return 0;
// }

export async function checkTokenBalances(
  connection: Connection,
  tokenAddresses: string[],
  amount: number[],
  walletAddress: PublicKey
): Promise<boolean> {
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletAddress,
      {
        programId: programIds().token,
      }
    );

    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData = AccountLayout.decode(tokenAccount.account.data);

      for (let index = 0; index < tokenAddresses.length; index++) {
        if (tokenAddresses[index] && tokenAddresses[index] === accountData.mint) {
          if (!amount[index] || amount[index] > accountData.amount) {
              return false;
          }
        }
      }        
    });
  } catch (err) {
    console.error(`walletUtil-checkTokenBalance: error`, err);
    return false;
  }

  return true;
}
