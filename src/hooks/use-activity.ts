import { useQuery } from '@tanstack/react-query';

import { getRecentActivity, hasAlchemy } from '@/lib/alchemy';
import { ACTIVITIES, type Activity } from '@/lib/mock';

/** unix seconds → "2m ago" style label. */
function ago(unixSec: number | null): string {
  if (!unixSec) return '';
  const s = Math.max(0, Math.floor(Date.now() / 1000) - unixSec);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/**
 * Wallet activity (recent transactions). Real on-chain signatures from Alchemy
 * when the wallet has history; otherwise the demo activity list — so the UI is
 * populated in Expo Go and shows real transactions once a real wallet is used.
 */
export function useActivity(address?: string) {
  return useQuery({
    queryKey: ['activity', address],
    enabled: !!address,
    queryFn: async (): Promise<Activity[]> => {
      if (!hasAlchemy || !address) return ACTIVITIES;
      try {
        const sigs = await getRecentActivity(address, 10);
        if (sigs.length === 0) return ACTIVITIES;
        return sigs.map((s) => ({
          id: s.signature,
          type: 'send' as const,
          tokenSymbol: 'SOL',
          tokenName: s.failed ? 'Failed transaction' : 'On-chain transaction',
          color: '#22D3EE',
          amount: `${s.signature.slice(0, 6)}…${s.signature.slice(-4)}`,
          value: 0,
          time: ago(s.time),
        }));
      } catch {
        return ACTIVITIES; // invalid/empty wallet (mock auth) → demo activity
      }
    },
  });
}
