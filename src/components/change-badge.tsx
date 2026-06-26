import { Text, View } from 'react-native';

import { formatPct } from '@/lib/format';

type Props = {
  change: number;
  /** show ▲/▼ triangle before the number */
  arrow?: boolean;
  className?: string;
};

/** Green/red percent label used in rows, headers and holdings. */
export function ChangeBadge({ change, arrow = true, className }: Props) {
  const up = change >= 0;
  const color = up ? 'text-primary' : 'text-danger';
  return (
    <View className={`flex-row items-center ${className ?? ''}`}>
      {arrow && <Text className={`${color} mr-0.5 text-xs`}>{up ? '▲' : '▼'}</Text>}
      <Text className={`${color} text-sm font-semibold`}>{formatPct(change)}</Text>
    </View>
  );
}
