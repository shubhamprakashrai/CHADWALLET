import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { formatUsd } from '@/lib/format';
import type { Activity } from '@/lib/mock';

const META: Record<Activity['type'], { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  buy: { icon: 'arrow-down', color: '#22E06B', label: 'Bought' },
  sell: { icon: 'arrow-up', color: '#F6465D', label: 'Sold' },
  send: { icon: 'arrow-up', color: '#8B95A1', label: 'Sent' },
  receive: { icon: 'arrow-down', color: '#22E06B', label: 'Received' },
};

/** One wallet-activity row (buy/sell/send/receive) with a small type badge. */
export function ActivityRow({ item }: { item: Activity }) {
  const meta = META[item.type];
  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <View>
        <Avatar label={item.tokenSymbol} color={item.color} uri={item.logoURI} size={40} />
        <View
          style={{ backgroundColor: meta.color }}
          className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-bg">
          <Ionicons name={meta.icon} size={10} color="#06140B" />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text">
          {meta.label} {item.tokenSymbol}
        </Text>
        <Text className="text-xs text-text-secondary">
          {item.tokenName} · {item.time}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-[15px] font-semibold text-text">{item.amount}</Text>
        {item.value > 0 && <Text className="text-xs text-text-secondary">{formatUsd(item.value)}</Text>}
      </View>
    </View>
  );
}
