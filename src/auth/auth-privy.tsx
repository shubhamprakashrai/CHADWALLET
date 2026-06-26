import {
  useEmbeddedSolanaWallet,
  useLoginWithOAuth,
  usePrivy,
} from '@privy-io/expo';
import { createContext, useCallback, useContext, useState } from 'react';

/**
 * AUTH — single source of truth for "who is logged in".
 * ---------------------------------------------------------------------------
 * Now backed by REAL Privy. The mock version lived here in Phase 4; the public
 * shape below (user / ready / login / logout) is unchanged, so every screen that
 * calls useAuth() keeps working without edits.
 *
 * Privy pieces used:
 *   - usePrivy()                -> the logged-in user, isReady, logout
 *   - useLoginWithOAuth()       -> Google/Apple social login
 *   - useEmbeddedSolanaWallet() -> the auto-created Solana wallet (address + signing)
 *
 * NOTE: Privy ships native modules, so this only runs in a DEV BUILD
 * (`npx expo run:ios`), NOT in Expo Go.
 */

export type AuthMethod = 'google' | 'apple';

export type AuthUser = {
  id: string;
  email: string;
  method: AuthMethod;
  /** embedded Solana wallet address (Privy provisions it on first login) */
  walletAddress: string;
};

type AuthState = {
  user: AuthUser | null;
  ready: boolean; // Privy secure context loaded (safe to read auth + wallet)
  loggingIn: boolean; // a login() call is in flight
  login: (method: AuthMethod) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: privyUser, isReady, logout: privyLogout } = usePrivy();
  const { login: oauthLogin } = useLoginWithOAuth();
  const solana = useEmbeddedSolanaWallet();
  const [loggingIn, setLoggingIn] = useState(false);

  // Adapt Privy's user + wallet into our AuthUser shape.
  const walletAddress = solana?.wallets?.[0]?.address ?? '';
  const accounts = privyUser?.linked_accounts ?? [];
  const google = accounts.find((a) => a.type === 'google_oauth');
  const apple = accounts.find((a) => a.type === 'apple_oauth');
  const oauth = (google ?? apple) as { email?: string } | undefined;
  const user: AuthUser | null = privyUser
    ? {
        id: privyUser.id,
        email: oauth?.email ?? '',
        method: google ? 'google' : 'apple',
        walletAddress,
      }
    : null;

  const login = useCallback(
    async (method: AuthMethod) => {
      setLoggingIn(true);
      try {
        // Opens the Google/Apple OAuth flow in a web browser, then returns.
        await oauthLogin({ provider: method });
      } finally {
        setLoggingIn(false);
      }
    },
    [oauthLogin],
  );

  const logout = useCallback(async () => {
    await privyLogout();
  }, [privyLogout]);

  return (
    <AuthContext.Provider value={{ user, ready: isReady, loggingIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** The hook every screen uses. Throws if used outside <AuthProvider>. */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used inside <AuthProvider>');
  return ctx;
}
