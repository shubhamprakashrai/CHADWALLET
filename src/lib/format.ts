/** Small formatting helpers used across the UI. Real data lands in Phase 5. */

export function formatUsd(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) return '$' + compact(value);
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** 1_234 -> 1.23K, 3_270_000 -> 3.27M */
export function compact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
  if (abs >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (abs >= 1_000) return (value / 1_000).toFixed(2) + 'K';
  return value.toFixed(2);
}

/** Tiny memecoin prices like $0.0₄3925 — ChadWallet renders the leading-zero run as a subscript. */
export function formatTokenPrice(price: number): string {
  if (price >= 1) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 0.01) return '$' + price.toFixed(4);
  // count leading zeros after the decimal point
  const str = price.toFixed(20);
  const decimals = str.split('.')[1] ?? '';
  let zeros = 0;
  while (decimals[zeros] === '0') zeros++;
  const significant = decimals.slice(zeros, zeros + 4);
  return `$0.0(${zeros})${significant}`;
}

export function formatPct(pct: number): string {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

export function shortAddress(addr: string, lead = 4, tail = 4): string {
  if (addr.length <= lead + tail) return addr;
  return `${addr.slice(0, lead)}…${addr.slice(-tail)}`;
}
