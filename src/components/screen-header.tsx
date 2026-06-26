import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type Action = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  color?: string;
};

type Props = {
  title?: string;
  /** custom node rendered in place of the title (e.g. avatar + name) */
  titleNode?: React.ReactNode;
  showBack?: boolean;
  actions?: Action[];
};

/** Back button + centered title + right-aligned action icons. */
export function ScreenHeader({ title, titleNode, showBack = true, actions = [] }: Props) {
  const router = useRouter();
  return (
    <View className="h-12 flex-row items-center px-4">
      <View className="w-16 flex-row items-center">
        {showBack && (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="active:opacity-60">
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        {titleNode ?? <Text className="text-base font-semibold text-text">{title}</Text>}
      </View>

      <View className="w-16 flex-row items-center justify-end gap-4">
        {actions.map((a, i) => (
          <Pressable key={i} onPress={a.onPress} hitSlop={10} className="active:opacity-60">
            <Ionicons name={a.icon} size={22} color={a.color ?? '#FFFFFF'} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
