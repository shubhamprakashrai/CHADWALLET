import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { ChangeBadge } from '@/components/change-badge';
import { useTrending } from '@/hooks/use-trending';
import { compact, formatTokenPrice } from '@/lib/format';
import type { Token } from '@/lib/mock';

/**
 * DISCOVER  ("/discover") — early-trend discovery feed.
 * Real X (Twitter) embedding needs a paid API, so instead this surfaces the
 * REAL trending Solana tokens (Birdeye) as discovery cards. Each has a green "+"
 * to launch a coin and taps through to the token detail.
 */
export default function DiscoverScreen() {
  const { data: tokens = [], isLoading, isRefetching, refetch } = useTrending();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="px-4 pb-2 pt-1">
        <Text className="text-2xl font-bold text-text">Discover</Text>
        <Text className="text-sm text-text-secondary">Catch early trends on Solana</Text>
      </View>
      <FlatList
        data={tokens}
        keyExtractor={(t) => t.id}
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        renderItem={({ item, index }) => <TrendCard token={item} rank={index + 1} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#22E06B" />
        }
        ListEmptyComponent={
          <View className="items-center py-20">
            {isLoading ? <ActivityIndicator color="#22E06B" /> : <Text className="text-text-secondary">No trends yet.</Text>}
          </View>
        }
      />
    </SafeAreaView>
  );
}

function TrendCard({ token, rank }: { token: Token; rank: number }) {
  const router = useRouter();
  const hot = token.change >= 0;
  return (
    <Pressable onPress={() => router.push(`/token/${token.id}`)} className="flex-row gap-3 px-4 py-3 active:bg-surface">
      <Avatar label={token.symbol} color={token.color} uri={token.logoURI} size={44} />
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="flex-1 font-semibold text-text" numberOfLines={1}>
            {token.name}
          </Text>
          <Text className="text-sm font-semibold text-text">{formatTokenPrice(token.price)}</Text>
        </View>
        <View className="mt-0.5 flex-row items-center gap-2">
          <Text className="text-xs text-text-tertiary">#{rank} trending · ${compact(token.mcap)}</Text>
          <ChangeBadge change={token.change} />
        </View>

        <View className="mt-2 flex-row items-center">
          <Text className="text-[13px] text-text-secondary">
            {hot ? '🔥 Heating up' : '👀 On watch'} — {token.symbol} {hot ? 'is breaking out' : 'is cooling off'}
          </Text>
          {/* green + : launch a coin inspired by this trend */}
          <Pressable
            onPress={() => router.push('/launch')}
            hitSlop={8}
            className="ml-auto h-8 w-8 items-center justify-center rounded-full bg-primary active:opacity-80">
            <Ionicons name="add" size={20} color="#06140B" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
