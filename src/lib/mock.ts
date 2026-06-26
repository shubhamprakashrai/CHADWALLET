/**
 * Mock data for the static screen shells (Phase 3).
 * Phase 5 swaps these out for Birdeye/Codex via React Query — the shapes here
 * intentionally mirror what those hooks will return.
 */

export type Token = {
  id: string;
  name: string;
  symbol: string;
  /** market cap in USD */
  mcap: number;
  price: number;
  /** 24h percent change */
  change: number;
  /** brand color for the avatar fallback */
  color: string;
  /** normalized 0..1 price series for sparkline + detail chart */
  series: number[];
  /** real token logo (from Birdeye); falls back to the colored letter avatar */
  logoURI?: string;
  /** 24h trading volume in USD (for the "Most Traded" filter) */
  volume?: number;
};

/** Deterministic pseudo-random series so charts stay stable across re-renders. */
function series(seed: number, points = 48, trend = 0.4): number[] {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < points; i++) {
    v += (next() - 0.5) * 0.18 + (trend - 0.5) * 0.01;
    v = Math.max(0.05, Math.min(0.95, v));
    out.push(v);
  }
  return out;
}

export const TOKENS: Token[] = [
  { id: 'so-much-higher', name: 'SO MUCH HIGHER', symbol: 'HIGHER', mcap: 391_440, price: 0.00003925, change: 159.2, color: '#4ADE80', series: series(11, 48, 0.85) },
  { id: 'dumb-money', name: 'Dumb Money', symbol: 'DUMB', mcap: 3_270_000, price: 0.003292, change: 8.63, color: '#F59E0B', series: series(22, 48, 0.62) },
  { id: '360noscope', name: '360noscope420blazeit', symbol: '360', mcap: 106_940, price: 0.0001055, change: 30.39, color: '#A78BFA', series: series(33, 48, 0.7) },
  { id: 'kicau-mania', name: 'KICAU MANIA', symbol: 'KICAU', mcap: 108_290, price: 0.0001082, change: 44.95, color: '#22D3EE', series: series(44, 48, 0.78) },
  { id: 'jared-subway', name: 'JaredFromSubway', symbol: 'JARED', mcap: 108_560, price: 0.0001085, change: 39.58, color: '#FB923C', series: series(55, 48, 0.74) },
  { id: 'schizo-signals', name: 'SCHIZO SIGNALS', symbol: 'SCHIZO', mcap: 1_180_000, price: 0.001176, change: 105.0, color: '#F472B6', series: series(66, 48, 0.82) },
  { id: 'magic-internet', name: 'Magic Internet Money', symbol: 'MIM', mcap: 411_110, price: 0.0004074, change: 34.96, color: '#818CF8', series: series(77, 48, 0.69) },
  { id: 'unc', name: 'unc', symbol: 'UNC', mcap: 8_491_000, price: 0.00007192, change: -1.42, color: '#94A3B8', series: series(88, 48, 0.46) },
  { id: 'shrek2hulk', name: 'Shrek2HulkSimbaAnusH', symbol: 'SHREK', mcap: 82_540, price: 0.00003925, change: -79.59, color: '#84CC16', series: series(99, 48, 0.2) },
  { id: 'disabled-alpha', name: 'The Disabled Alpha', symbol: 'ALPHA', mcap: 27_250, price: 0.0002725, change: 12.4, color: '#2DD4BF', series: series(101, 48, 0.6) },
  { id: 'better-future', name: 'A Better Future', symbol: 'FUTURE', mcap: 4_970, price: 0.0004967, change: -4.1, color: '#F87171', series: series(112, 48, 0.42) },
];

export function getToken(id: string): Token | undefined {
  return TOKENS.find((t) => t.id === id);
}

export type KolTrade = {
  id: string;
  trader: string;
  traderColor: string;
  side: 'bought' | 'sold';
  amount: number;
  venue: string;
  tokenId: string;
  tokenName: string;
  tokenMcap: number;
  tokenPrice: number;
  ago: string;
};

export const KOL_TRADES: KolTrade[] = [
  { id: 'k1', trader: 'Roman', traderColor: '#F59E0B', side: 'sold', amount: 100.41, venue: 'Pump', tokenId: 'disabled-alpha', tokenName: 'The Disabled Alpha', tokenMcap: 27_250, tokenPrice: 0.0002725, ago: '51s ago' },
  { id: 'k2', trader: 'Roman', traderColor: '#F59E0B', side: 'sold', amount: 100.41, venue: 'Pump', tokenId: 'disabled-alpha', tokenName: 'The Disabled Alpha', tokenMcap: 27_250, tokenPrice: 0.0002725, ago: '1m ago' },
  { id: 'k3', trader: 'Zrool 尔', traderColor: '#A78BFA', side: 'sold', amount: 142.1, venue: 'Pump', tokenId: 'better-future', tokenName: 'A Better Future', tokenMcap: 4_970, tokenPrice: 0.0004967, ago: '1m ago' },
  { id: 'k4', trader: 'Zrool 尔', traderColor: '#A78BFA', side: 'bought', amount: 124.32, venue: 'Pump', tokenId: 'better-future', tokenName: 'A Better Future', tokenMcap: 4_970, tokenPrice: 0.0004967, ago: '1m ago' },
  { id: 'k5', trader: 'Cupsey', traderColor: '#22D3EE', side: 'sold', amount: 107.91, venue: 'Pump', tokenId: 'better-future', tokenName: 'A Better Future', tokenMcap: 8_430, tokenPrice: 0.0008433, ago: '3m ago' },
  { id: 'k6', trader: 'Esee', traderColor: '#60A5FA', side: 'sold', amount: 193.14, venue: 'Pump', tokenId: 'better-future', tokenName: 'A Better Future', tokenMcap: 4_150, tokenPrice: 0.0004151, ago: '3m ago' },
];

