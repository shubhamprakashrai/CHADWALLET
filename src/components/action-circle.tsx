import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

/** Round green icon + caption — the Send/Receive/Deposit/Withdraw action row. */
export function ActionCircle({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="items-center gap-2 active:opacity-70">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
        <Ionicons name={icon} size={24} color="#06140B" />
      </View>
      <Text className="text-xs font-medium text-text">{label}</Text>
    </Pressable>
  );
}
