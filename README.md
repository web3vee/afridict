# 🌍 AfriPredict — African Prediction Market Platform

Africa's first decentralized prediction market built on Polygon. Predict elections, sports, commodity prices, and economic events with USDT. Fund via Flutterwave or Paystack in NGN, KES, ZAR, or GHS.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                     AFRIPREDICT                        │
│                                                        │
│  React Frontend (Vercel/IPFS)                         │
│     ├── Chakra UI (mobile-first, dark theme)          │
│     ├── ethers.js (MetaMask / WalletConnect)          │
│     ├── React Query (data fetching + caching)         │
│     ├── Socket.io client (real-time odds)             │
│     └── i18n (English, French, Swahili)               │
│                                                        │
│  Node.js Backend (Express + Socket.io)                │
│     ├── JWT Auth + KYC hooks                          │
│     ├── MongoDB (user profiles, market metadata)      │
│     ├── Flutterwave + Paystack fiat gateways          │
│     └── Blockchain event listener (ethers.js)         │
│                                                        │
│  Smart Contracts (Solidity on Polygon)                │
│     ├── PredictionMarket.sol                          │
│     │     ├── createMarket()                          │
│     │     ├── placeBet() — KYC gated                  │
│     │     ├── resolveMarket() / resolveWithOracle()   │
│     │     ├── claimWinnings() — reentrancy safe       │
│     │     └── 2% platform fee                        │
│     ├── MockUSDT.sol (testnet faucet)                 │
│     └── MockOracle.sol (simulates Chainlink)          │
│                                                        │
│  Oracles: Chainlink AggregatorV3 (Polygon)            │
│  Token: USDT (0xc2132D...8E8F on Polygon mainnet)     │
└────────────────────────────────────────────────────────┘

Data Flow:
1. User registers (email/password) → KYC submitted → approved
2. User deposits NGN via Paystack → API verifies → USDT credited
3. User connects MetaMask → browses markets on Home page
4. User bets YES/NO → approves USDT → contract escrows funds
5. Event resolves → Chainlink oracle or admin calls resolveMarket()
6. Winners call claimWinnings() → USDT paid out minus 2% fee
7. Real-time odds update via Socket.io to all connected clients
```

---

## Project Structure

```
afripredict/
├── contracts/                  # Solidity smart contracts
│   ├── PredictionMarket.sol    # Main contract
│   ├── MockUSDT.sol            # Test USDT token
│   └── MockOracle.sol          # Test Chainlink oracle
├── scripts/
│   └── deploy.js               # Deployment script
├── tests/
│   └── PredictionMarket.test.js # Hardhat tests
├── hardhat.config.js
├── package.json
│
├── backend/                    # Node.js API
│   ├── server.js               # Express + Socket.io
│   ├── models/
│   │   ├── User.js             # MongoDB user schema
│   │   └── Market.js           # MongoDB market schema
│   ├── routes/
│   │   ├── auth.js             # Register, login, KYC
│   │   ├── markets.js          # Market listing, comments
│   │   ├── users.js            # User profiles
│   │   └── payments.js         # Flutterwave + Paystack
│   ├── middleware/
│   │   └── auth.js             # JWT protect, roles
│   ├── services/
│   │   └── blockchain.js       # Contract event listener
│   └── contracts/              # ABIs + addresses (auto-generated)
│
└── frontend/                   # React TypeScript app
    └── src/
        ├── App.tsx             # Router + providers
        ├── pages/
        │   ├── Home.tsx        # Market browser
        │   ├── MarketDetail.tsx # Bet placement + real-time
        │   ├── Dashboard.tsx   # User portfolio
        │   ├── Register.tsx
        │   ├── Login.tsx
        │   ├── Deposit.tsx     # Fiat on-ramp
        │   └── Admin.tsx       # Admin panel
        ├── components/
        │   ├── common/Navbar.tsx
        │   ├── common/Footer.tsx
        │   └── market/MarketCard.tsx
        ├── hooks/
        │   ├── useWeb3.tsx     # MetaMask integration
        │   └── useAuth.tsx     # Auth state
        ├── services/api.ts     # Axios client
        ├── i18n/I18nProvider.tsx # EN/FR/SW
        └── contracts/          # ABIs + addresses (auto-generated)
