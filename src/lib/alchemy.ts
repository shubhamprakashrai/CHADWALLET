/**
 * ALCHEMY client — Solana RPC for WALLET data (balances + activity).
 * Birdeye/Jupiter give market data; Alchemy answers "what's in this wallet".
 * The API key lives inside the RPC URL (from .env).
 */

const RPC = process.env.EXPO_PUBLIC_ALCHEMY_RPC_MAINNET ?? '';

/** True when an Alchemy RPC URL is configured. */
export const hasAlchemy = RPC.length > 0;

/** SPL Token program — owner filter for getTokenAccountsByOwner. */
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

/** Minimal JSON-RPC 2.0 caller. */
async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`Alchemy ${method} → HTTP ${res.status}`);
  const json = (await res.json()) as { result?: T; error?: { message: string } };
  if (json.error) throw new Error(`Alchemy ${method} → ${json.error.message}`);
  return json.result as T;
}

/** Native SOL balance in whole SOL (lamports / 1e9). */
export async function getSolBalance(address: string): Promise<number> {
  const r = await rpc<{ value: number }>('getBalance', [address, { commitment: 'confirmed' }]);
  return r.value / 1e9;
}

export type RawHolding = { mint: string; amount: number; decimals: number };

/** Every SPL token the wallet holds (balance only — prices come from Jupiter). */
export async function getTokenAccounts(address: string): Promise<RawHolding[]> {
  const r = await rpc<{
    value: Array<{
      account: { data: { parsed: { info: { mint: string; tokenAmount: { uiAmount: number; decimals: number } } } } };
    }>;
  }>('getTokenAccountsByOwner', [
    address,
    { programId: TOKEN_PROGRAM },
    { encoding: 'jsonParsed', commitment: 'confirmed' },
  ]);

  return r.value
    .map((acc) => {
      const info = acc.account.data.parsed.info;
      return { mint: info.mint, amount: info.tokenAmount.uiAmount, decimals: info.tokenAmount.decimals };
    })
    .filter((h) => h.amount > 0);
}

/** Raw balance (atomic units) of one SPL token in a wallet — for selling. */
export async function getTokenBalance(address: string, mint: string): Promise<number> {
  const r = await rpc<{
    value: Array<{ account: { data: { parsed: { info: { tokenAmount: { amount: string } } } } } }>;
  }>('getTokenAccountsByOwner', [
    address,
    { mint },
    { encoding: 'jsonParsed', commitment: 'confirmed' },
  ]);
  return r.value.reduce((sum, acc) => sum + Number(acc.account.data.parsed.info.tokenAmount.amount), 0);
}

export type RawActivity = { signature: string; time: number | null; failed: boolean };

/** Recent transaction signatures for a wallet (the wallet's on-chain activity). */
export async function getRecentActivity(address: string, limit = 10): Promise<RawActivity[]> {
  const r = await rpc<Array<{ signature: string; blockTime: number | null; err: unknown }>>(
    'getSignaturesForAddress',
    [address, { limit }],
  );
  return r.map((s) => ({ signature: s.signature, time: s.blockTime, failed: s.err != null }));
}
