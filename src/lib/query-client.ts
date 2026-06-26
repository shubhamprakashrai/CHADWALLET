import { QueryClient } from '@tanstack/react-query';

/**
 * One shared React Query client for the whole app.
 *
 * React Query = the layer that fetches + CACHES server data. Instead of calling
 * APIs directly in screens, we define "queries"; RQ remembers the result, reuses
 * it across screens, refetches in the background, and powers pull-to-refresh.
 *
 * The defaults below are tuned for Birdeye's free tier (1 request/second), so we
 * cache hard and avoid hammering it.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // data is "fresh" for 30s → no refetch within that window
      gcTime: 5 * 60_000, // keep unused data cached for 5 min
      retry: 1, // retry a failed request once
      refetchOnWindowFocus: false, // not useful on mobile
    },
  },
});
