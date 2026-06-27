import { useEmbeddedSolanaWallet } from '@privy-io/expo';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';

import { buildSwap, getQuote, SOL_MINT } from '@/lib/jupiter';

const RPC = process.env.EXPO_PUBLIC_ALCHEMY_RPC_MAINNET ?? '';

/**
 * Real trading via Jupiter + the Privy embedded wallet.
 *  quote → build (unsigned tx) → wallet signs & sends → on-chain signature.
 * Only works in a dev build (needs the embedded wallet + a funded SOL balance).
 */
export function useTrade() {
  const solana = useEmbeddedSolanaWallet();
  const wallet = solana?.wallets?.[0];

  async function swap(inputMint: string, outputMint: string, amount: number): Promise<string> {
    if (!wallet) throw new Error('Sign in to trade');
    if (amount <= 0) throw new Error('Enter an amount');

    const quote = await getQuote({ inputMint, outputMint, amount });
    const base64 = await buildSwap(quote, wallet.address);
    const tx = VersionedTransaction.deserialize(Buffer.from(base64, 'base64'));

    const provider = await wallet.getProvider();
    const connection = new Connection(RPC, 'confirmed');
    const { signature } = await provider.request({
      method: 'signAndSendTransaction',
      params: { transaction: tx, connection },
    });
    return signature;
  }

  /** Buy `usd` worth of a token, paying with SOL. */
  function buy(outputMint: string, usd: number, solPrice: number): Promise<string> {
    const lamports = Math.round((usd / solPrice) * 1_000_000_000);
    return swap(SOL_MINT, outputMint, lamports);
  }

  /** Sell a raw token amount back to SOL. */
  function sell(inputMint: string, rawAmount: number): Promise<string> {
    return swap(inputMint, SOL_MINT, rawAmount);
  }

  return { buy, sell, hasWallet: !!wallet };
}
