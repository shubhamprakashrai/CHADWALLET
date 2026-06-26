import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * AUTH — single source of truth for "who is logged in".
 * ---------------------------------------------------------------------------
 * MOCK implementation (runs in Expo Go for fast dev). login() fakes an OAuth
 * round-trip and mints a fake Solana address; the session persists in
 * SecureStore. The public shape (user / ready / login / logout) is identical to
 * the REAL Privy version parked in `auth-privy.tsx`.
 *
 * 🔁 To go live with real Privy (do this LAST, needs a dev build — not Expo Go):
 *    1. copy auth-privy.tsx over this file
 *    2. re-add <PrivyProvider> in app/_layout.tsx (see the commented block there)
 *    3. npm run ios   (dev build)
 * No screen changes are needed either way — they all just call useAuth().
 */

export type AuthMethod = 'google' | 'apple';

export type AuthUser = {
  id: string;
  email: string;
  method: AuthMethod;
  /** embedded Solana wallet address (Privy provisions this for real later) */
  walletAddress: string;
};

type AuthState = {
  user: AuthUser | null;
  ready: boolean;
  loggingIn: boolean;
  login: (method: AuthMethod) => Promise<void>;
  logout: () => Promise<void>;
};

const SESSION_KEY = 'chad.session.v1';
const AuthContext = createContext<AuthState | null>(null);

/** Generates a base58-looking Solana address for the mock wallet. */
function fakeSolanaAddress(): string {
  const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let out = '';
  for (let i = 0; i < 44; i++) out += base58[Math.floor(Math.random() * base58.length)];
  return out;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Restore a saved session once on startup.
  useEffect(() => {
    SecureStore.getItemAsync(SESSION_KEY)
      .then((saved) => {
        if (saved) setUser(JSON.parse(saved) as AuthUser);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (method: AuthMethod) => {
    setLoggingIn(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // pretend OAuth + wallet creation
      const newUser: AuthUser = {
        id: `mock_${Date.now()}`,
        email: method === 'google' ? 'chad@gmail.com' : 'chad@icloud.com',
        method,
        walletAddress: fakeSolanaAddress(),
      };
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, loggingIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used inside <AuthProvider>');
  return ctx;
}
