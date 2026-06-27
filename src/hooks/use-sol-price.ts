import { useQuery } from '@tanstack/react-query';

import { fetchPrices, SOL_MINT } from '@/lib/jupiter';

/** Live SOL/USD price (Jupiter), cached 30s. Used by the deposit/withdraw screens. */
export function useSolPrice() {
  return useQuery({
    queryKey: ['sol-price'],
    staleTime: 30_000,
    queryFn: async () => {
      const prices = await fetchPrices([SOL_MINT]);
      return prices[SOL_MINT] ?? 0;
    },
  });
}
