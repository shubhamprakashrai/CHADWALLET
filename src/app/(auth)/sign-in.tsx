import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth, type AuthMethod } from '@/auth/auth-context';

/**
 * SIGN-IN  ("/(auth)/sign-in") — the gate. Tapping a button calls login(),
 * which (today) mocks OAuth and mints a wallet; the root layout then redirects
 * into the tabs automatically once `user` becomes non-null.
 */
export default function SignInScreen() {
  const { login, loggingIn } = useAuth();
  // remember which button is spinning so only that one shows a loader
  const [pending, setPending] = useState<AuthMethod | null>(null);

  const onLogin = async (method: AuthMethod) => {
    setPending(method);
    try {
      await login(method);
    } finally {
      setPending(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* logo + wordmark, centered */}
      <View className="flex-1 items-center justify-center gap-5 px-8">
        {/* white app-icon tile with the dark logo (matches the real splash) */}
        <View className="h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-white">
          <Image
            source={require('@/assets/images/chad-light.png')}
            style={{ width: 96, height: 96 }}
            contentFit="contain"
          />
        </View>
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-text">ChadWallet</Text>
          <Text className="text-center text-base text-text-secondary">
            Find the next 100x memecoins.{'\n'}Never miss the next breakout.
          </Text>
        </View>
      </View>

      {/* social login buttons */}
      <View className="gap-3 px-6 pb-4">
        <SocialButton
          icon="logo-apple"
          label="Continue with Apple"
          loading={pending === 'apple'}
          disabled={loggingIn}
          onPress={() => onLogin('apple')}
        />
        <SocialButton
          icon="logo-google"
          label="Continue with Google"
          loading={pending === 'google'}
          disabled={loggingIn}
          onPress={() => onLogin('google')}
        />
        <Text className="mt-2 text-center text-xs text-text-tertiary">
          By continuing you agree to the Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  label,
  loading,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`h-14 w-full flex-row items-center justify-center gap-3 rounded-full bg-white active:opacity-80 ${
        disabled && !loading ? 'opacity-50' : ''
      }`}>
      {loading ? (
        <ActivityIndicator color="#0A0D12" />
      ) : (
        <>
          <Ionicons name={icon} size={22} color="#0A0D12" />
          <Text className="text-base font-semibold text-bg">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
