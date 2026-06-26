import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { Avatar } from '@/components/avatar';
import { ChangeBadge } from '@/components/change-badge';
import { LineChart } from '@/components/line-chart';
import { PillButton } from '@/components/pill-button';
import { ScreenHeader } from '@/components/screen-header';
import { SegmentTabs } from '@/components/segment-tabs';
import { useBuyQuote } from '@/hooks/use-quote';
import { useToken, useTokenChart } from '@/hooks/use-token';
import { useWatchlist } from '@/hooks/use-watchlist';
import type { ChartRange } from '@/lib/birdeye';
import { compact, formatTokenPrice, formatUsd } from '@/lib/format';
import { TOKEN_RANGE_TABS } from '@/lib/mock';

/**
 * TOKEN DETAIL  ("/token/[id]") — a DYNAMIC route. The `[id]` is the token's
 * Birdeye address; useToken() fetches its stats and useTokenChart() its price
 * history (re-fetched when the range tab changes).
 */
export default function TokenDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [tab, setTab] = useState('Trades');
  const [range, setRange] = useState('1D');
  const [buyUsd, setBuyUsd] = useState<number | null>(null);

  const { user } = useAuth();
  const { data: token, isLoading } = useToken(id);
  const { data: series = [] } = useTokenChart(id, range as ChartRange);
  const { isStarred, toggle } = useWatchlist(user?.id);
  const { data: quote, isFetching: quoting } = useBuyQuote(id, buyUsd);
  const starred = isStarred(id);

  if (isLoading && !token) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#22E06B" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-bg">
        <Text className="text-text-secondary">Token not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <ScreenHeader
        titleNode={
          <View className="flex-row items-center gap-2">
            <Avatar label={token.symbol} color={token.color} uri={token.logoURI} size={26} />
            <Text className="text-base font-semibold text-text">{token.symbol.toLowerCase()}</Text>
          </View>
        }
        actions={[
          {
            icon: starred ? 'star' : 'star-outline',
            color: starred ? '#22E06B' : '#FFFFFF',
            onPress: () => toggle({ id, name: token.name, symbol: token.symbol, starred }),
          },
          { icon: 'share-outline' },
        ]}
      />

      <ScrollView contentContainerClassName="pb-6">
        {/* price block */}
        <View className="px-4 pt-2">
          <Text className="text-sm text-text-secondary">{token.symbol.toLowerCase()}</Text>
          <Text className="text-4xl font-bold text-text">${compact(token.mcap)}</Text>
          <View className="mt-1 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <ChangeBadge change={token.change} />
              <Text className="text-sm text-text-secondary">
                {formatUsd((token.mcap * token.change) / 100, { compact: true })} Today
              </Text>
            </View>
            <SegmentTabs tabs={['Movers', 'Trades']} value={tab} onChange={setTab} variant="text" />
          </View>
        </View>

        {/* chart (real price history; min/max as the green/red bounds) */}
        <View className="mt-3 px-2">
          <LineChart data={series} height={210} />
        </View>
        <View className="mt-2 flex-row justify-between px-4">
          <Text className="text-xs text-primary">
            {series.length ? formatTokenPrice(Math.min(...series)) : '—'}
          </Text>
          <Text className="text-xs text-danger">
            {series.length ? formatTokenPrice(Math.max(...series)) : '—'}
          </Text>
        </View>

        {/* range tabs */}
        <View className="mt-3 px-4">
          <SegmentTabs tabs={TOKEN_RANGE_TABS} value={range} onChange={setRange} variant="pill" scroll />
        </View>

        {/* contract / X chips */}
        <View className="mt-4 flex-row gap-3 px-4">
          <Chip icon="◎" label={token.id.slice(0, 6).toUpperCase()} />
          <Chip icon="𝕏" label={token.symbol.toLowerCase()} />
        </View>

        {/* relaunch */}
        <View className="mt-3 px-4">
          <PillButton label="Relaunch" variant="surface" onPress={() => router.push('/launch')} />
        </View>

        {/* quick-buy chips (tap → live Jupiter quote) */}
        <View className="mt-5 flex-row gap-3 px-4">
          {[10, 50, 100].map((amt) => {
            const active = buyUsd === amt;
            return (
              <Pressable
                key={amt}
                onPress={() => setBuyUsd(active ? null : amt)}
                className={`flex-1 items-center rounded-full py-3 active:opacity-80 ${active ? 'bg-primary' : 'bg-surface2'}`}>
                <Text className={`font-semibold ${active ? 'text-primary-fg' : 'text-text'}`}>${amt}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* live quote estimate */}
        {buyUsd != null && (
          <Text className="mt-2 px-4 text-center text-sm text-text-secondary">
            {quoting
              ? 'Getting best price…'
              : quote
                ? `≈ ${compact(Number(quote.outAmount) / 10 ** token.decimals)} ${token.symbol} for $${buyUsd}`
                : 'No route found'}
          </Text>
        )}

        {/* buy / sell */}
        <View className="mt-3 flex-row gap-3 px-4">
          <View className="flex-1">
            <PillButton label="Buy" variant="primary" />
          </View>
          <View className="flex-1">
            <PillButton label="Sell" variant="danger" />
          </View>
        </View>

        {/* your position */}
        <Text className="mb-2 mt-7 px-4 text-xl font-bold text-text">Your position</Text>
        <View className="mx-4 flex-row rounded-2xl bg-surface p-4">
          <Position label="Quantity" value={`${compact(173_700_000)}`} />
          <Position label="Value" value={formatUsd(693.29)} />
          <Position label="PnL" value="+$214.50" positive />
        </View>

        <Text className="mt-4 px-4 text-xs text-text-tertiary">
          Price {formatTokenPrice(token.price)} · MCap ${compact(token.mcap)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <View className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-surface2 py-2.5">
      <Text className="text-text-secondary">{icon}</Text>
      <Text className="text-sm font-medium text-text">{label}</Text>
    </View>
  );
}

function Position({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <View className="flex-1">
      <Text className="text-xs text-text-secondary">{label}</Text>
      <Text className={`mt-1 text-sm font-semibold ${positive ? 'text-primary' : 'text-text'}`}>{value}</Text>
    </View>
  );
}
