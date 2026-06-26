import { Stack } from 'expo-router';

/**
 * AUTH GROUP LAYOUT  (src/app/(auth)/_layout.tsx)
 * "(auth)" is a route group (parentheses = not in the URL). It holds the
 * screens shown when nobody is logged in — currently just sign-in.
 */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0D12' } }} />;
}
