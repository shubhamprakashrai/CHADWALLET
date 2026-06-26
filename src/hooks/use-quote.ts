import { useQuery } from '@tanstack/react-query';

import { getQuote, USDC_MINT } from '@/lib/jupiter';

/**
 * Live "what you'd get" quote for buying `usdAmount` of a token (USDC → token).
 * Powers the quick-buy estimate on token detail. Execution (sign + send) needs
 * the Privy embedded wallet and lands with the dev build.
 */
export function useBuyQuote(outputMint?: string, usdAmount?: number | null) {
  return useQuery({
    queryKey: ['buy-quote', outputMint, usdAmount],
    enabled: !!outputMint && !!usdAmount && usdAmount > 0,
    staleTime: 10_000,
    retry: 0,
    queryFn: () =>
      getQuote({ inputMint: USDC_MINT, outputMint: outputMint!, amount: usdAmount! * 1_000_000 }),
  });
}
