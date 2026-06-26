import type { Token } from '@/lib/mock';

/**
 * BIRDEYE client — talks to Birdeye's market-data API.
 * Docs/endpoints gathered in _context/DATA-SOURCES.md.
 *
 * Every screen reads data through React Query hooks (src/hooks/*), and those
 * hooks call the functions here. This file is the ONLY place that knows about
 * Birdeye's URLs + response shapes; if we ever swap providers, only this changes.
 */

const BASE = 'https://public-api.birdeye.so';
const API_KEY = process.env.EXPO_PUBLIC_BIRDEYE_API_KEY ?? '';

/** True when a Birdeye key is configured — hooks fall back to mock data if not. */
export const hasBirdeyeKey = API_KEY.length > 0;

/** Low-level GET with Birdeye's auth headers; unwraps the `{ success, data }` envelope. */
async function birdeyeGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': API_KEY, 'x-chain': 'solana', accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Birdeye ${path} → HTTP ${res.status}`);
  const json = (await res.json()) as { success?: boolean; data?: T };
  if (!json.success || json.data == null) throw new Error(`Birdeye ${path} → success=false`);
  return json.data;
}

/** Deterministic brand color for the avatar fallback when a token has no logo. */
const PALETTE = ['#22E06B', '#F59E0B', '#A78BFA', '#22D3EE', '#FB923C', '#F472B6', '#818CF8', '#84CC16', '#2DD4BF', '#F87171'];
function colorFromString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

// ---- Trending list -------------------------------------------------------

type BirdeyeTrending = {
  tokens: Array<{
    address: string;
    name?: string;
    symbol?: string;
    logoURI?: string;
    price?: number;
    marketcap?: number;
    price24hChangePercent?: number;
    volume24hUSD?: number;
  }>;
};

function mapToken(t: BirdeyeTrending['tokens'][number]): Token {
  return {
    id: t.address,
    name: t.name ?? t.symbol ?? 'Unknown',
    symbol: t.symbol ?? '?',
    mcap: t.marketcap ?? 0,
    price: t.price ?? 0,
    change: t.price24hChangePercent ?? 0,
    color: colorFromString(t.address),
    logoURI: t.logoURI,
    series: [], // list sparklines would blow the 1 req/s limit; charts load on detail
    volume: t.volume24hUSD ?? 0,
  };
}

/** Trending Solana tokens (powers the Memes tab + Home "Trending"). */
export async function fetchTrending(limit = 20): Promise<Token[]> {
  const data = await birdeyeGet<BirdeyeTrending>('/defi/token_trending', {
    sort_by: 'rank',
    sort_type: 'asc',
    offset: 0,
    limit,
  });
  return data.tokens.map(mapToken);
}

// ---- Token detail --------------------------------------------------------

export type TokenDetail = Token & {
  liquidity: number;
  volume24h: number;
  holders: number;
  /** token decimals — needed to convert Jupiter swap amounts to human units */
  decimals: number;
};

type BirdeyeOverview = {
  address?: string;
  name?: string;
  symbol?: string;
  logoURI?: string;
  price?: number;
  marketCap?: number;
  mc?: number;
  liquidity?: number;
  v24hUSD?: number;
  priceChange24hPercent?: number;
  holder?: number;
  decimals?: number;
};

/** Full stats for one token (price, mcap, liquidity, 24h volume, holders). */
export async function fetchTokenOverview(address: string): Promise<TokenDetail> {
  const d = await birdeyeGet<BirdeyeOverview>('/defi/token_overview', { address });
  return {
    id: address,
    name: d.name ?? d.symbol ?? 'Unknown',
    symbol: d.symbol ?? '?',
    mcap: d.marketCap ?? d.mc ?? 0,
    price: d.price ?? 0,
    change: d.priceChange24hPercent ?? 0,
    color: colorFromString(address),
    logoURI: d.logoURI,
    series: [],
    liquidity: d.liquidity ?? 0,
    volume24h: d.v24hUSD ?? 0,
    holders: d.holder ?? 0,
    decimals: d.decimals ?? 9,
  };
}

// ---- Price history (chart) ----------------------------------------------

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | 'LIVE';

const DAY = 86_400;
/** Maps a UI range to Birdeye's candle `type` + how far back to start. */
function rangeParams(range: ChartRange): { type: string; seconds: number } {
  switch (range) {
    case 'LIVE':
    case '1D': return { type: '15m', seconds: DAY };
    case '1W': return { type: '1H', seconds: 7 * DAY };
    case '1M': return { type: '4H', seconds: 30 * DAY };
    case '3M': return { type: '1D', seconds: 90 * DAY };
    case '1Y': return { type: '1D', seconds: 365 * DAY };
    case '5Y': return { type: '1W', seconds: 5 * 365 * DAY };
  }
}

/** Price points over time for the detail chart. Returns raw USD values. */
export async function fetchHistory(address: string, range: ChartRange): Promise<number[]> {
  const { type, seconds } = rangeParams(range);
  const now = Math.floor(Date.now() / 1000);
  const data = await birdeyeGet<{ items: Array<{ unixTime: number; value: number }> }>(
    '/defi/history_price',
    { address, address_type: 'token', type, time_from: now - seconds, time_to: now },
  );
  return data.items.map((i) => i.value);
}
