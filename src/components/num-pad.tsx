import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
  value: string;
  onChange: (next: string) => void;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

/** Calculator-style keypad used by Deposit / Send / Withdraw amount screens. */
export function NumPad({ value, onChange }: Props) {
  const press = (key: string) => {
    if (key === 'del') {
      onChange(value.length <= 1 ? '0' : value.slice(0, -1));
      return;
    }
    if (key === '.' && value.includes('.')) return;
    if (value === '0' && key !== '.') {
      onChange(key);
      return;
    }
    onChange(value + key);
  };

  return (
    <View className="flex-row flex-wrap">
      {KEYS.map((key) => (
        <Pressable
          key={key}
          onPress={() => press(key)}
          className="h-16 w-1/3 items-center justify-center active:opacity-50">
          {key === 'del' ? (
            <Ionicons name="backspace-outline" size={26} color="#FFFFFF" />
          ) : (
            <Text className="text-2xl font-medium text-text">{key}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