export type Holding = {
  tokenId: string;
  name: string;
  symbol: string;
  color: string;
  amount: string;
  value: number;
  change: number;
  logoURI?: string;
};

export const HOLDINGS: Holding[] = [
  { tokenId: 'unc', name: 'ChadWallet', symbol: 'CHAD', color: '#22E06B', amount: '173.7M', value: 693.29, change: 0.01 },
  { tokenId: 'dumb-money', name: 'Dumb Money', symbol: 'DUMB', color: '#F59E0B', amount: '12.4M', value: 48.21, change: 8.63 },
  { tokenId: 'schizo-signals', name: 'SCHIZO SIGNALS', symbol: 'SCHIZO', color: '#F472B6', amount: '2.1M', value: 32.48, change: 105.0 },
];

export type Activity = {
  id: string;
  type: 'buy' | 'sell' | 'send' | 'receive';
  tokenSymbol: string;
  tokenName: string;
  color: string;
  amount: string;
  value: number;
  time: string;
  logoURI?: string;
};

/** Demo wallet activity (shown until a real funded wallet has on-chain history). */
export const ACTIVITIES: Activity[] = [
  { id: 'a1', type: 'buy', tokenSymbol: 'CHAD', tokenName: 'ChadWallet', color: '#22E06B', amount: '173.7M', value: 50, time: '2m ago' },
  { id: 'a2', type: 'sell', tokenSymbol: 'DUMB', tokenName: 'Dumb Money', color: '#F59E0B', amount: '4.2M', value: 18.4, time: '1h ago' },
  { id: 'a3', type: 'receive', tokenSymbol: 'SOL', tokenName: 'Solana', color: '#22D3EE', amount: '0.5', value: 34.5, time: '3h ago' },
  { id: 'a4', type: 'buy', tokenSymbol: 'SCHIZO', tokenName: 'SCHIZO SIGNALS', color: '#F472B6', amount: '2.1M', value: 25, time: '5h ago' },
  { id: 'a5', type: 'send', tokenSymbol: 'SOL', tokenName: 'Solana', color: '#22D3EE', amount: '0.2', value: 13.8, time: '1d ago' },
];

export const PORTFOLIO = {
  netWorth: 773.98,
  changeAbs: 773.99,
  changePeriod: 'Past year',
  walletAddress: '6NcHNGr7vQx8kP2mZ4tT9wYbFhJ3uD5sLqWcRaEoBnM',
  series: series(7, 48, 0.9),
};

export type Tweet = {
  id: string;
  author: string;
  handle: string;
  color: string;
  time: string;
  text: string;
  likes: number;
  reposts: number;
};

export const TWEETS: Tweet[] = [
  { id: 't1', author: 'toly', handle: '@aeyakovenko', color: '#22D3EE', time: '2h', text: 'memecoins are the on-chain stress test we never asked for but absolutely needed', likes: 4210, reposts: 832 },
  { id: 't2', author: 'Ansem', handle: '@blknoiz06', color: '#F59E0B', time: '4h', text: 'catch early trends on X before they hit the timeline. this one is sending 🚀', likes: 9120, reposts: 1503 },
  { id: 't3', author: 'mert', handle: '@0xMert_', color: '#A78BFA', time: '6h', text: 'solana doing 5000 TPS while you were sleeping. memecoin season loading.', likes: 6730, reposts: 1140 },
];

export const KOLS = [
  { id: 'jijo', name: 'jijo', handle: '@jijo_exe', color: '#84CC16', pnl: 2_490_000, change: 1.59, winRate: 68.5, trades: '37.4K', totalPnl: 4_310_000, avgProfit: 148.29, series: series(5, 48, 0.92) },
  { id: 'cupsey', name: 'Cupsey', handle: '@cupseyy', color: '#22D3EE', pnl: 1_120_000, change: 3.2, winRate: 61.2, trades: '21.8K', totalPnl: 2_010_000, avgProfit: 92.4, series: series(13, 48, 0.85) },
];

/** Home feed segmented tabs. */
export const HOME_TABS = ['Live', 'KOLs', '# Memecoin', 'Trending'] as const;
/** Account/token chart range tabs. */
export const RANGE_TABS = ['1D', '1W', '1M', '3M', '1Y'] as const;
export const TOKEN_RANGE_TABS = ['LIVE', '1D', '1W', '1M', '3M', '1Y', '5Y'] as const;
