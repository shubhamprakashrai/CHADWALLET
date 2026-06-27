import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth, type AuthMethod } from '@/auth/auth-context';

/**
 * SIGN-IN  ("/(auth)/sign-in") — the gate. Privy email (one-time code) + Google,
 * per the spec. The root layout redirects into the tabs once `user` becomes
 * non-null, so we don't navigate manually here.
 */
export default function SignInScreen() {
  const { login, loggingIn, sendEmailCode, loginWithEmail } = useAuth();
  // remember which social button is spinning so only that one shows a loader
  const [pending, setPending] = useState<AuthMethod | null>(null);

  // email one-time-code flow
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);

  const onLogin = async (method: AuthMethod) => {
    setPending(method);
    try {
      await login(method);
    } finally {
      setPending(null);
    }
  };

  const onSendCode = async () => {
    if (!email.includes('@') || email.trim().length < 5) {
      Alert.alert('Enter a valid email', 'e.g. you@example.com');
      return;
    }
    setEmailBusy(true);
    try {
      await sendEmailCode(email);
      setCodeSent(true);
    } catch (e) {
      Alert.alert('Could not send code', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setEmailBusy(false);
    }
  };

  const onVerify = async () => {
    if (code.trim().length < 4) {
      Alert.alert('Enter the code', 'Check your email for the 6-digit code.');
      return;
    }
    setEmailBusy(true);
    try {
      await loginWithEmail(email, code);
      // success → the root layout redirects into the tabs automatically
    } catch (e) {
      Alert.alert('Invalid code', e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setEmailBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      {/* logo + wordmark, centered */}
      <View className="flex-1 items-center justify-center gap-5 px-8">
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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="gap-3 px-6 pb-4">
          {/* EMAIL one-time-code flow */}
          {!codeSent ? (
            <>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#5B6573"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!emailBusy}
                className="h-14 rounded-full bg-surface px-5 text-base text-text"
              />
              <PrimaryButton label="Continue with Email" loading={emailBusy} onPress={onSendCode} />
            </>
          ) : (
            <>
              <Text className="text-center text-sm text-text-secondary">
                Enter the code sent to {email}
              </Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="6-digit code"
                placeholderTextColor="#5B6573"
                keyboardType="number-pad"
                maxLength={6}
                editable={!emailBusy}
                className="h-14 rounded-full bg-surface px-5 text-center text-lg tracking-[8px] text-text"
              />
              <PrimaryButton label="Verify & Sign in" loading={emailBusy} onPress={onVerify} />
              <Pressable onPress={() => { setCodeSent(false); setCode(''); }}>
                <Text className="text-center text-xs text-text-tertiary">Use a different email</Text>
              </Pressable>
            </>
          )}

          {/* divider */}
          <View className="my-1 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-surface2" />
            <Text className="text-xs text-text-tertiary">or</Text>
            <View className="h-px flex-1 bg-surface2" />
          </View>

          {/* social login */}
          <SocialButton
            icon="logo-google"
            label="Continue with Google"
            loading={pending === 'google'}
            disabled={loggingIn || emailBusy}
            onPress={() => onLogin('google')}
          />
          <SocialButton
            icon="logo-apple"
            label="Continue with Apple"
            loading={pending === 'apple'}
            disabled={loggingIn || emailBusy}
            // Apple Sign-In is wired but pending its own Apple Developer OAuth
            // credentials (Services ID + signing key). Use email or Google for now.
            onPress={() =>
              Alert.alert('Apple Sign-In', 'Coming soon — please use email or Google for now.')
            }
          />
          <Text className="mt-2 text-center text-xs text-text-tertiary">
            By continuing you agree to the Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Green primary CTA (used for the email flow). */
function PrimaryButton({
  label,
  loading,
  onPress,
}: {
  label: string;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="h-14 w-full flex-row items-center justify-center rounded-full bg-primary active:opacity-80">
      {loading ? (
        <ActivityIndicator color="#0A0D12" />
      ) : (
        <Text className="text-base font-semibold text-primary-fg">{label}</Text>
      )}
    </Pressable>
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
