import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { compact } from '@/lib/format';
import { TWEETS, type Tweet } from '@/lib/mock';

/**
 * DISCOVER  ("/discover") — embedded X (Twitter) feed.
 * Each tweet has a green "+" that kicks off the Launch-a-coin flow.
 */
export default function DiscoverScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="px-4 pb-2 pt-1">
        <Text className="text-2xl font-bold text-text">Discover</Text>
        <Text className="text-sm text-text-secondary">Catch early trends on X</Text>
      </View>
      <FlatList
        data={TWEETS}
        keyExtractor={(t) => t.id}
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        renderItem={({ item }) => <TweetCard tweet={item} />}
      />
    </SafeAreaView>
  );
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const router = useRouter();
  return (
    <View className="flex-row gap-3 px-4 py-3">
      <Avatar label={tweet.author} color={tweet.color} size={40} />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="font-semibold text-text">{tweet.author}</Text>
          <Text className="text-sm text-text-tertiary">{tweet.handle}</Text>
          <Text className="text-sm text-text-tertiary">· {tweet.time}</Text>
        </View>
        <Text className="mt-1 text-[15px] leading-5 text-text">{tweet.text}</Text>

        <View className="mt-3 flex-row items-center gap-6">
          <Stat icon="chatbubble-outline" value={compact(tweet.reposts / 2)} />
          <Stat icon="repeat-outline" value={compact(tweet.reposts)} />
          <Stat icon="heart-outline" value={compact(tweet.likes)} />
          {/* green + : launch a coin from this tweet */}
          <Pressable
            onPress={() => router.push('/launch')}
            className="ml-auto h-8 w-8 items-center justify-center rounded-full bg-primary active:opacity-80">
            <Ionicons name="add" size={20} color="#06140B" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Stat({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Ionicons name={icon} size={16} color="#5B6573" />
      <Text className="text-xs text-text-tertiary">{value}</Text>
    </View>
  );
}
