# AfriDict — Claude Instructions

This file is loaded automatically every time Claude works in this project.
**Before suggesting any feature as "not built yet", check the lists below first.**

---

## Project Overview

AfriDict is a full-stack decentralized prediction market platform for African users.

**Stack:**
- Frontend: React TypeScript + Chakra UI + Firebase auth (`frontend/`)
- Backend: Node.js + Express + Socket.io + MongoDB (`backend/`)
- Contracts: Solidity 0.8.20 on Polygon / Hardhat (`contracts/`)

**GitHub:** `web3vee/afridict` (branch: master)

---

## Hard Rules — Never Break These

1. **No toasts anywhere** — all feedback is inline. Zero `useToast` calls.
2. **Dark/light toggle ONLY in public Navbar profile dropdown** — intentional, user confirmed. Do NOT add toggles elsewhere.
3. **Admin dashboard is ALWAYS dark** — `useAdminColors.ts` is hardcoded dark, no colorMode hook. AdminLayout has no toggle.
4. **No AuthProvider component** — auth state lives in AppContext. `useAuth.tsx` is a thin Firebase wrapper.
5. **Firebase project ID is `afripredict`** — do not confuse with folder name `afridict`.
6. **localStorage keys**: `afridict_balance`, `afridict_pending`, `afridict_bookmarks` (renamed from `afripredict_*`).
7. **Min bet is $0.50** — enforced in MarketDetailModal.
8. **Update this file** whenever a new page, component, hook, or significant feature is added.

---

## All Pages

### Public
| File | Description |
|------|-------------|
| `pages/Landing.tsx` | Home page — markets grid (Trending/Breaking/New), sort bar, interactive category cards with filter |
| `pages/LeaderboardPage.tsx` | Top predictors ranked by accuracy + profit |
| `pages/Portfolio.tsx` | User positions, trade history, balance card, notifications, bookmarks |
| `pages/ProfilePage.tsx` | User stats, achievements/badges, prediction history |
| `pages/Bookmarks.tsx` | Saved/bookmarked markets |
| `pages/Settings.tsx` | Profile / Account / Trading / Notifications / API Keys / Builder Codes / Private Key tabs |
| `pages/CategoryPage.tsx` | Markets filtered by category, with chart + order book |
| `pages/CountriesPage.tsx` | 30+ African countries with SVG flag stripes + keyword filter |
| `pages/CountryDetailPage.tsx` | Markets for a specific country |
| `pages/MentionsPage.tsx` | Market mentions feed |
| `pages/MentionDetailPage.tsx` | Detail view for a single mention |
| `pages/MarketDetail.tsx` | Full market detail page |
| `pages/Dashboard.tsx` | User dashboard with KYC status, i18n support |
| `pages/Deposit.tsx` | Deposit page |
| `pages/PaymentCallback.tsx` | Flutterwave payment callback handler |
| `pages/Login.tsx` | Firebase email + Google login, inline errors |
| `pages/Register.tsx` | Firebase registration, inline errors |

### Admin
| File | Description |
|------|-------------|
| `pages/Admin.tsx` | Admin entry point |
| `pages/admin/OverviewPage.tsx` | Admin overview stats |
| `pages/admin/MarketsPage.tsx` | Approve / reject / resolve markets |
| `pages/admin/UsersPage.tsx` | User management (AdminUsers component) |
| `pages/admin/TransactionsPage.tsx` | Transaction log (AdminTransactions component) |

---

## All Components

### Admin
- `components/admin/AdminDashboard.tsx` — admin router/shell
- `components/admin/AdminMarkets.tsx` — approve/reject/resolve with confirmation modal
- `components/admin/AdminAnalytics.tsx` — live stats + charts from AppContext
- `components/admin/AdminOverview.tsx` — overview stats
- `components/admin/AdminModeration.tsx` — moderation tools
- `components/admin/AdminUsers.tsx` — user list, search, ban
- `components/admin/AdminTransactions.tsx` — transaction log
- `components/admin/AdminSettings.tsx` — platform fee, min bet, auto-resolve, maintenance
- `components/admin/Sidebar.tsx` — sidebar with pending markets red badge
- `components/admin/useAdminColors.ts` — hardcoded dark theme colors, NO colorMode hook