```

---

## Quick Start — Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)
- MetaMask browser extension

### Step 1: Install contract dependencies

```bash
cd afripredict
npm install
```

### Step 2: Set up environment

```bash
cp .env.example .env
# Edit .env — no changes needed for local testing
```

### Step 3: Start local Hardhat node

```bash
npm run node
# Outputs 20 funded test accounts — copy one private key
```

### Step 4: Deploy contracts (new terminal)

```bash
npm run deploy:local
# Creates frontend/src/contracts/addresses.json
# Creates backend/contracts/addresses.json
```

Copy contract ABIs:
```bash
cp artifacts/contracts/PredictionMarket.sol/PredictionMarket.json frontend/src/contracts/
cp artifacts/contracts/PredictionMarket.sol/PredictionMarket.json backend/contracts/
```

### Step 5: Start backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI if different
npm run dev
# API running at http://localhost:5000
```

### Step 6: Start frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
# App running at http://localhost:3000
```

### Step 7: Configure MetaMask

1. Open MetaMask → Add Network → Localhost 8545
   - Chain ID: 31337
   - Currency: ETH
2. Import a Hardhat test account (private key from `npm run node` output)
3. Add MockUSDT token (address from `addresses.json`)
4. Use the faucet: call `usdt.faucet(1000000000)` for 1000 USDT

---

## Running Tests

```bash
# Smart contract tests
npm test

# With gas report
REPORT_GAS=true npm test

# Security analysis (requires slither)
pip install slither-analyzer
npm run slither
```

---

## Deployment to Polygon Mumbai Testnet

### 1. Get test MATIC
Visit: https://faucet.polygon.technology

### 2. Configure .env
```bash
PRIVATE_KEY=your_wallet_private_key
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGONSCAN_API_KEY=your_key
```

### 3. Deploy
```bash
npm run deploy:mumbai
```

### 4. Verify contracts
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> <USDT_ADDRESS>
```

---

## Deployment to Polygon Mainnet

> **IMPORTANT**: Use real USDT address on Polygon mainnet: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
> Update `deploy.js` to skip MockUSDT deployment and use this address.

```bash
npm run deploy:polygon
```

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy `build/` folder to Vercel or Netlify
# Or: vercel --prod
```

---

## Security Features

| Feature | Implementation |
|---|---|
| Reentrancy protection | `ReentrancyGuard` on `placeBet`, `claimWinnings` |
| Access control | `Ownable` + `onlyResolver` modifier |
| KYC gating | `onlyKYC` modifier on betting |
| Integer overflow | Solidity 0.8.20 built-in checks |
| USDT approval | User must explicitly approve before bet |
| Fee extraction | Separate locked-funds accounting |
| Dispute mechanism | Market status → Disputed, blocks payouts |

### Slither Security Checklist
Run `slither contracts/` before mainnet deployment. Key things to verify:
- No unchecked external calls
- No tx.origin usage
- Proper event emission
- No integer division before multiplication

---

## Chainlink Oracle Integration (Production)

Replace `MockOracle` with real Chainlink price feeds on Polygon:

```solidity
// Example: NGN/USD price feed on Polygon
address constant NGN_USD_FEED = 0x3e65...;  // Check docs.chain.link

// For event-based markets, use Chainlink Functions or DON
// https://docs.chain.link/chainlink-functions
```

---

## Fiat On-Ramp Flow

```
User selects NGN → enters amount → clicks Flutterwave
  → redirected to Flutterwave checkout
  → pays with card/bank/USSD
  → redirected to /payment/callback?transaction_id=xxx
  → backend verifies with Flutterwave API
  → converts NGN → USDT at live rate
  → credits user.balance.usdt in MongoDB
  → user can now fund their MetaMask wallet
```

---

## Monetization

- **2% fee** on all resolved markets (taken from prize pool)
- **Premium markets**: Featured placement fee from market creators
- **Gasless relayer**: Charge small fee for meta-transactions

---

## Supported African Countries & Currencies

| Country | Currency | Payment |
|---|---|---|
| Nigeria | NGN (₦) | Paystack, Flutterwave |
| Kenya | KES (KSh) | Flutterwave (M-Pesa) |
| South Africa | ZAR (R) | Flutterwave |
| Ghana | GHS (₵) | Flutterwave |
| More coming... | | |

---

## License

MIT
