import React, { useMemo, useState, useCallback } from 'react';
import {
  Box, Heading, HStack, SimpleGrid, Text, VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import MarketCard from '../components/market/MarketCard';
import HeroSection from '../components/landing/HeroSection';
import FaqSection from '../components/landing/FaqSection';
import HowItWorksPopup from '../components/landing/HowItWorksPopup';
import { useApp } from '../context/AppContext';

interface Market {
  id: number;
  title: string;
  yesOdds: number;
  noOdds: number;
  pool: number;
  category: string;
}

interface LandingProps {
  activeCategory: string;
  howItWorksStep: number;
  onHowItWorksNext: () => void;
  onHowItWorksClose: () => void;
  onLogin: () => void;
  onBetYes: (market: Market) => void;
  onBetNo: (market: Market) => void;
  onMarketDetail: (market: Market) => void;
  onEmbed: (market: Market) => void;
}

const LEADERBOARD = [
  { badge: '🥇', name: '@web3vee',       flag: '🇳🇬', acc: '72%', pnl: '+$3,240', hi: true  },
  { badge: '🥈', name: '@kenyantrader',  flag: '🇰🇪', acc: '69%', pnl: '+$2,890', hi: false },
  { badge: '🥉', name: '@afropredictor', flag: '🇿🇦', acc: '71%', pnl: '+$2,310', hi: false },
  { badge: '4',  name: '@senegalfan',    flag: '🇸🇳', acc: '65%', pnl: '+$1,980', hi: false },
  { badge: '5',  name: '@cryptoghanam',  flag: '🇬🇭', acc: '68%', pnl: '+$1,750', hi: false },
  { badge: '6',  name: '@ethiopianews', flag: '🇪🇹', acc: '63%', pnl: '+$1,420', hi: false },
];

const COUNTRIES = [
  { flag: '🇳🇬', name: 'Nigeria',      cur: 'NGN' },
  { flag: '🇰🇪', name: 'Kenya',        cur: 'KES' },
  { flag: '🇿🇦', name: 'South Africa', cur: 'ZAR' },
  { flag: '🇬🇭', name: 'Ghana',        cur: 'GHS' },
  { flag: '🇸🇳', name: 'Senegal',      cur: 'XOF' },
  { flag: '🇪🇹', name: 'Ethiopia',     cur: 'ETB' },
  { flag: '🇨🇮', name: 'Ivory Coast',  cur: 'XOF' },
  { flag: '🇹🇿', name: 'Tanzania',     cur: 'TZS' },
  { flag: '🇺🇬', name: 'Uganda',       cur: 'UGX' },
  { flag: '🌍',  name: 'More soon',    cur: '...' },
];

const CATEGORIES_GRID = [
  { icon: '🗳️', label: 'Elections',   color: '#ffd700' },
  { icon: '⚽', label: 'Sports',      color: '#4ade80' },
  { icon: '🎵', label: 'Music',       color: '#f472b6' },
  { icon: '📦', label: 'Commodities', color: '#f97316' },
  { icon: '💹', label: 'Economy',     color: '#60a5fa' },
  { icon: '₿',  label: 'Crypto',      color: '#a78bfa' },
  { icon: '🔒', label: 'Security',    color: '#f87171' },
  { icon: '🏛️', label: 'Politics',    color: '#34d399' },
  { icon: '💻', label: 'Tech',        color: '#38bdf8' },
  { icon: '☁️', label: 'Weather',     color: '#22d3ee' },
];

const TESTIMONIALS = [
  { name: '@web3vee',       flag: '🇳🇬', pnl: '+$3,200', color: '#4ade80',
    text: 'Won 3,200 USDT on the Dangote Refinery market. Only platform that covers Nigerian economic events.' },
  { name: '@kenyantrader',  flag: '🇰🇪', pnl: '+$890',   color: '#60a5fa',
    text: 'Deposited in KES, placed a bet, and received USDT back — the whole flow took under 5 minutes.' },
  { name: '@afropredictor', flag: '🇿🇦', pnl: '+$1,540', color: '#ffd700',
    text: 'Called the ANC election result. Payout hit instantly. No withdrawal forms. No delays. This is the future.' },
  { name: '@senegalfan',    flag: '🇸🇳', pnl: '+$4,100', color: '#4ade80',
    text: 'AFCON markets are fire. Made 4x my bet. I\'ll never go back to regular sports betting apps again.' },
  { name: '@cryptoghanam',  flag: '🇬🇭', pnl: '+$2,650', color: '#f87171',
    text: 'Polygon integration is smooth. Low gas, fast finality. The embed widget works great for my Telegram channel.' },
  { name: '@naijacrypto',   flag: '🇳🇬', pnl: '+$1,920', color: '#a78bfa',
    text: 'Accuracy score of 74% this quarter. The leaderboard is addictive — it makes you research harder.' },
];

export default function Landing({
  activeCategory, howItWorksStep,
  onHowItWorksNext, onHowItWorksClose, onLogin,
  onBetYes, onBetNo, onMarketDetail, onEmbed,
}: LandingProps) {
  const { markets } = useApp();
  const pageBg       = useColorModeValue('#f8fafc',  '#070b14');
  const cardBg       = useColorModeValue('#ffffff',  '#111827');
  const borderColor  = useColorModeValue('#e2e8f0',  '#1e293b');
  const subtleBorder = useColorModeValue('#f1f5f9',  '#1e293b');
  const headingColor = useColorModeValue('#0f172a',  '#f8fafc');
  const textColor    = useColorModeValue('#1e293b',  '#e2e8f0');
  const mutedColor   = useColorModeValue('#475569',  '#94a3b8');
  const catSectionBg = useColorModeValue('gray.50',  '#07090f');
  const catCardText  = useColorModeValue('gray.800', 'white');
  const resetBg      = useColorModeValue('#fff7ed',  'rgba(255,215,0,0.08)');
  const resetBorder  = useColorModeValue('#fed7aa',  'rgba(255,215,0,0.25)');

  const [sortBy, setSortBy]             = useState<'popular' | 'newest' | 'best_odds'>('popular');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Dynamic market count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of markets) {
      if (m.category) counts[m.category] = (counts[m.category] ?? 0) + 1;
    }
    return counts;
  }, [markets]);

  const handleCategoryClick = useCallback((label: string) => {
    setCategoryFilter(prev => prev === label ? null : label);
    // Scroll smoothly up to the market grid
    setTimeout(() => {
      document.getElementById('all-markets')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, []);

  const visibleMarkets = useMemo(() => {
    let base: typeof markets;

    // Category card filter takes priority over navbar activeCategory
    if (categoryFilter) {
      base = markets.filter(m => m.category === categoryFilter);
    } else if (activeCategory === 'Trending') {
      base = [...markets].sort((a, b) => (b.pool ?? 0) - (a.pool ?? 0)).slice(0, 10);
    } else if (activeCategory === 'Breaking') {
      base = [...markets]
        .filter(m => (m.yesOdds ?? 2) > 2.3 || (m.noOdds ?? 2) > 2.3)
        .sort((a, b) => Math.max(b.yesOdds ?? 2, b.noOdds ?? 2) - Math.max(a.yesOdds ?? 2, a.noOdds ?? 2))
        .slice(0, 10);
    } else if (activeCategory === 'New') {
      base = [...markets].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 10);
    } else {
      base = markets.filter(m => m.category === activeCategory);
    }

    if (sortBy === 'newest')    return [...base].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    if (sortBy === 'best_odds') return [...base].sort((a, b) => Math.max(b.yesOdds ?? 2, b.noOdds ?? 2) - Math.max(a.yesOdds ?? 2, a.noOdds ?? 2));
    return [...base].sort((a, b) => (b.pool ?? 0) - (a.pool ?? 0));
  }, [markets, activeCategory, sortBy, categoryFilter]);

  return (
    <>
      {/* CSS */}
      <style>{`
        @keyframes lp-rise { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes lp-glow { 0%,100%{box-shadow:0 0 24px rgba(255,215,0,.15)} 50%{box-shadow:0 0 48px rgba(255,215,0,.35)} }
        @keyframes lp-pulse{ 0%,100%{opacity:1} 50%{opacity:.45} }
        .lp-r1{animation:lp-rise .6s .0s both} .lp-r2{animation:lp-rise .6s .1s both}
        .lp-r3{animation:lp-rise .6s .2s both} .lp-r4{animation:lp-rise .6s .3s both}
        .lp-card{transition:transform .2s,border-color .2s}
        .lp-card:hover{transform:translateY(-5px)}
        .lp-live{display:inline-block;width:8px;height:8px;border-radius:50%;background:#4ade80;animation:lp-pulse 1.6s infinite}
        .lp-faq-item{transition:border-color .2s}
        .lp-faq-item:hover{border-color:rgba(255,215,0,.4)!important}
        .lp-step-num{font-size:72px;font-weight:900;line-height:1;opacity:.06;position:absolute;top:-8px;right:12px;pointer-events:none}

        /* Category cards */
        .cat-card {
          transition: transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease, border-color .22s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .cat-card:hover {
          transform: translateY(-7px) scale(1.03);
          box-shadow: 0 16px 40px rgba(0,0,0,.13);
        }
        .cat-card.active {
          box-shadow: 0 0 0 2px var(--cat-color), 0 8px 24px rgba(0,0,0,.12);
        }
        .cat-browse {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity .18s ease, transform .18s ease;
          font-size: 10px;
          font-weight: 700;
          margin-top: 6px;
          display: block;
        }
        .cat-card:hover .cat-browse {
          opacity: 1;
          transform: translateY(0);
        }
        .cat-card.active .cat-browse {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ── HERO ── */}
      <HeroSection
        mutedColor={mutedColor}
        textColor={textColor}
        cardBg={cardBg}
        borderColor={borderColor}
        subtleBorder={subtleBorder}
        headingColor={headingColor}
        onLogin={onLogin}
        onBetHeroYes={() => markets[0] && onBetYes(markets[0])}
        onBetHeroNo={() => markets[0] && onBetNo(markets[0])}
      />

      {/* ── ALL MARKETS ── */}
      <Box id="all-markets" py={14} px={{ base: 4, lg: 10 }} bg={pageBg}>
        <Box maxW="1300px" mx="auto">

          {/* Active filter banner */}
          {categoryFilter && (
            <HStack mb={5} px={4} py={3} bg={resetBg} border="1px solid" borderColor={resetBorder}
              borderRadius="xl" justify="space-between" flexWrap="wrap" gap={2}>
              <HStack spacing={2}>
                <Text fontSize="sm" fontWeight="700" color={headingColor}>
                  {CATEGORIES_GRID.find(c => c.label === categoryFilter)?.icon} Showing: {categoryFilter}
                </Text>
                <Text fontSize="xs" color={mutedColor}>
                  ({visibleMarkets.length} market{visibleMarkets.length !== 1 ? 's' : ''})
                </Text>
              </HStack>
              <Box
                px={3} py={1} borderRadius="full" cursor="pointer" fontSize="xs" fontWeight="700"
                border="1px solid" borderColor={borderColor} color={mutedColor}
                _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
                transition="all .15s"
                onClick={() => setCategoryFilter(null)}
              >
                ✕ Reset Filter
              </Box>
            </HStack>
          )}

          <HStack justify="space-between" mb={8} flexWrap="wrap" gap={3} align="flex-end">
            <Box>
              <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase" mb={1}>All Markets</Text>
              <Heading fontSize="2xl" fontWeight="800" color={headingColor}>Browse &amp; Predict</Heading>
            </Box>
            <HStack spacing={1}>
              <Text fontSize="xs" color={mutedColor} fontWeight="600" mr={1}>Sort:</Text>
              {([
                { key: 'popular',   label: '🔥 Popular'   },
                { key: 'newest',    label: '✨ Newest'     },
                { key: 'best_odds', label: '📈 Best Odds'  },
              ] as const).map(opt => (
                <Box key={opt.key}
                  px={3} py={1} borderRadius="full" cursor="pointer" fontSize="xs" fontWeight="600"
                  border="1px solid"
                  borderColor={sortBy === opt.key ? '#ffd700' : borderColor}
                  color={sortBy === opt.key ? '#ffd700' : mutedColor}
                  bg={sortBy === opt.key ? 'rgba(255,215,0,0.08)' : 'transparent'}
                  _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
                  transition="all 0.15s"
                  onClick={() => setSortBy(opt.key)}
                >
                  {opt.label}
                </Box>
              ))}
            </HStack>
          </HStack>

          {visibleMarkets.length === 0 ? (
            <Box py={20} textAlign="center">
              <Text fontSize="3xl" mb={3}>🔍</Text>
              <Text fontWeight="700" color={headingColor} mb={1}>No markets in this category yet</Text>
              <Text fontSize="sm" color={mutedColor}>Check back soon — new markets are added daily.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
              {visibleMarkets.map(m => (
                <MarketCard
                  key={m.id}
                  market={{ ...m, isLive: true, endingSoon: false }}
                  onClick={() => onMarketDetail(m)}
                  onBetYes={() => onBetYes(m)}
                  onBetNo={() => onBetNo(m)}
                  onEmbed={() => onEmbed(m)}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>

      {/* ── CATEGORIES ── */}
      <Box py={20} px={{ base: 6, lg: 12 }} bg={catSectionBg}>
        <Box maxW="1100px" mx="auto">
          <VStack mb={12} spacing={2} textAlign="center">
            <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase">What You Can Bet On</Text>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="800" color={headingColor}>
              Every Corner of Africa
            </Heading>
            <Text fontSize="sm" color={mutedColor} mt={1}>Click any category to filter the markets above</Text>
          </VStack>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
            {CATEGORIES_GRID.map(c => {
              const count = categoryCounts[c.label] ?? 0;
              const isActive = categoryFilter === c.label;
              return (
                <Box
                  key={c.label}
                  className={`cat-card${isActive ? ' active' : ''}`}
                  style={{ '--cat-color': c.color } as React.CSSProperties}
                  bg={cardBg}
                  border="2px solid"
                  borderColor={isActive ? c.color : borderColor}
                  borderRadius="2xl"
                  p={5}
                  textAlign="center"
                  onClick={() => handleCategoryClick(c.label)}
                  role="button"
                  aria-pressed={isActive}
                >
                  <Text fontSize="3xl" mb={2}>{c.icon}</Text>
                  <Text fontWeight="800" fontSize="sm" color={catCardText} mb={1}>{c.label}</Text>
                  <Text fontSize="10px" color={c.color} fontWeight="700">
                    {count} market{count !== 1 ? 's' : ''}
                  </Text>
                  <Text
                    as="span"
                    className="cat-browse"
                    color={isActive ? c.color : mutedColor}
                  >
                    {isActive ? '✓ Filtered' : 'Browse All →'}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ── LEADERBOARD + COUNTRIES ── */}
      <Box py={20} px={{ base: 6, lg: 12 }} bg={catSectionBg}>
        <Box maxW="1100px" mx="auto">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>

            {/* Leaderboard */}
            <Box>
              <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase" mb={3}>Leaderboard</Text>
              <Heading fontSize="2xl" fontWeight="800" color={headingColor} mb={6}>This Week's Top Predictors</Heading>
              <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
                {LEADERBOARD.map((u, i) => (
                  <HStack key={i} px={5} py={3}
                    borderBottom="1px solid" borderColor={subtleBorder}
                    bg={u.hi ? useColorModeValue('yellow.50', 'rgba(255,215,0,.04)') : 'transparent'}
                    _hover={{ bg: useColorModeValue('gray.50', 'rgba(255,255,255,.02)') }}
                  >
                    <Text w={6} fontWeight="800" fontSize="sm"
                      color={i === 0 ? '#ffd700' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : useColorModeValue('gray.400', '#475569')}
                    >{u.badge}</Text>
                    <Text fontSize="sm">{u.flag}</Text>
                    <Text flex={1} fontSize="sm" fontWeight="600" color={useColorModeValue('gray.800', 'white')}>{u.name}</Text>
                    <Text fontSize="xs" color={useColorModeValue('gray.400', '#64748b')} mr={2}>{u.acc}</Text>
                    <Text fontSize="sm" fontWeight="700" color="#4ade80">{u.pnl}</Text>
                  </HStack>
                ))}
                <Box px={5} py={3} textAlign="center">
                  <Text fontSize="xs" color="#ffd700" fontWeight="700" cursor="pointer">View Full Leaderboard →</Text>
                </Box>
              </Box>
            </Box>

            {/* Countries */}
            <Box>
              <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase" mb={3}>Coverage</Text>
              <Heading fontSize="2xl" fontWeight="800" color={headingColor} mb={6}>Available Across Africa</Heading>
              <SimpleGrid columns={2} spacing={3}>
                {COUNTRIES.map(c => (
                  <HStack key={c.name}
                    bg={cardBg} border="1px solid" borderColor={borderColor}
                    borderRadius="xl" px={4} py={3} className="lp-card"
                  >
                    <Text fontSize="lg">{c.flag}</Text>
                    <Box>
                      <Text fontSize="xs" fontWeight="700" color={useColorModeValue('gray.800', 'white')}>{c.name}</Text>
                      <Text fontSize="10px" color={useColorModeValue('gray.400', '#64748b')}>{c.cur}</Text>
                    </Box>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* ── TESTIMONIALS ── */}
      <Box py={20} px={{ base: 6, lg: 12 }} bg={useColorModeValue('white', '#080c14')}>
        <Box maxW="1100px" mx="auto">
          <VStack mb={12} spacing={2} textAlign="center">
            <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase">Community</Text>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="800" color={headingColor}>What Predictors Say</Heading>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {TESTIMONIALS.map(t => (
              <Box key={t.name}
                bg={useColorModeValue('gray.50', '#0f1623')}
                border="1px solid" borderColor={borderColor}
                borderRadius="2xl" p={6} className="lp-card"
              >
                <Text fontSize="2xl" color={useColorModeValue('gray.200', 'rgba(255,255,255,.06)')}
                  lineHeight="1" mb={3} fontFamily="Georgia,serif"
                >"</Text>
                <Text fontSize="sm" color={mutedColor} lineHeight="1.8" mb={5}>{t.text}</Text>
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Text fontSize="lg">{t.flag}</Text>
                    <Text fontSize="sm" fontWeight="700" color={useColorModeValue('gray.800', 'white')}>{t.name}</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="800" color={t.color}>{t.pnl}</Text>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* ── FAQ ── */}
      <FaqSection headingColor={headingColor} borderColor={borderColor} />

      {/* ── HOW IT WORKS POPUP ── */}
      <HowItWorksPopup
        step={howItWorksStep}
        onNext={onHowItWorksNext}
        onClose={onHowItWorksClose}
        onLogin={() => { onHowItWorksClose(); onLogin(); }}
      />
    </>
  );
}