### Modals
- `components/modals/MarketDetailModal.tsx` — full trading modal (chart + order book + trading panel)
- `components/modals/CreateMarketModal.tsx` — user market submission
- `components/modals/QuickBetModal.tsx` — quick bet
- `components/modals/SearchModal.tsx` — search
- `components/modals/EmbedModal.tsx` — embed a market

### Wallet
- `components/wallet/DepositModal.tsx` — Flutterwave / cNGN / ZARP / Crypto
- `components/wallet/WithdrawModal.tsx` — withdrawal

### Portfolio
- `components/portfolio/BalanceCard.tsx`
- `components/portfolio/PositionsTable.tsx`
- `components/portfolio/TradeHistory.tsx`

### Market
- `components/market/MarketCard.tsx`
- `components/market/DetailedMarketCard.tsx`

### Mentions
- `components/mentions/MentionChart.tsx`
- `components/mentions/OrderBook.tsx`

### Settings
- `components/settings/ProfileSettings.tsx`
- `components/settings/AccountSettings.tsx`
- `components/settings/NotificationSettings.tsx`

### Landing
- `components/landing/HeroSection.tsx`
- `components/landing/FaqSection.tsx`
- `components/landing/HowItWorksPopup.tsx`

### Common / Shared
- `components/common/Navbar.tsx`
- `components/common/Footer.tsx`
- `components/common/LoadingSpinner.tsx`
- `components/shared/AppChart.tsx`
- `components/ProtectedRoute.tsx`
- `components/AdminRoute.tsx`

---

## All Hooks

- `hooks/useAuth.tsx` — thin Firebase wrapper over AppContext; no AuthProvider needed
- `hooks/useBookmarks.ts` — localStorage key: `afridict_bookmarks`
- `hooks/useWeb3.tsx` — web3 / wallet connection

---

## Key Files

| File | Notes |
|------|-------|
| `context/AppContext.tsx` | Global state: markets, cashBalance, pendingMarkets, modals, firebaseUser, authLoading |
| `App.tsx` | React Router + providers; has `/login` and `/register` routes |
| `data/staticData.ts` | MARKETS (50 markets), LANGUAGES, MY_POSITIONS_INITIAL |
| `data/admins.ts` | Admin email/address whitelist |
| `index.tsx` | ChakraProvider with localStorageManager for color mode persistence |
| `theme.ts` | Chakra theme, initialColorMode: dark |
| `firebase.ts` | Firebase config (project ID: `afripredict`) |
| `services/api.ts` | Axios — async interceptor attaches Firebase ID token to every request |
| `layouts/AdminLayout.tsx` | Admin shell — NO dark/light toggle |
| `layouts/MainLayout.tsx` | Public shell (Navbar + Footer) |
| `i18n/I18nProvider.tsx` | i18n provider |
| `backend/firebaseAdmin.js` | Firebase Admin SDK init (reads FIREBASE_* env vars; dev fallback if missing) |
| `backend/middleware/auth.js` | Verifies Firebase ID tokens; auto-creates MongoDB user on first login |
| `backend/models/User.js` | Has `firebaseUid` field (sparse, unique, indexed) |
| `backend/.env` | Needs FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY from service account JSON |

---

## Feature Details

