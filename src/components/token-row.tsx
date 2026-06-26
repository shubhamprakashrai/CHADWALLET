import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { ChangeBadge } from '@/components/change-badge';
import { Sparkline } from '@/components/sparkline';
import { compact, formatTokenPrice } from '@/lib/format';
import type { Token } from '@/lib/mock';

type Props = {
  token: Token;
  /** show the bonus sparkline between the name and price columns */
  sparkline?: boolean;
};

export function TokenRow({ token, sparkline }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/token/${token.id}`)}
      className="flex-row items-center gap-3 px-4 py-3 active:bg-surface">
      <Avatar label={token.symbol} color={token.color} uri={token.logoURI} size={40} />

      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-text" numberOfLines={1}>
          {token.name}
        </Text>
        <Text className="text-xs text-text-secondary">${compact(token.mcap)}</Text>
      </View>

      {sparkline && <Sparkline data={token.series} />}

      <View className="items-end">
        <Text className="text-[15px] font-semibold text-text">{formatTokenPrice(token.price)}</Text>
        <ChangeBadge change={token.change} />
      </View>
    </Pressable>
  );
}
