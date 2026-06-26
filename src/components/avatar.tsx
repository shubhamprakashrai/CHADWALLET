import { Image } from 'expo-image';
import { Text, View } from 'react-native';

type Props = {
  /** name/symbol — first character is used for the fallback glyph */
  label: string;
  color?: string;
  size?: number;
  /** subtle ring around the avatar (used on KOL/trade markers) */
  ring?: boolean;
  /** real logo URL (Birdeye); shows the image instead of the letter fallback */
  uri?: string;
};

/**
 * Token/trader avatar. Renders the real logo when a `uri` is given, otherwise a
 * colored circle with the first letter.
 */
export function Avatar({ label, color = '#1C242E', size = 40, ring = false, uri }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: ring ? 2 : 0,
        borderColor: '#0A0D12',
      }}
      className="items-center justify-center overflow-hidden">
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} contentFit="cover" />
      ) : (
        <Text style={{ fontSize: size * 0.42 }} className="font-bold text-bg" numberOfLines={1}>
          {(label?.[0] ?? '?').toUpperCase()}
        </Text>
      )}
    </View>
  );
}
