/**
 * CODEX client — real-time on-chain trade events (powers the KOL/whale feed).
 * GraphQL API; auth via the Authorization header. Solana networkId = 1399811149.
 * Free tier has no websockets, so we poll getTokenEvents.
 */

const ENDPOINT = 'https://graph.codex.io/graphql';
const KEY = process.env.EXPO_PUBLIC_CODEX_API_KEY ?? '';
const SOLANA_NETWORK = 1399811149;

/** True when a Codex key is configured — the KOL feed falls back to mock if not. */
export const hasCodexKey = KEY.length > 0;

export type CodexTrade = {
  type: 'Buy' | 'Sell';
  valueUsd: number;
  maker: string;
  timestamp: number;
  txHash: string;
};

async function gql<T>(query: string): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Codex → HTTP ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors || !json.data) throw new Error(`Codex → ${JSON.stringify(json.errors).slice(0, 120)}`);
  return json.data;
}

type EventsResponse = {
  getTokenEvents: {
    items: Array<{
      eventDisplayType?: string;
      timestamp?: number;
      maker?: string;
      transactionHash?: string;
      token0SwapValueUsd?: string;
      token1SwapValueUsd?: string;
    }> | null;
  };
};

/** Recent Buy/Sell swaps for a token — each with the trader (maker) + USD size. */
export async function fetchTokenEvents(address: string, limit = 8): Promise<CodexTrade[]> {
  const query = `{
    getTokenEvents(
      query: { address: "${address}", networkId: ${SOLANA_NETWORK}, eventDisplayType: [Buy, Sell] }
      limit: ${limit}
    ) {
      items { eventDisplayType timestamp maker transactionHash token0SwapValueUsd token1SwapValueUsd }
    }
  }`;
  const data = await gql<EventsResponse>(query);
  return (data.getTokenEvents?.items ?? []).map((e) => ({
    type: e.eventDisplayType === 'Buy' ? 'Buy' : 'Sell',
    valueUsd: Number(e.token0SwapValueUsd ?? e.token1SwapValueUsd ?? 0),
    maker: e.maker ?? '',
    timestamp: Number(e.timestamp ?? 0),
    txHash: e.transactionHash ?? '',
  }));
}
