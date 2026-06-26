import { useQuery } from '@tanstack/react-query';

import { fetchTrending, hasBirdeyeKey } from '@/lib/birdeye';
import { TOKENS } from '@/lib/mock';

/**
 * Trending tokens for the Memes tab + Home "Trending".
 *
 * useQuery handles caching, loading/error state and refetch for us. The
 * `queryKey` is the cache id — any screen calling useTrending() shares the same
 * cached result. If no Birdeye key is set, we fall back to mock data so the UI
 * still renders in development.
 */
export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: async () => (hasBirdeyeKey ? fetchTrending(20) : TOKENS),
  });
}
