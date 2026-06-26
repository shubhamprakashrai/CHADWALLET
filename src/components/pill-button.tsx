import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'danger' | 'surface';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

const BG: Record<Variant, string> = {
  primary: 'bg-primary',
  danger: 'bg-danger',
  surface: 'bg-surface2',
};
const FG: Record<Variant, string> = {
  primary: 'text-primary-fg',
  danger: 'text-white',
  surface: 'text-text',
};

/** Full-width pill — the app's main call-to-action shape (Buy / Sell / Deposit…). */
export function PillButton({ label, onPress, variant = 'primary', loading, disabled, className }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full flex-row items-center justify-center rounded-full py-4 ${BG[variant]} ${
        disabled ? 'opacity-50' : ''
      } active:opacity-80 ${className ?? ''}`}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#06140B' : '#FFFFFF'} />
      ) : (
        <Text className={`text-base font-bold ${FG[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
