import React, {
  createContext, useContext, useState, useEffect,
  useMemo, useCallback, lazy, Suspense,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useWeb3 } from '../hooks/useWeb3';
import { auth, onAuthStateChanged } from '../firebase';
import type { User } from '../firebase';
import { Box, HStack, Text } from '@chakra-ui/react';
import { LANGUAGES, MARKETS, MY_POSITIONS_INITIAL } from '../data/staticData';
import api from '../services/api';
import { isAdmin } from '../data/admins';

// Lazy-load modals so they're excluded from the initial bundle
const MarketDetailModal  = lazy(() => import('../components/modals/MarketDetailModal'));
const QuickBetModal      = lazy(() => import('../components/modals/QuickBetModal'));
const SearchModal        = lazy(() => import('../components/modals/SearchModal'));
const EmbedModal         = lazy(() => import('../components/modals/EmbedModal'));
const CreateMarketModal  = lazy(() => import('../components/modals/CreateMarketModal'));
const DepositModal       = lazy(() => import('../components/wallet/DepositModal'));
const WithdrawModal      = lazy(() => import('../components/wallet/WithdrawModal'));


export interface Language { code: string; label: string; flag: string; }

interface AppContextValue {
  isLoggedIn: boolean;
  authLoading: boolean;
  authenticated: boolean;
  displayName: string;
  displayPhoto: string | null;
  displayAddress: string | null;
  account: string | null;
  firebaseUser: User | null;
  userEmail: string | null;
  isAdminUser: boolean;
  login: () => void;
  logout: () => void;
  portfolioValue: number;
  cashBalance: number;
  setBalance: (n: number) => void;
  myPositions: typeof MY_POSITIONS_INITIAL;
  language: Language;
  setLanguage: (l: Language) => void;
  activeCategory: string;
  howItWorksStep: number;
  setHowItWorksStep: React.Dispatch<React.SetStateAction<number>>;
  onCategoryChange: (key: string, isSpecial: boolean) => void;
  openDeposit: () => void;
  openWithdraw: () => void;
  openSearch: () => void;
  openCreateMarket: () => void;
  pendingMarkets: any[];
  submitMarketForReview: (m: any) => void;
  removePendingMarket: (id: string) => void;
  openMarketDetail: (m: any) => void;
  openEmbed: (m: any) => void;
  openBetYes: (m: any) => void;
  openBetNo: (m: any) => void;
  triggerBetSplash: (side: 'yes' | 'no') => void;
  markets: any[];
  addMarket: (m: any) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { account, disconnectWallet } = useWeb3();
  const { authenticated, ready: privyReady, user: privyUser, login, logout: privyLogout } = usePrivy();
  const { wallets } = useWallets();

  const privyWallet    = wallets.find(w => w.walletClientType === 'metamask') || wallets[0] || null;
  const privyAddress   = privyWallet?.address || privyUser?.wallet?.address || null;
  const displayAddress = (account || privyAddress) ?? null;

