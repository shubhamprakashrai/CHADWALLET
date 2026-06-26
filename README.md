# ChadWallet

A **Solana memecoin trading app** built with React Native + Expo — discover trending tokens,
track top traders, view live charts, manage a portfolio, and trade, all from one mobile wallet.

## Features

- **Trending tokens** — live Solana market data with pull-to-refresh
- **Token detail** — real price, market cap, stats, and range-aware price charts
- **Search** — find any token instantly
- **Portfolio** — holdings + net worth (real on-chain balances valued in USD)
- **Watchlist & recent searches** — persisted per user
- **Quick-buy quotes** — live best-route swap estimates
- **Auth + embedded wallet** — Google / Apple sign-in with a built-in Solana wallet

## Tech stack

| Concern | Tool |
|---|---|
| App framework | React Native + **Expo SDK 56** (expo-router) |
| Styling | **NativeWind v4** (Tailwind) |
| Data fetching / cache | **React Query** |
| Market data | **Birdeye** |
| Solana RPC (wallet/balances) | **Alchemy** |
| Prices + swaps | **Jupiter** |
| Auth + embedded wallet | **Privy** |
| Backend (watchlist, searches) | **Supabase** |

## Getting started

```bash
fnm use 22           # Node 22 LTS
npm install
cp .env.example .env  # then fill in your API keys
npx expo start        # press i (iOS) / a (Android)
```

For features that need native modules (Privy embedded wallet), build a dev client:

```bash
npm run ios           # or: npm run android
```

## Project structure

```
src/
  app/          expo-router screens (tabs, token/[id], modals)
  components/    reusable UI (TokenRow, charts, buttons…)
  hooks/         React Query hooks (useTrending, useToken, usePortfolio…)
  lib/           API clients (birdeye, alchemy, jupiter, supabase)
  auth/          auth context (useAuth)
supabase/        database schema
```

## Environment

Copy `.env.example` → `.env` and provide keys for Privy, Birdeye, Alchemy and Supabase.
All services run on their free tiers. Secrets are never committed.
