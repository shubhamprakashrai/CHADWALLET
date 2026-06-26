import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { compact, formatTokenPrice, formatUsd } from '@/lib/format';
import type { KolTrade } from '@/lib/mock';

/** A KOL "bought/sold $X on Pump" card from the Home feed. */
export function KolCard({ trade }: { trade: KolTrade }) {
  const router = useRouter();
  const sideColor = trade.side === 'bought' ? 'text-primary' : 'text-danger';
  return (
    <Pressable
      onPress={() => router.push(`/token/${trade.tokenId}`)}
      className="px-4 py-2.5 active:bg-surface">
      <View className="flex-row items-center gap-2">
        <Avatar label={trade.trader} color={trade.traderColor} size={32} />
        <Text className="flex-1 text-[15px] text-text" numberOfLines={1}>
          <Text className="font-semibold">{trade.trader} </Text>
          <Text className={`font-semibold ${sideColor}`}>{trade.side} </Text>
          <Text className="text-text-secondary">{formatUsd(trade.amount)} on {trade.venue}</Text>
        </Text>
        <Text className="text-xs text-text-tertiary">{trade.ago}</Text>
      </View>

      <View className="ml-10 mt-2 flex-row items-center gap-3 rounded-xl bg-surface p-2.5">
        <Avatar label={trade.tokenName} color="#2A323C" size={32} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-text" numberOfLines={1}>
            {trade.tokenName}
          </Text>
          <Text className="text-xs text-text-secondary">${compact(trade.tokenMcap)}</Text>
        </View>
        <Text className="text-sm font-semibold text-text">{formatTokenPrice(trade.tokenPrice)}</Text>
      </View>
    </Pressable>
  );
}