  const [firebaseUser,  setFirebaseUser]  = useState<User | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseReady(true);
    });
    return () => unsub();
  }, []); // eslint-disable-line

  const authLoading = !privyReady || !firebaseReady;
  const isLoggedIn  = authenticated || !!account || !!firebaseUser;

  const displayName = firebaseUser?.displayName
    || (privyUser as any)?.google?.name
    || (privyUser as any)?.email?.address?.split('@')[0]
    || (displayAddress ? displayAddress.slice(0, 6) + '...' + displayAddress.slice(-4) : 'User');
  const displayPhoto = firebaseUser?.photoURL
    || (privyUser as any)?.google?.profilePictureUrl
    || null;

  const [language,       setLanguage]       = useState<Language>({ code: 'en', label: 'English', flag: '🇬🇧' });
  const [howItWorksStep, setHowItWorksStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Trending');

  const [depositOpen,      setDepositOpen]      = useState(false);
  const [withdrawOpen,     setWithdrawOpen]     = useState(false);
  const [isSearchOpen,     setIsSearchOpen]     = useState(false);
  const [isCreateMktOpen,  setIsCreateMktOpen]  = useState(false);
  const [detailMarket,   setDetailMarket]   = useState<any>(null);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [betSide,        setBetSide]        = useState<'yes' | 'no' | null>(null);
  const [embedMarket,    setEmbedMarket]    = useState<any>(null);

  const [cashBalance,  setCashBalance]  = useState<number>(() => {
    try { return parseFloat(localStorage.getItem('afridict_balance') || '0') || 0; } catch { return 0; }
  });

  // Sync balance from DB whenever the Firebase user changes (login / refresh)
  useEffect(() => {
    if (!firebaseUser) return;
    api.get('/auth/me').then(res => {
      const dbBalance = res.data?.user?.balance?.usdt;
      if (typeof dbBalance === 'number') setCashBalance(dbBalance);
    }).catch(() => { /* backend offline — localStorage balance remains */ });
  }, [firebaseUser]);
  const [myPositions, setMyPositions]   = useState<typeof MY_POSITIONS_INITIAL>([]);
  const [pendingMarkets, setPendingMarkets] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('afridict_pending') || '[]'); } catch { return []; }
  });
  const [markets, setMarkets] = useState<any[]>(MARKETS);

  // Fetch markets from API on mount; fall back to staticData if backend is down
  useEffect(() => {
    api.get('/markets?limit=200').then(res => {
      const data = res.data?.markets;
      if (Array.isArray(data) && data.length > 0) setMarkets(data);
    }).catch(() => { /* backend offline — static data remains */ });
  }, []);

  const portfolioValue = useMemo(
    () => myPositions.reduce((sum, p) => sum + p.value, 0) + cashBalance,
    [myPositions, cashBalance]
  );

  useEffect(() => {
    localStorage.setItem('afridict_pending', JSON.stringify(pendingMarkets));
  }, [pendingMarkets]);

  useEffect(() => {
    localStorage.setItem('afridict_balance', String(cashBalance));
  }, [cashBalance]);

  // Sync pendingMarkets from localStorage when another tab writes to it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'afridict_pending') {
        try { setPendingMarkets(JSON.parse(e.newValue || '[]')); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const [showBetSplash, setShowBetSplash] = useState(false);
  const [betSplashSide, setBetSplashSide] = useState<'yes' | 'no'>('yes');

  // Stable callbacks — never recreated unless deps change
  const triggerBetSplash = useCallback((side: 'yes' | 'no') => {
    setBetSplashSide(side);
    setShowBetSplash(true);
    setTimeout(() => setShowBetSplash(false), 2000);
  }, []);

  const onCategoryChange = useCallback((key: string, isSpecial: boolean) => {
    if (key === 'Mentions')  { navigate('/mentions');  return; }
    if (key === 'Countries') { navigate('/countries'); return; }
    setActiveCategory(key);
    if (isSpecial) {
      navigate('/');
      setTimeout(() => document.getElementById('all-markets')?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      navigate(`/market/${key}`);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    auth.signOut();
    disconnectWallet();
    if (authenticated) privyLogout();
  }, [authenticated, disconnectWallet, privyLogout]);

  const openDeposit      = useCallback(() => setDepositOpen(true),       []);
  const openWithdraw     = useCallback(() => setWithdrawOpen(true),      []);
  const openSearch       = useCallback(() => setIsSearchOpen(true),      []);
  const openCreateMarket = useCallback(() => setIsCreateMktOpen(true),   []);
  const submitMarketForReview = useCallback((m: any) => {
    setPendingMarkets(prev => [...prev, { ...m, id: `pending-${Date.now()}`, submittedAt: new Date().toLocaleDateString() }]);
  }, []);
  const removePendingMarket = useCallback((id: string) => {
    setPendingMarkets(prev => prev.filter(m => m.id !== id));
  }, []);
  const addMarket = useCallback((m: any) => {
    setMarkets(prev => [...prev, m]);
  }, []);
  const openMarketDetail = useCallback((m: any) => {
    setDetailMarket(m);
    const id = m?.contractId ?? m?.id;
    if (id) window.history.pushState({}, '', `?market=${id}`);
  }, []);
  const openEmbed        = useCallback((m: any) => setEmbedMarket(m),                        []);
  const openBetYes = useCallback((m: any) => {
    if (!isLoggedIn) { login(); return; }
    setDetailMarket(m);
    const id = m?.contractId ?? m?.id;
    if (id) window.history.pushState({}, '', `?market=${id}`);
  }, [isLoggedIn, login]);
  const openBetNo = useCallback((m: any) => {
    if (!isLoggedIn) { login(); return; }
    setDetailMarket(m);
    const id = m?.contractId ?? m?.id;
    if (id) window.history.pushState({}, '', `?market=${id}`);
  }, [isLoggedIn, login]);

  // Modal callbacks — stable references
  const onDetailClose   = useCallback(() => { setDetailMarket(null); window.history.replaceState({}, '', window.location.pathname); }, []);
  const onDetailEmbed   = useCallback((m: any) => setEmbedMarket(m),                                                            []);
  const onQuickClose    = useCallback(() => setSelectedMarket(null),                                                             []);
  const onQuickSuccess  = useCallback((side: 'yes' | 'no') => { triggerBetSplash(side); setSelectedMarket(null); setBetSide(null); }, [triggerBetSplash]);
  const onSearchClose   = useCallback(() => setIsSearchOpen(false),                                                              []);
  const onSearchSelect  = useCallback((m: any) => setDetailMarket(m),                                                           []);
  const onEmbedClose    = useCallback(() => setEmbedMarket(null),                                                                []);
  const onDepositClose  = useCallback(() => setDepositOpen(false),                                                               []);
  const onDepositSuccess = useCallback((usdt: number) => setCashBalance(prev => prev + usdt),                                   []);
  const onWithdrawClose  = useCallback(() => setWithdrawOpen(false),                                                             []);
  const onWithdrawSuccess = useCallback((usdt: number) => setCashBalance(prev => prev - usdt),                                  []);

  const userEmail = firebaseUser?.email
    || (privyUser as any)?.google?.email
    || (privyUser as any)?.email?.address
    || null;

  const isAdminUser = isAdmin(userEmail, displayAddress);

  // Single stable object — only recreates when actual data changes
  const value: AppContextValue = useMemo(() => ({
    isLoggedIn, authLoading, authenticated,
    displayName, displayPhoto, displayAddress, account: account ?? null, firebaseUser, userEmail, isAdminUser,
    login, logout,
    portfolioValue, cashBalance, setBalance: setCashBalance, myPositions,
    language, setLanguage,
    activeCategory, howItWorksStep, setHowItWorksStep,
    onCategoryChange,
    openDeposit, openWithdraw, openSearch, openCreateMarket,
    openMarketDetail, openEmbed, openBetYes, openBetNo,
    triggerBetSplash,
    pendingMarkets, submitMarketForReview, removePendingMarket,
    markets, addMarket,
  }), [
    isLoggedIn, authLoading, authenticated,
    displayName, displayPhoto, displayAddress, account, firebaseUser, userEmail, isAdminUser,
    login, logout,
    portfolioValue, cashBalance, setCashBalance, myPositions,
    language, activeCategory, howItWorksStep,
    onCategoryChange,
    openDeposit, openWithdraw, openSearch, openCreateMarket, openMarketDetail, openEmbed, openBetYes, openBetNo,
    triggerBetSplash,
    pendingMarkets, submitMarketForReview, removePendingMarket,
    markets, addMarket,
  ]);

  const betColor = betSplashSide === 'yes' ? '#4ade80' : '#f87171';
  const betLabel = betSplashSide === 'yes' ? 'YES' : 'NO';

  return (
    <AppContext.Provider value={value}>
      {children}

      <Suspense fallback={null}>
        <MarketDetailModal
          market={detailMarket}
          onClose={onDetailClose}
          onEmbed={onDetailEmbed}
          onBetSuccess={triggerBetSplash}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={onSearchClose}
          markets={markets}
          onSelect={onSearchSelect}
        />
        <EmbedModal
          market={embedMarket}
          onClose={onEmbedClose}
        />
        <CreateMarketModal
          isOpen={isCreateMktOpen}
          onClose={() => setIsCreateMktOpen(false)}
        />
        <DepositModal
          isOpen={depositOpen}
          onClose={onDepositClose}
          depositAddress={account || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
          portfolioValue={portfolioValue}
          onSuccess={onDepositSuccess}
        />
        <WithdrawModal
          isOpen={withdrawOpen}
          onClose={onWithdrawClose}
          cashBalance={cashBalance}
          onSuccess={onWithdrawSuccess}
        />
      </Suspense>

      <style>{`
        @keyframes bet-slide-in {
          0%   { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0);     opacity: 1; }
        }
        @keyframes bet-slide-out {
          0%   { transform: translateY(0);     opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes bet-progress {
          0%   { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>

      {showBetSplash && (
        <Box position="fixed" top={5} left="50%" zIndex={9999} pointerEvents="none"
          style={{ transform: 'translateX(-50%)', animation: 'bet-slide-in 0.3s cubic-bezier(.34,1.56,.64,1) forwards' }}>
          <Box
            bg="rgba(10,14,23,0.95)" border="1px solid" borderColor={`${betColor}55`}
            borderRadius="2xl" px={5} py={3.5} minW="280px"
            backdropFilter="blur(20px)"
            boxShadow={`0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${betColor}22`}
            overflow="hidden" position="relative"
          >
            <HStack spacing={3} mb={2}>
              <Box w={7} h={7} borderRadius="full" flexShrink={0}
                bg={betSplashSide === 'yes' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}
                border={`1.5px solid ${betColor}`}
                display="flex" alignItems="center" justifyContent="center">
                <Text fontSize="10px" fontWeight="900" color={betColor}>
                  {betSplashSide === 'yes' ? '✓' : '✗'}
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="800" color="white" lineHeight="1.2">
                  Bet placed on <Text as="span" color={betColor}>{betLabel}</Text>
                </Text>
                <Text fontSize="10px" color="whiteAlpha.500" mt={0.5}>
                  Position opened · results update live
                </Text>
              </Box>
            </HStack>
            {/* Progress bar */}
            <Box position="absolute" bottom={0} left={0} h="2px" bg={betColor} borderRadius="full"
              style={{ animation: 'bet-progress 2s linear 0.1s forwards' }} />
          </Box>
        </Box>
      )}
    </AppContext.Provider>
  );
}
