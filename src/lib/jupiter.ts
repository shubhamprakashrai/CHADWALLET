/**
 * JUPITER client — swaps + token prices. Keyless on the free `lite-api` host.
 * Right now we only use the Price API (to value portfolio holdings in USD);
 * swap quote/execute lands in the trading phase.
 */

const BASE = 'https://lite-api.jup.ag';

/** Wrapped-SOL native mint — used to price a wallet's SOL balance. */
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

/** USD price per mint. Jupiter Price v3 takes up to 50 mints per call. */
export async function fetchPrices(mints: string[]): Promise<Record<string, number>> {
  const ids = [...new Set(mints)].slice(0, 50);
  if (ids.length === 0) return {};

  const res = await fetch(`${BASE}/price/v3?ids=${ids.join(',')}`);
  if (!res.ok) throw new Error(`Jupiter price → HTTP ${res.status}`);
  const json = (await res.json()) as Record<string, { usdPrice?: number } | undefined>;

  const out: Record<string, number> = {};
  for (const [mint, v] of Object.entries(json)) {
    if (v?.usdPrice != null) out[mint] = v.usdPrice;
  }
  return out;
}

// ---- Swap (quote → build → sign with Privy → send) ----------------------

/** Jupiter quote; the whole object is passed verbatim into buildSwap(). */
export type QuoteResponse = {
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  [k: string]: unknown;
};

/** Best-route quote. `amount` is a RAW integer in the input token's atomic units. */
export async function getQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}): Promise<QuoteResponse> {
  const u = new URL(`${BASE}/swap/v1/quote`);
  u.searchParams.set('inputMint', params.inputMint);
  u.searchParams.set('outputMint', params.outputMint);
  u.searchParams.set('amount', String(Math.round(params.amount)));
  u.searchParams.set('slippageBps', String(params.slippageBps ?? 50));
  const res = await fetch(u.toString());
  if (!res.ok) throw new Error(`Jupiter quote → HTTP ${res.status}`);
  return (await res.json()) as QuoteResponse;
}

/**
 * Builds the swap transaction. Returns a base64 UNSIGNED VersionedTransaction —
 * the caller signs it with the Privy embedded wallet and sends it via Alchemy.
 * (Signing is wired once the Privy dev build is live.)
 */
export async function buildSwap(quote: QuoteResponse, userPublicKey: string): Promise<string> {
  const res = await fetch(`${BASE}/swap/v1/swap`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    }),
  });
  if (!res.ok) throw new Error(`Jupiter swap → HTTP ${res.status}`);
  const json = (await res.json()) as { swapTransaction: string };
  return json.swapTransaction;
}

export type JupTokenMeta = { id: string; name: string; symbol: string; icon?: string; decimals: number };

/** Name / symbol / logo for held mints (so portfolio holdings look real). */
export async function fetchTokenMeta(mints: string[]): Promise<Record<string, JupTokenMeta>> {
  const ids = [...new Set(mints)].slice(0, 100);
  if (ids.length === 0) return {};

  const res = await fetch(`${BASE}/tokens/v2/search?query=${ids.join(',')}`);
  if (!res.ok) throw new Error(`Jupiter token search → HTTP ${res.status}`);
  const arr = (await res.json()) as Array<JupTokenMeta>;

  const out: Record<string, JupTokenMeta> = {};
  for (const t of arr) out[t.id] = t;
  return out;
}
