import { useEmbeddedSolanaWallet } from '@privy-io/expo';
import { Connection, PublicKey, SystemProgram, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';

import { getTokenBalance } from '@/lib/alchemy';
import { buildSwap, getQuote, SOL_MINT } from '@/lib/jupiter';

const RPC = process.env.EXPO_PUBLIC_ALCHEMY_RPC_MAINNET ?? '';

/**
 * Real on-chain actions via the Privy embedded wallet (dev build only):
 *  - buy/sell  → Jupiter swap (quote → build → sign & send)
 *  - sendSol   → native SOL transfer
 * All need a funded wallet; the wallet signs via signAndSendTransaction.
 */
export function useTrade() {
  const solana = useEmbeddedSolanaWallet();
  const wallet = solana?.wallets?.[0];

  async function signSend(tx: Transaction | VersionedTransaction): Promise<string> {
    const provider = await wallet!.getProvider();
    const connection = new Connection(RPC, 'confirmed');
    const { signature } = await provider.request({
      method: 'signAndSendTransaction',
      params: { transaction: tx, connection },
    });
    return signature;
  }

  async function swap(inputMint: string, outputMint: string, amount: number): Promise<string> {
    if (!wallet) throw new Error('Sign in to trade');
    if (amount <= 0) throw new Error('Enter an amount');
    const quote = await getQuote({ inputMint, outputMint, amount });
    const base64 = await buildSwap(quote, wallet.address);
    return signSend(VersionedTransaction.deserialize(Buffer.from(base64, 'base64')));
  }

  /** Buy `usd` worth of a token, paying with SOL. */
  function buy(outputMint: string, usd: number, solPrice: number): Promise<string> {
    return swap(SOL_MINT, outputMint, Math.round((usd / solPrice) * 1_000_000_000));
  }

  /** Sell the wallet's entire balance of a token back to SOL. */
  async function sell(mint: string): Promise<string> {
    if (!wallet) throw new Error('Sign in to trade');
    const bal = await getTokenBalance(wallet.address, mint);
    if (bal <= 0) throw new Error('You have none of this token to sell');
    return swap(mint, SOL_MINT, bal);
  }

  /** Send native SOL to another address. */
  async function sendSol(toAddress: string, lamports: number): Promise<string> {
    if (!wallet) throw new Error('Sign in first');
    const connection = new Connection(RPC, 'confirmed');
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction({
      feePayer: new PublicKey(wallet.address),
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.address),
        toPubkey: new PublicKey(toAddress),
        lamports: Math.round(lamports),
      }),
    );
    return signSend(tx);
  }

  return { buy, sell, sendSol, hasWallet: !!wallet };
}
