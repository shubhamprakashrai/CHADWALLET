import { useQuery } from '@tanstack/react-query';

import {
  fetchHistory,
  fetchTokenOverview,
  hasBirdeyeKey,
  type ChartRange,
  type TokenDetail,
} from '@/lib/birdeye';
import { getToken } from '@/lib/mock';

/** Mock fallback shaped like a real TokenDetail (used when no Birdeye key). */
function mockDetail(id: string): TokenDetail | undefined {
  const t = getToken(id);
  if (!t) return undefined;
  return { ...t, liquidity: t.mcap * 0.1, volume24h: t.mcap * 0.2, holders: 1200, decimals: 9 };
}

/** Full stats for one token (token detail header + position). */
export function useToken(address?: string) {
  return useQuery({
    queryKey: ['token', address],
    enabled: !!address,
    queryFn: async () =>
      hasBirdeyeKey ? fetchTokenOverview(address!) : (mockDetail(address!) ?? null),
  });
}

/** Price history for the detail chart, re-fetched when the range tab changes. */
export function useTokenChart(address?: string, range: ChartRange = '1D') {
  return useQuery({
    queryKey: ['token-chart', address, range],
    enabled: !!address,
    queryFn: async () =>
      hasBirdeyeKey ? fetchHistory(address!, range) : (getToken(address!)?.series ?? []),
  });
}
