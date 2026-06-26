import { useQuery } from '@tanstack/react-query';

import { getSolBalance, getTokenAccounts, hasAlchemy } from '@/lib/alchemy';
import { compact } from '@/lib/format';
import { fetchPrices, fetchTokenMeta, SOL_MINT } from '@/lib/jupiter';
import { HOLDINGS, PORTFOLIO, type Holding } from '@/lib/mock';

export type PortfolioData = {
  netWorth: number;
  holdings: Holding[];
  /** true when this is the wallet's real on-chain data (vs. the demo fallback) */
  isReal: boolean;
};

const PALETTE = ['#22E06B', '#F59E0B', '#A78BFA', '#22D3EE', '#FB923C', '#F472B6', '#818CF8', '#84CC16'];
function colorFromMint(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/**
 * Real wallet portfolio = Alchemy (balances) + Jupiter (USD prices + token meta).
 *
 * Falls back to the mock portfolio when there's no Alchemy URL OR the wallet has
 * no priceable holdings (e.g. the mock-auth fake address). So the Account screen
 * looks populated in Expo Go now, and shows the real wallet once Privy is live.
 */
export function usePortfolio(address?: string) {
  return useQuery({
    queryKey: ['portfolio', address],
    enabled: !!address,
    queryFn: async (): Promise<PortfolioData> => {
      const demo: PortfolioData = { netWorth: PORTFOLIO.netWorth, holdings: HOLDINGS, isReal: false };
      if (!hasAlchemy || !address) return demo;

      try {
        const [sol, tokens] = await Promise.all([getSolBalance(address), getTokenAccounts(address)]);
        const mints = [SOL_MINT, ...tokens.map((t) => t.mint)];
        const [prices, meta] = await Promise.all([fetchPrices(mints), fetchTokenMeta(mints)]);

        const holdings: Holding[] = [];

        if (sol > 0) {
          holdings.push({
            tokenId: SOL_MINT,
            name: 'Solana',
            symbol: 'SOL',
            color: '#22E06B',
            amount: sol.toFixed(3),
            value: sol * (prices[SOL_MINT] ?? 0),
            change: 0,
            logoURI: meta[SOL_MINT]?.icon,
          });
        }

        for (const t of tokens) {
          const price = prices[t.mint];
          if (!price) continue; // skip dust / unpriceable tokens
          const m = meta[t.mint];
          holdings.push({
            tokenId: t.mint,
            name: m?.name ?? `${t.mint.slice(0, 4)}…${t.mint.slice(-4)}`,
            symbol: m?.symbol ?? '?',
            color: colorFromMint(t.mint),
            amount: compact(t.amount),
            value: t.amount * price,
            change: 0,
            logoURI: m?.icon,
          });
        }

        if (holdings.length === 0) return demo; // empty/fake wallet → keep demo populated
        holdings.sort((a, b) => b.value - a.value);
        return { netWorth: holdings.reduce((s, h) => s + h.value, 0), holdings, isReal: true };
      } catch {
        return demo; // invalid wallet (mock auth) or network error → demo fallback
      }
    },
  });
}