### Auth
- Firebase only — email/password + Google
- `useAuth.tsx` wraps `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `updateProfile`
- State lives in AppContext (`firebaseUser`, `cashBalance`, `authLoading`)
- `services/api.ts` async interceptor: `auth.currentUser.getIdToken()` → `Authorization: Bearer <token>`
- Backend: `firebase-admin` verifies tokens in prod; dev fallback decodes JWT without signature check
- Backend auto-creates MongoDB user on first Firebase login using `firebaseUid` linkage
- Login gate: `openBetYes`/`openBetNo` check `isLoggedIn` before opening MarketDetailModal
- `isAdminUser` checked against `data/admins.ts` whitelist

### Markets
- 50 markets in `data/staticData.ts`
- Live state in AppContext; `addMarket` adds approved markets instantly
- `pendingMarkets` in localStorage (`afridict_pending`) + cross-tab sync
- **Trending** = sort by pool desc
- **Breaking** = yesOdds or noOdds > 2.3, sorted by highest odds
- **New** = sort by id desc
- **Sort bar**: Popular | Newest | Best Odds (pill buttons above grid)
- **Category filter**: clicking category card on Landing filters grid; `categoryFilter` state takes priority over `activeCategory`
- Shareable market URLs: `?market=ID`

### MarketDetailModal
- Two-column layout (chart left, trading panel right) — stacks on mobile
- Tabs: Graph | Order Book | Resolution
- Trading panel: Buy/Sell, Market/Limit, YES/NO, +$1/$5/$10/$100 quick amounts
- Bet success shown IN-PANEL (animated ring, summary, "Place Another Bet" / "Done")
- Priority gate order: Login → Deposit → Bet form
- Bottom tabs: Comments | Top Holders | Positions | Activity
- Comments: amber warning "Do not click external links", login gate on input
- Top Holders/Positions/Activity: deterministic seeded data per market (Math.sin)

### Wallet
- `cashBalance` in localStorage (`afridict_balance`)
- DepositModal: Flutterwave / cNGN (BVN) / ZARP (SA ID) / Crypto
- Empty wallet gate → "Deposit to Bet" button in MarketDetailModal

### Admin
- Always dark, no toggle anywhere in admin
- Sidebar: pending markets red badge
- Markets: approve/reject/resolve with confirmation modal
- Analytics: live data from AppContext
- Settings: inline "✓ Saved" feedback

### Landing Categories ("Every Corner of Africa")
- Category cards are clickable — filter market grid on click
- Dynamic counts via `useMemo` over live markets array
- Hover: scale + shadow + fade-in "Browse All →"
- Active: colored border via `--cat-color` CSS variable
- Reset Filters banner shown above grid when filter active
- Smooth scroll to `#all-markets` on click

---

## Routes (App.tsx)

```
/                → Landing
/login           → Login
/register        → Register
/leaderboard     → LeaderboardPage
/portfolio       → Portfolio (protected)
/profile         → ProfilePage (protected)
/bookmarks       → Bookmarks (protected)
/settings        → Settings (protected)
/dashboard       → Dashboard (protected)
/deposit         → Deposit (protected)
/payment/callback → PaymentCallback
/category/:name  → CategoryPage
/countries       → CountriesPage
/countries/:code → CountryDetailPage
/mentions        → MentionsPage
/mentions/:id    → MentionDetailPage
/market/:id      → MarketDetail
/admin/*         → AdminDashboard (admin only)
```

---

---

## Backend API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/markets` | Public | List markets (`?status=active&limit=200`) |
| GET | `/api/markets/:id` | Public | Single market by numeric id |
| POST | `/api/markets` | User | Submit market for review (status: pending) |
| GET | `/api/markets/pending` | Admin | List pending markets |
| PATCH | `/api/markets/:id/approve` | Admin | Approve pending market |
| PATCH | `/api/markets/:id/reject` | Admin | Reject pending market |
| PATCH | `/api/markets/:id/resolve` | Admin | Resolve market, pay out winners |
| POST | `/api/bets` | User | Place a bet (deducts balance, updates pool) |
| GET | `/api/bets/my` | User | User's bet history |
| GET | `/api/bets/market/:marketId` | Public | All bets for a market |
| GET | `/api/auth/me` | User | Get current user (incl. balance.usdt) |
| POST | `/api/payments/flutterwave/initiate` | User+KYC | Start Flutterwave payment |
| POST | `/api/payments/flutterwave/verify` | Public | Verify Flutterwave payment |
| POST | `/api/payments/cngn/initiate` | User | Start cNGN mint |
| POST | `/api/payments/withdraw` | User+KYC | Request withdrawal |

## Backend Models

- `models/Market.js` — fields: `id`, `title`, `category`, `yesOdds`, `noOdds`, `pool`, `yesPool`, `noPool`, `status`, `outcome`, `region`, `endTime`, `featured`, `views`, `creator`, `resolvedBy`, `resolvedAt`
- `models/Bet.js` — fields: `user`, `market`, `marketId`, `marketTitle`, `side`, `amount`, `odds`, `potentialWin`, `status`, `settledAt`
- `models/User.js` — fields: `firebaseUid`, `email`, `username`, `walletAddress`, `country`, `currency`, `kyc`, `balance.usdt`, `totalBets`, `totalWinnings`, `role`, `referralCode`

## Seeding

Run once after MongoDB is set up:
```
cd backend && npm run seed
```

## AppContext API integration

- Markets: fetched from `GET /api/markets?limit=200` on mount; falls back to staticData if backend is offline
- Balance: fetched from `GET /api/auth/me` on Firebase login; falls back to localStorage if backend is offline

*Update this file whenever a new page, component, hook, or major feature is added.*
