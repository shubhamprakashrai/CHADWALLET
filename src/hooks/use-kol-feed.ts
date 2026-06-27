import { useQuery } from '@tanstack/react-query';

import { fetchTokenEvents, hasCodexKey } from '@/lib/codex';
import { shortAddress } from '@/lib/format';
import { KOL_TRADES, type KolTrade, type Token } from '@/lib/mock';
import { useTrending } from '@/hooks/use-trending';

const PALETTE = ['#F59E0B', '#A78BFA', '#22D3EE', '#60A5FA', '#F472B6', '#84CC16', '#FB923C', '#818CF8'];
function colorFor(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function ago(unixSec: number): string {
  if (!unixSec) return '';
  const d = Math.max(0, Math.floor(Date.now() / 1000) - unixSec);
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

/**
 * Live KOL / whale feed — real on-chain Buy/Sell trades from Codex for the top
 * trending tokens, merged + sorted by time. Falls back to mock KOL_TRADES when
 * Codex isn't configured. (Traders are shown by wallet since Codex gives the
 * maker address, not a handle.)
 */
export function useKolFeed() {
  const { data: tokens = [] } = useTrending();
  const top = tokens.slice(0, 4); // a few tokens keeps us well under the free-tier rate limit

  return useQuery({
    queryKey: ['kol-feed', top.map((t) => t.id)],
    enabled: top.length > 0,
    staleTime: 20_000,
    queryFn: async (): Promise<KolTrade[]> => {
      if (!hasCodexKey) return KOL_TRADES;
      try {
        const perToken = await Promise.all(
          top.map((t) => fetchTokenEvents(t.id, 6).then((events) => ({ token: t, events }))),
        );

        const pairs: { token: Token; e: (typeof perToken)[number]['events'][number] }[] = [];
        for (const { token, events } of perToken) for (const e of events) pairs.push({ token, e });

        pairs.sort((a, b) => b.e.timestamp - a.e.timestamp);

        const trades = pairs.slice(0, 20).map(({ token, e }, i) => ({
          // always include the index so split swaps (same txHash) stay unique
          id: `${e.txHash || e.maker}-${i}`,
          trader: shortAddress(e.maker, 4, 4),
          traderColor: colorFor(e.maker),
          side: e.type === 'Buy' ? ('bought' as const) : ('sold' as const),
          amount: e.valueUsd,
          venue: 'Solana',
          tokenId: token.id,
          tokenName: token.name,
          tokenMcap: token.mcap,
          tokenPrice: token.price,
          ago: ago(e.timestamp),
        }));

        return trades.length ? trades : KOL_TRADES;
      } catch {
        return KOL_TRADES;
      }
    },
  });
}
