import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/auth/auth-context';
import { queryClient } from '@/lib/query-client';

/**
 * ROOT LAYOUT  (src/app/_layout.tsx)
 * ----------------------------------
 * Every file in `src/app/` is a SCREEN; every `_layout.tsx` is the NAVIGATOR
 * wrapping the screens beside it. This root uses a <Stack>.
 *
 * NEW in Phase 4: the whole app is wrapped in <AuthProvider>, and <RootNavigator>
 * reads the auth state to GATE access — logged-out users are bounced to
 * (auth)/sign-in, logged-in users into the (tabs).
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {/*
          🔁 REAL PRIVY (do last, needs a dev build — not Expo Go). Re-enable by:
          1. `import { PrivyProvider } from '@privy-io/expo';`
          2. wrap <AuthProvider> with:
             <PrivyProvider
               appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
               clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!}
               config={{ embedded: { solana: { createOnLogin: 'users-without-wallets' } } }}>
          3. copy auth-privy.tsx → auth-context.tsx
          For now the MOCK AuthProvider runs fine in Expo Go without Privy. */}
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { user, ready } = useAuth();
  const segments = useSegments(); // e.g. ['(auth)','sign-in'] or ['(tabs)']
  const router = useRouter();

  // The GATE: whenever auth state or the current route changes, redirect.
  useEffect(() => {
    if (!ready) return; // wait until we've checked storage for a session
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // not logged in but trying to view the app -> send to sign-in
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // logged in but still on sign-in -> send into the app
      router.replace('/');
    }
  }, [user, ready, segments, router]);

  // While restoring the session, show a tiny branded splash instead of a flash
  // of the wrong screen.
  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-white">
          <Image
            source={require('@/assets/images/chad-light.png')}
            style={{ width: 80, height: 80 }}
            contentFit="contain"
          />
        </View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0D12' },
        animation: 'slide_from_right',
      }}>
      {/* Auth section (sign-in). */}
      <Stack.Screen name="(auth)" />

      {/* Main app behind the gate. */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="token/[id]" />

      {/* Modals slide up from the bottom. */}
      <Stack.Screen name="search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="launch" options={{ presentation: 'modal' }} />
      <Stack.Screen name="deposit" options={{ presentation: 'modal' }} />
      <Stack.Screen name="send" options={{ presentation: 'modal' }} />
      <Stack.Screen name="receive" options={{ presentation: 'modal' }} />
      <Stack.Screen name="withdraw" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
