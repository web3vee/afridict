import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalBody,
  Box, Button, Badge, HStack, VStack, Input, Text, Switch, Tooltip,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  useColorModeValue, useColorMode, useBreakpointValue,
} from '@chakra-ui/react';
import AppChart from '../shared/AppChart';
const LOGO2 = '/mylogo2.png';
import OrderBook from '../mentions/OrderBook';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useApp } from '../../context/AppContext';
import { MARKETS } from '../../data/staticData';
import { Bookmark, Settings as SettingsIcon, X, Maximize2, Wallet } from 'lucide-react';

const CATEGORY_EMOJI: Record<string, string> = {
  Elections:'🗳️', Sports:'⚽', Music:'🎵', Crypto:'₿',
  Economy:'💹', Commodities:'📦', Security:'🔒',
  Politics:'🏛️', Tech:'💻', Weather:'☁️',
};

function genChartData(market: any, timeFrame: string): { time: string; value: number }[] {
  const configs: Record<string, { n: number; label: (i: number, total: number) => string }> = {
    '1H':  { n: 12, label: (i, n) => i % 3  === 0 ? `${Math.round((i/n)*60)}m`  : '' },
    '6H':  { n: 36, label: (i, n) => i % 9  === 0 ? `${Math.round((i/n)*6)}h`   : '' },
    '1D':  { n: 48, label: (i, n) => i % 8  === 0 ? `${String(Math.round((i/n)*24)).padStart(2,'0')}:00` : '' },
    '1W':  { n: 56, label: (i, n) => { const d=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; return i%8===0?(d[Math.floor((i/n)*7)]||''):''; }},
    '1M':  { n: 60, label: (i, n) => i % 15 === 0 ? `Wk${Math.max(1,Math.ceil((i/n)*4))}` : '' },
    'ALL': { n: 80, label: (i, n) => { const ms=['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']; return i%10===0?(ms[Math.floor((i/n)*ms.length)]||''):''; }},
  };
  const cfg = configs[timeFrame] || configs['1D'];
  const yp = 1 / (market?.yesOdds || 1.9);
  const np = 1 / (market?.noOdds || 1.9);
  const chance = Math.round((yp / (yp + np)) * 100);
  const seed = ((market?.id || 1) * 997 + timeFrame.charCodeAt(0)) & 0xffffff;
  const pts: { time: string; value: number }[] = [];
  let cur = Math.max(30, chance - 20);
  for (let i = 0; i <= cfg.n; i++) {
    const progress = i / cfg.n;
    const r = Math.sin(seed * 9301 + i * 49297 + 233280) * 43758.5453;
    const noise = (r - Math.floor(r) - 0.5) * (10 - progress * 5);
    cur = Math.max(5, Math.min(97, cur + (chance - cur) * 0.12 + noise));
    pts.push({ time: cfg.label(i, cfg.n), value: +cur.toFixed(1) });
  }
  pts[pts.length - 1].value = chance;
  return pts;
}

function makeOrderBook(yesOdds: number) {
  const sp = 11;
  return {
    asks: [
      { price: yesOdds + 9, shares: 20.00 },
      { price: yesOdds + 8, shares: 7.20  },
      { price: yesOdds + 1, shares: 10.00 },
      { price: yesOdds,     shares: 19.00 },
    ],
    bids: [
      { price: yesOdds - sp,     shares: 31.00 },
      { price: yesOdds - sp - 1, shares: 10.00 },
      { price: yesOdds - sp - 6, shares: 10.00 },
      { price: yesOdds - sp - 7, shares: 5.31  },
    ],
    last: yesOdds - 1,
    spread: sp,
  };
}

interface MarketDetailModalProps {
  market: any | null;
  onClose: () => void;
  onEmbed: (market: any) => void;
  onBetSuccess: (side: 'yes' | 'no') => void;
}

type Tab = 'orderbook' | 'graph' | 'resolution';

export default function MarketDetailModal({ market, onClose, onEmbed, onBetSuccess }: MarketDetailModalProps) {
  const { colorMode } = useColorMode();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { cashBalance, openDeposit, isLoggedIn, login } = useApp();

  const [tab,             setTab]             = useState<Tab>('graph');
  const [linkCopied,      setLinkCopied]      = useState(false);
  const [buySell,         setBuySell]         = useState<'buy' | 'sell'>('buy');
  const [orderType,       setOrderType]       = useState<'market' | 'limit'>('market');
  const [orderDropOpen,   setOrderDropOpen]   = useState(false);
  const [side,            setSide]            = useState<'yes' | 'no'>('yes');
  const [amount,          setAmount]          = useState('');
  const [shares,          setShares]          = useState('');
  const [limitPriceInput, setLimitPriceInput] = useState<number | null>(null);
  const [expires,         setExpires]         = useState('Never');
  const [timeFrame,       setTimeFrame]       = useState('1D');
  const [autoscale,       setAutoscale]       = useState(true);
  const [xAxis,           setXAxis]           = useState(true);
  const [yAxis,           setYAxis]           = useState(true);
  const [hGrid,           setHGrid]           = useState(true);
  const [vGrid,           setVGrid]           = useState(false);
  const [relTab,          setRelTab]          = useState('All');
  const [socialTab,       setSocialTab]       = useState<'Comments' | 'Top Holders' | 'Positions' | 'Activity'>('Comments');
  const [betPlaced,       setBetPlaced]       = useState(false);
  const [betPlacedSide,   setBetPlacedSide]   = useState<'yes' | 'no'>('yes');
  const [betPlacedAmt,    setBetPlacedAmt]    = useState(0);

  // Reset success state whenever a different market is opened
  const marketId = market?.contractId ?? market?.id;
  useEffect(() => {
    setBetPlaced(false);
    setAmount('');
    setShares('');
    setSide('yes');
    setBuySell('buy');
    setOrderType('market');
    setSocialTab('Comments');
  }, [marketId]);

  const modalBg     = useColorModeValue('white',   '#111827');
  const borderColor = useColorModeValue('#e2e8f0', '#1e293b');
  const headingClr  = useColorModeValue('#0f172a', '#f8fafc');
  const mutedClr    = useColorModeValue('#64748b', '#94a3b8');
  const inputBg     = useColorModeValue('#f1f5f9', '#1e293b');
  const rowHover    = useColorModeValue('gray.50', 'rgba(255,255,255,.04)');
  const dividerClr  = useColorModeValue('#e2e8f0', '#1f2937');
  const iconBtnClr    = useColorModeValue('#64748b', '#94a3b8');

  const isMobile   = useBreakpointValue({ base: true, lg: false });
  const bookmarked = market ? isBookmarked(market.contractId ?? market.id) : false;

  const yp = market ? 1 / (market.yesOdds || 1.9) : 0.5;
  const np = market ? 1 / (market.noOdds  || 1.9) : 0.5;
  const yesChance  = Math.round((yp / (yp + np)) * 100);
  // Raw implied probabilities as cent prices (e.g. 53 = 53¢ = 53% chance)
  const yesOddsVal = market ? Math.round((yp / (yp + np)) * 100) : 50;
  const noOddsVal  = 100 - yesOddsVal;

  // Buy prices = market price; sell prices have a small spread (bid < ask)
  const buyYesPrice    = yesOddsVal;
  const buyNoPrice     = noOddsVal;
  const sellYesPrice   = Math.max(1, yesOddsVal - 2);
  const sellNoPrice    = Math.max(1, noOddsVal  - 2);
  const yesDisplayPrice = buySell === 'buy' ? buyYesPrice  : sellYesPrice;
  const noDisplayPrice  = buySell === 'buy' ? buyNoPrice   : sellNoPrice;
  const activeSidePrice = side === 'yes' ? yesDisplayPrice : noDisplayPrice;
  const activeLimitPrice = limitPriceInput ?? activeSidePrice;
  // Format cents: "53¢" for round numbers, "0.5¢" for decimals
  const fmtPrice = (c: number) => Number.isInteger(c) ? `${c}¢` : `${c.toFixed(1)}¢`;

  // ── Buy Market ──
  const amountNum        = Number(amount) || 0;
  const sharesFromAmount = activeSidePrice > 0 ? amountNum / (activeSidePrice / 100) : 0;
  const totalPayout      = sharesFromAmount;                                       // $1 per share on win
  const pctReturn        = amountNum > 0 ? ((totalPayout / amountNum - 1) * 100) : 0;

  // ── Limit & Sell ──
  const sharesNum    = Number(shares) || 0;
  const limitTotal   = sharesNum * (activeLimitPrice / 100);                       // $ cost to buy
  const limitToWin   = sharesNum * ((100 - activeLimitPrice) / 100);               // profit if wins
  const limitReceive = sharesNum * (activeLimitPrice / 100);                       // $ received on sell

  const chartData  = useMemo(() => market ? genChartData(market, timeFrame) : [], [market, timeFrame]);
  const vals       = chartData.map(d => d.value);
  const yMin       = (vals.length && autoscale) ? Math.max(0,   Math.floor(Math.min(...vals) / 5) * 5) : 0;
  const yMax       = (vals.length && autoscale) ? Math.min(100, Math.ceil( Math.max(...vals) / 5) * 5) : 100;
  const ob         = market ? makeOrderBook(yesOddsVal) : { asks: [], bids: [], last: 0, spread: 0 };

  const related = useMemo(() =>
    MARKETS.filter(m => m.category === market?.category && m.id !== market?.id).slice(0, 4),
  [market]);

  // ── Seeded pseudo-random helpers (deterministic per market) ──
  const seed = (market?.id ?? 1) * 9301 + 49297;
  const rnd  = (n: number) => (Math.abs(Math.sin(seed * n + n * 233280)) % 1);

  const NAMES = ['@kingsleybtc','@afropredictor','@naijabets','@web3vee','@cryptosafarix','@zerobull_ng','@afri_whale','@predikt_ng','@lagoshodler','@bushbull254'];
  const TIMES = ['1m ago','3m ago','11m ago','25m ago','44m ago','1h ago','2h ago','3h ago','5h ago','8h ago'];

  const pool   = market?.pool ?? 5000;
  const yPct   = yesOddsVal / 100;
  const nPct   = noOddsVal  / 100;

  const socialData = useMemo(() => {
    if (!market) return { holders: [], positions: [], activity: [] };

    const holders = NAMES.slice(0, 6).map((name, i) => {
      const isYes   = rnd(i + 11) > 0.4;
      const rawShrs = Math.round((rnd(i + 7) * 0.6 + (0.6 - i * 0.08)) * (pool / 3));
      const shares  = Math.max(50, rawShrs);
      const price   = isYes ? yPct : nPct;
      return { rank: i + 1, user: name, side: isYes ? 'YES' : 'NO', shares, value: Math.round(shares * price) };
    }).sort((a, b) => b.shares - a.shares).map((h, i) => ({ ...h, rank: i + 1 }));

    const positions = NAMES.map((name, i) => {
      const isYes = rnd(i + 31) > 0.38;
      const shrs  = Math.max(50, Math.round(rnd(i + 13) * (pool / 4)));
      const jitter = (rnd(i + 17) - 0.5) * 8;
      const avg   = isYes
        ? `${Math.min(99, Math.max(1, Math.round(yesOddsVal + jitter)))}¢`
        : `${Math.min(99, Math.max(1, Math.round(noOddsVal  + jitter)))}¢`;
      return { user: name, side: isYes ? 'YES' : 'NO', shares: shrs, avg };
    });

    const activity = NAMES.slice(0, 8).map((name, i) => {
      const isYes   = rnd(i + 51) > 0.4;
      const isBuy   = rnd(i + 61) > 0.25;
      const shrs    = Math.max(10, Math.round(rnd(i + 23) * 400));
      return { user: name, action: isBuy ? 'bought' : 'sold', side: isYes ? 'YES' : 'NO', shares: shrs, time: TIMES[i] };
    });

    return { holders, positions, activity };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market?.id, yesOddsVal, noOddsVal, pool]);

  const relTabs = ['All', market?.category, 'Mentions'].filter(Boolean) as string[];

  const placeBet = () => {
    if (buySell === 'buy' && orderType === 'market' && amountNum < 0.5) return;
    if ((buySell === 'sell' || orderType === 'limit') && sharesNum <= 0) return;
    setBetPlacedSide(side);
    setBetPlacedAmt(amountNum);
    setBetPlaced(true);
    onBetSuccess(side);
    setAmount('');
    setShares('');
  };

  if (!market) return null;

  const emoji = CATEGORY_EMOJI[market.category] ?? '📊';

  return (
    <Modal isOpen={!!market} onClose={onClose} size={isMobile ? 'full' : '6xl'}>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg={modalBg} borderRadius={isMobile ? '0' : '2xl'} overflow="hidden" maxH="95vh" my={isMobile ? 0 : 4}>
        <ModalBody p={0} overflowY="auto">
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="start" minH={isMobile ? 'auto' : '600px'}>

            {/* ─── LEFT CONTENT ─── */}
            <Box flex={1} minW={0} display="flex" flexDirection="column">

              {/* Top header bar */}
              <Box px={6} py={4} borderBottom="1px solid" borderColor={borderColor}>
                {/* Breadcrumb */}
                <HStack spacing={1.5} mb={2} fontSize="xs" color={mutedClr}>
                  <Text cursor="pointer" _hover={{ color: '#ffd700' }}>Markets</Text>
                  <Text>›</Text>
                  <Text cursor="pointer" _hover={{ color: '#ffd700' }}>{market.category}</Text>
                </HStack>

                {/* Title row */}
                <HStack align="start" spacing={3} flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                  <Box w={10} h={10} borderRadius="lg" bg={inputBg} flexShrink={0}
                    display="flex" alignItems="center" justifyContent="center" fontSize="1.3rem">
                    {emoji}
                  </Box>
                  <Box flex={1} minW={0}>
                    <Text fontSize="lg" fontWeight="800" color={headingClr} lineHeight="1.3" noOfLines={2}>
                      {market.title}
                    </Text>
                    <HStack mt={1} spacing={3}>
                      <Badge colorScheme="yellow" fontSize="9px">✦ NEW</Badge>
                      <Text fontSize="xs" color={mutedClr}>📅 May 3, 2026</Text>
                      <Text fontSize="xs" color={mutedClr}>· ${(market.pool / 1000).toFixed(1)}K Vol.</Text>
                    </HStack>
                  </Box>

                  {/* Action icons + Afridict branding */}
                  <HStack spacing={3} flexShrink={0} align="center">
                    <HStack spacing={1.5} opacity={0.6}>
                      <img src={LOGO2} alt="Afridict"
                        style={{
                          width: 18, height: 18, objectFit: 'contain',
                          filter: colorMode === 'dark' ? 'invert(1)' : undefined,
                        }} />
                      <Text fontSize="xs" fontWeight="800" color={headingClr}>Afridict</Text>
                    </HStack>

                    {/* Embed </> */}
                    <Tooltip label="Embed" hasArrow openDelay={400}>
                      <Box as="button" onClick={() => onEmbed(market)} cursor="pointer"
                        color={iconBtnClr} bg="transparent" border="none" p={0}
                        display="flex" alignItems="center" justifyContent="center"
                        _hover={{ color: headingClr }} transition="color .15s"
                        style={{ outline: 'none' }}>
                        <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="5,4 1,8 5,12" />
                          <polyline points="11,4 15,8 11,12" />
                        </svg>
                      </Box>
                    </Tooltip>

                    {/* Copy link */}
                    <Tooltip label={linkCopied ? 'Copied!' : 'Copy link'} hasArrow openDelay={400}>
                      <Box as="button" cursor="pointer"
                        color={linkCopied ? '#4ade80' : iconBtnClr} bg="transparent" border="none" p={0}
                        display="flex" alignItems="center" justifyContent="center"
                        transition="color .15s"
                        style={{ outline: 'none' }}
                        onClick={() => {
                          const id = market.contractId ?? market.id;
                          navigator.clipboard.writeText(`${window.location.origin}/?market=${id}`)
                            .then(() => {
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 1500);
                            });
                        }}>
                        {linkCopied ? (
                          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2,8 6,12 14,4" />
                          </svg>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6.5 9.5a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95l-1 1" />
                            <path d="M9.5 6.5a3.5 3.5 0 0 0-4.95 0l-2 2a3.5 3.5 0 0 0 4.95 4.95l1-1" />
                          </svg>
                        )}
                      </Box>
                    </Tooltip>

                    {/* Bookmark */}
                    <Tooltip label={bookmarked ? 'Remove bookmark' : 'Bookmark'} hasArrow openDelay={400}>
                      <Box as="button" cursor="pointer" bg="transparent" border="none" p={0}
                        display="flex" alignItems="center" justifyContent="center"
                        color={bookmarked ? '#ffd700' : iconBtnClr}
                        _hover={{ color: bookmarked ? '#ffd700' : headingClr }} transition="color .15s"
                        style={{ outline: 'none' }}
                        onClick={() => toggleBookmark(market)}>
                        <Bookmark size={16} strokeWidth={2} fill={bookmarked ? 'currentColor' : 'none'} />
                      </Box>
                    </Tooltip>

                    <Box as="button" onClick={onClose} cursor="pointer" bg="transparent" border="none"
                      color={mutedClr} _hover={{ color: headingClr }} transition="color .15s"
                      display="flex" alignItems="center" justifyContent="center" p={0}
                      style={{ outline: 'none' }}>
                      <X size={17} strokeWidth={2} />
                    </Box>
                  </HStack>
                </HStack>
              </Box>

              {/* Market outcome row */}
              <Box px={6} py={3} borderBottom="1px solid" borderColor={borderColor}>
                <HStack spacing={4} flexWrap="wrap" gap={2}>
                  <HStack spacing={2} flex={1} minW={0}>
                    <Box w={8} h={8} borderRadius="md" bg={inputBg} flexShrink={0}
                      display="flex" alignItems="center" justifyContent="center" fontSize="1rem">
                      {emoji}
                    </Box>
                    <Text fontSize="sm" fontWeight="700" color={headingClr} noOfLines={1} flex={1}>
                      {market.title}
                    </Text>
                  </HStack>
                  <HStack spacing={2} flexShrink={0}>
                    <Text fontSize="xl" fontWeight="900" color="#22c55e">{yesChance}%</Text>
                    <Text fontSize="xs" fontWeight="700" color="#4ade80">▲{Math.abs(yesChance - 50)}</Text>
                  </HStack>
                  <HStack spacing={2} flexShrink={0}>
                    <Button size="sm" borderRadius="lg" fontWeight="800"
                      bg="#dcfce7" color="#16a34a" border="1px solid" borderColor="#4ade8055"
                      _hover={{ bg: '#4ade80', color: 'white' }} transition="all .15s"
                      onClick={() => setSide('yes')}>
                      Buy Yes {yesOddsVal}¢
                    </Button>
                    <Button size="sm" borderRadius="lg" fontWeight="800"
                      bg="#fee2e2" color="#dc2626" border="1px solid" borderColor="#f8717155"
                      _hover={{ bg: '#f87171', color: 'white' }} transition="all .15s"
                      onClick={() => setSide('no')}>
                      Buy No {noOddsVal}¢
                    </Button>
                  </HStack>
                </HStack>
              </Box>

              {/* Tabs */}
              <HStack px={6} spacing={0} borderBottom="1px solid" borderColor={borderColor}>
                {([
                  { key: 'graph',      label: 'Graph'      },
                  { key: 'orderbook',  label: 'Order Book' },
                  { key: 'resolution', label: 'Resolution' },
                ] as { key: Tab; label: string }[]).map(t => (
                  <Box key={t.key} px={4} py={3} cursor="pointer"
                    borderBottom="2px solid"
                    borderColor={tab === t.key ? headingClr : 'transparent'}
                    onClick={() => setTab(t.key)}>
                    <Text fontSize="sm" fontWeight={tab === t.key ? '700' : '500'}
                      color={tab === t.key ? headingClr : mutedClr}>{t.label}</Text>
                  </Box>
                ))}
              </HStack>

              {/* Tab content */}
              <Box flex={1}>
                {/* ── Order Book ── */}
                {tab === 'orderbook' && (
                  <Box>
                    <HStack px={6} py={2} borderBottom="1px solid" borderColor={borderColor}>
                      <Text fontSize="xs" fontWeight="700" color={mutedClr} textTransform="uppercase" letterSpacing="wider">
                        TRADE YES ⇅
                      </Text>
                    </HStack>
                    <OrderBook asks={ob.asks} bids={ob.bids} last={ob.last} spread={ob.spread} />
                  </Box>
                )}

                {/* ── Graph ── */}
                {tab === 'graph' && (
                  <Box px={6} pt={5} pb={3}>
                    {/* Heading row — "76% chance ▲26%"  +  Afridict branding */}
                    {(() => {
                      const first = chartData[0]?.value ?? yesChance;
                      const last  = chartData[chartData.length - 1]?.value ?? yesChance;
                      const diff  = +(last - first).toFixed(1);
                      const up    = diff >= 0;
                      return (
                        <HStack mb={1} justify="space-between" align="center">
                          <HStack spacing={2} align="baseline">
                            <Text fontSize="2xl" fontWeight="900" color="#3b82f6" lineHeight="1">
                              {yesChance}% chance
                            </Text>
                            <Text fontSize="sm" fontWeight="700" color={up ? '#22c55e' : '#ef4444'}>
                              {up ? '▲' : '▼'}{Math.abs(diff)}
                            </Text>
                          </HStack>

                          {/* Afridict watermark */}
                          <HStack spacing={2} opacity={0.75}>
                            <img src={LOGO2} alt="Afridict"
                              style={{
                                width: 24, height: 24, objectFit: 'contain',
                                filter: colorMode === 'dark' ? 'invert(1)' : undefined,
                              }} />
                            <Text fontSize="14px" fontWeight="800" color={mutedClr} letterSpacing="0.02em">
                              Afridict
                            </Text>
                          </HStack>
                        </HStack>
                      );
                    })()}

                    {/* Chart — open, no box */}
                    <Box h="280px" mt={3}>
                      <AppChart
                        data={chartData} color="#3b82f6" height={280}
                        showXAxis={xAxis} showYAxis={yAxis} showGrid={hGrid}
                        yFormatter={(v: number) => `${v}%`}
                        yDomain={[yMin, yMax]} tooltipLabel="YES chance"
                        yAxisSide="right"
                      />
                    </Box>

                    {/* Bottom controls */}
                    <HStack justify="flex-end" mt={2} spacing={0.5}>
                      {['1H','6H','1D','1W','1M','ALL'].map(tf => (
                        <Button key={tf} size="xs"
                          variant="ghost"
                          fontWeight={timeFrame === tf ? '800' : '500'}
                          color={timeFrame === tf ? '#3b82f6' : mutedClr}
                          bg="transparent"
                          borderBottom={timeFrame === tf ? '2px solid #3b82f6' : '2px solid transparent'}
                          borderRadius="none" px={2} h="24px"
                          _hover={{ color: headingClr, bg: 'transparent' }}
                          onClick={() => setTimeFrame(tf)}>{tf}</Button>
                      ))}

                      <Box w="1px" h="14px" bg={borderColor} mx={1} alignSelf="center" />

                      {/* Expand */}
                      <Box as="button" p={1} borderRadius="md" cursor="pointer"
                        color={mutedClr} bg="transparent" border="none"
                        _hover={{ color: headingClr }} style={{ outline: 'none', display: 'flex' }}>
                        <Maximize2 size={12} strokeWidth={2} />
                      </Box>

                      {/* Settings */}
                      <Popover placement="bottom-end">
                        <PopoverTrigger>
                          <Box as="button" p={1} borderRadius="md" cursor="pointer"
                            color={mutedClr} bg="transparent" border="none"
                            _hover={{ color: headingClr }} style={{ outline: 'none', display: 'flex' }}>
                            <SettingsIcon size={12} strokeWidth={2} />
                          </Box>
                        </PopoverTrigger>
                        <PopoverContent bg={modalBg} borderColor={borderColor} w="190px">
                          <PopoverBody>
                            <VStack align="start" spacing={2}>
                              {[
                                ['Autoscale', autoscale, setAutoscale],
                                ['X-Axis',    xAxis,     setXAxis],
                                ['Y-Axis',    yAxis,     setYAxis],
                                ['H. Grid',   hGrid,     setHGrid],
                                ['V. Grid',   vGrid,     setVGrid],
                              ].map(([label, val, set]: any) => (
                                <HStack key={label} justify="space-between" w="full">
                                  <Text fontSize="sm" color={headingClr}>{label}</Text>
                                  <Switch size="sm" isChecked={val} onChange={() => set(!val)} />
                                </HStack>
                              ))}
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </HStack>
                  </Box>
                )}

                {/* ── Resolution ── */}
                {tab === 'resolution' && (
                  <Box px={6} py={6}>
                    <Text fontSize="sm" color={mutedClr} lineHeight="1.8" mb={4}>
                      This market resolves YES if the described event occurs before the resolution date,
                      as verified by credible public sources. Resolves NO otherwise. Resolution is final
                      and determined by Afridict moderators within 24 hours of the qualifying event.
                    </Text>
                    <Button size="sm" variant="outline" borderRadius="lg" fontWeight="700"
                      borderColor={borderColor} color={headingClr}
                      _hover={{ borderColor: '#ffd700', color: '#ffd700' }}>
                      + Propose Resolution
                    </Button>
                  </Box>
                )}
              </Box>

              {/* ── Bottom social tabs ── */}
              <Box borderTop="1px solid" borderColor={borderColor}>
                {/* Tab bar */}
                <HStack px={6} spacing={0} borderBottom="1px solid" borderColor={borderColor} overflowX="auto">
                  {(['Comments', 'Top Holders', 'Positions', 'Activity'] as const).map(t => (
                    <Box key={t} px={4} py={3} cursor="pointer" flexShrink={0}
                      borderBottom="2px solid"
                      borderColor={socialTab === t ? headingClr : 'transparent'}
                      onClick={() => setSocialTab(t)}>
                      <Text fontSize="sm" fontWeight={socialTab === t ? '700' : '500'}
                        color={socialTab === t ? headingClr : mutedClr} whiteSpace="nowrap">{t}</Text>
                    </Box>
                  ))}
                </HStack>

                <Box px={6} py={4}>
                  {/* ── Comments ── */}
                  {socialTab === 'Comments' && (
                    <>
                      <Box mb={3} px={3} py={2} bg="rgba(245,158,11,.08)" border="1px solid rgba(245,158,11,.2)" borderRadius="lg">
                        <Text fontSize="11px" color="#f59e0b" lineHeight="1.6">
                          ⚠️ Do not click on external links shared in comments. AfriPredict will never ask for your wallet seed phrase or private keys.
                        </Text>
                      </Box>
                      <VStack align="stretch" spacing={3} maxH="180px" overflowY="auto" mb={4}>
                        {[
                          { user: '@web3vee',       time: '2h ago',  text: 'This market is too close. Nigeria will qualify but the odds aren\'t reflecting reality.' },
                          { user: '@afropredictor', time: '5h ago',  text: 'Cocoa price will definitely hit $4000. Global supply is crashing.' },
                          { user: '@naijabets',     time: '11h ago', text: 'Already placed 200 USDT on YES. This is free money.' },
                        ].map((c, i) => (
                          <Box key={i} p={3} bg={inputBg} borderRadius="xl">
                            <HStack mb={1}>
                              <Box w={6} h={6} borderRadius="full" bg="linear-gradient(135deg,#ffd700,#f59e0b)"
                                display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                                <Text fontSize="9px" fontWeight="800" color="gray.900">
                                  {c.user.slice(1, 3).toUpperCase()}
                                </Text>
                              </Box>
                              <Text fontSize="sm" fontWeight="700" color={headingClr}>{c.user}</Text>
                              <Text fontSize="xs" color={mutedClr} ml="auto !important">{c.time}</Text>
                            </HStack>
                            <Text fontSize="sm" color={mutedClr} pl={7}>{c.text}</Text>
                          </Box>
                        ))}
                      </VStack>
                      {isLoggedIn ? (
                        <HStack>
                          <Input placeholder="Write a comment..." size="sm" borderRadius="lg"
                            bg={inputBg} borderColor={borderColor} color={headingClr}
                            _placeholder={{ color: mutedClr }}
                            _focus={{ borderColor: '#ffd700', boxShadow: 'none' }} />
                          <Button size="sm" colorScheme="blue" borderRadius="lg" px={5}>Post</Button>
                        </HStack>
                      ) : (
                        <HStack px={3} py={2.5} bg={inputBg} borderRadius="xl" border="1px solid" borderColor={borderColor}
                          cursor="pointer" _hover={{ borderColor: '#ffd700' }} transition="border .15s"
                          onClick={login}>
                          <Text fontSize="xs" color={mutedClr} flex={1}>Login to join the conversation...</Text>
                          <Text fontSize="xs" fontWeight="700" color="#ffd700">Login →</Text>
                        </HStack>
                      )}
                    </>
                  )}

                  {/* ── Top Holders ── */}
                  {socialTab === 'Top Holders' && (
                    <VStack align="stretch" spacing={2} maxH="220px" overflowY="auto">
                      {socialData.holders.map((h) => (
                        <HStack key={h.rank} px={3} py={2.5} bg={inputBg} borderRadius="xl" spacing={3}>
                          <Text fontSize="xs" fontWeight="800" color={mutedClr} w="16px" textAlign="center">
                            {h.rank}
                          </Text>
                          <Box w={7} h={7} borderRadius="full" flexShrink={0}
                            bg={h.rank === 1 ? 'linear-gradient(135deg,#ffd700,#f59e0b)' : h.rank === 2 ? 'linear-gradient(135deg,#94a3b8,#64748b)' : h.rank === 3 ? 'linear-gradient(135deg,#cd7f32,#a0522d)' : inputBg}
                            border="1px solid" borderColor={borderColor}
                            display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="9px" fontWeight="800" color={h.rank <= 3 ? 'gray.900' : mutedClr}>
                              {h.user.slice(1, 3).toUpperCase()}
                            </Text>
                          </Box>
                          <Text fontSize="xs" fontWeight="700" color={headingClr} flex={1} noOfLines={1}>{h.user}</Text>
                          <Box px={2} py={0.5} borderRadius="full" fontSize="10px" fontWeight="800"
                            bg={h.side === 'YES' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}
                            color={h.side === 'YES' ? '#22c55e' : '#ef4444'}>
                            {h.side}
                          </Box>
                          <VStack spacing={0} align="end">
                            <Text fontSize="xs" fontWeight="700" color={headingClr}>{h.shares}</Text>
                            <Text fontSize="10px" color={mutedClr}>${h.value}</Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  )}

                  {/* ── Positions ── */}
                  {socialTab === 'Positions' && (
                    <VStack align="stretch" spacing={2} maxH="220px" overflowY="auto">
                      <HStack px={3} py={1.5}>
                        <Text fontSize="10px" fontWeight="700" color={mutedClr} textTransform="uppercase" letterSpacing="wider" flex={1}>Trader</Text>
                        <Text fontSize="10px" fontWeight="700" color={mutedClr} textTransform="uppercase" letterSpacing="wider" w="36px" textAlign="center">Side</Text>
                        <Text fontSize="10px" fontWeight="700" color={mutedClr} textTransform="uppercase" letterSpacing="wider" w="52px" textAlign="right">Shares</Text>
                        <Text fontSize="10px" fontWeight="700" color={mutedClr} textTransform="uppercase" letterSpacing="wider" w="52px" textAlign="right">Avg</Text>
                      </HStack>
                      {socialData.positions.map((p, i) => (
                        <HStack key={i} px={3} py={2.5} bg={inputBg} borderRadius="xl" spacing={3}>
                          <Box w={6} h={6} borderRadius="full" bg="linear-gradient(135deg,#3b82f6,#2563eb)"
                            display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                            <Text fontSize="9px" fontWeight="800" color="white">
                              {p.user.slice(1, 3).toUpperCase()}
                            </Text>
                          </Box>
                          <Text fontSize="xs" fontWeight="700" color={headingClr} flex={1} noOfLines={1}>{p.user}</Text>
                          <Box w="36px" textAlign="center" px={1.5} py={0.5} borderRadius="full" fontSize="10px" fontWeight="800"
                            bg={p.side === 'YES' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}
                            color={p.side === 'YES' ? '#22c55e' : '#ef4444'}>
                            {p.side}
                          </Box>
                          <Text fontSize="xs" fontWeight="700" color={headingClr} w="52px" textAlign="right">{p.shares}</Text>
                          <Text fontSize="xs" color={mutedClr} w="52px" textAlign="right">{p.avg}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}

                  {/* ── Activity ── */}
                  {socialTab === 'Activity' && (
                    <VStack align="stretch" spacing={0} maxH="220px" overflowY="auto">
                      {socialData.activity.map((a, i) => (
                        <HStack key={i} py={2.5} spacing={3}
                          borderBottom="1px solid" borderColor={borderColor} _last={{ borderBottom: 'none' }}>
                          <Box w={7} h={7} borderRadius="full" flexShrink={0}
                            bg={a.action === 'bought' ? (a.side === 'YES' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)') : inputBg}
                            border="1px solid"
                            borderColor={a.action === 'bought' ? (a.side === 'YES' ? '#22c55e55' : '#ef444455') : borderColor}
                            display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="10px">
                              {a.action === 'bought' ? (a.side === 'YES' ? '↑' : '↓') : '→'}
                            </Text>
                          </Box>
                          <Box flex={1} minW={0}>
                            <HStack spacing={1} flexWrap="wrap">
                              <Text fontSize="xs" fontWeight="700" color={headingClr}>{a.user}</Text>
                              <Text fontSize="xs" color={mutedClr}>{a.action}</Text>
                              <Text fontSize="xs" fontWeight="700"
                                color={a.side === 'YES' ? '#22c55e' : '#ef4444'}>{a.shares} {a.side}</Text>
                            </HStack>
                          </Box>
                          <Text fontSize="10px" color={mutedClr} flexShrink={0}>{a.time}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </Box>
              </Box>
            </Box>

            {/* ─── RIGHT TRADING PANEL ─── */}
            <Box w={isMobile ? 'full' : '300px'} flexShrink={0} bg={modalBg}
              borderLeft={isMobile ? 'none' : '1px solid'} borderTop={isMobile ? '1px solid' : 'none'}
              borderColor={borderColor} display="flex" flexDirection="column">

              {/* Market identity */}
              <HStack px={4} py={3} borderBottom="1px solid" borderColor={borderColor} spacing={3}>
                <Box w={9} h={9} borderRadius="lg" bg={inputBg} flexShrink={0}
                  display="flex" alignItems="center" justifyContent="center" fontSize="1.1rem">
                  {emoji}
                </Box>
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight="700" color={headingClr} noOfLines={1}>{market.title}</Text>
                  <Text fontSize="10px" color={mutedClr}>{market.category}</Text>
                </Box>
              </HStack>

              <Box px={4} py={4} flex={1} overflowY="auto">

                {/* ── BET SUCCESS STATE ── */}
                {betPlaced && (
                  <Box textAlign="center" py={6}>
                    {/* Animated ring + check */}
                    <Box position="relative" w="72px" h="72px" mx="auto" mb={5}>
                      <Box position="absolute" inset={0} borderRadius="full"
                        border="2px solid"
                        borderColor={betPlacedSide === 'yes' ? '#22c55e' : '#ef4444'}
                        style={{ animation: 'scale-in .35s cubic-bezier(.34,1.56,.64,1) forwards', opacity: 0.25 }} />
                      <Box position="absolute" inset={0} borderRadius="full"
                        bg={betPlacedSide === 'yes' ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)'}
                        display="flex" alignItems="center" justifyContent="center"
                        style={{ animation: 'scale-in .35s cubic-bezier(.34,1.56,.64,1) forwards' }}>
                        <Text fontSize="28px" style={{ animation: 'scale-in .4s .1s cubic-bezier(.34,1.56,.64,1) both' }}>
                          {betPlacedSide === 'yes' ? '✓' : '✗'}
                        </Text>
                      </Box>
                    </Box>

                    <Text fontSize="lg" fontWeight="900" color={headingClr} mb={0.5}>
                      Bet Placed!
                    </Text>
                    <Text fontSize="xs" color={mutedClr} mb={5}>
                      Your position is live · results update in real-time
                    </Text>

                    {/* Summary card */}
                    <Box bg={inputBg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={4} mb={5} textAlign="left">
                      <HStack justify="space-between" mb={2.5}>
                        <Text fontSize="xs" color={mutedClr}>Side</Text>
                        <Box px={2.5} py={0.5} borderRadius="full" fontSize="xs" fontWeight="800"
                          bg={betPlacedSide === 'yes' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}
                          color={betPlacedSide === 'yes' ? '#22c55e' : '#ef4444'}>
                          {betPlacedSide.toUpperCase()}
                        </Box>
                      </HStack>
                      <HStack justify="space-between" mb={2.5}>
                        <Text fontSize="xs" color={mutedClr}>Amount</Text>
                        <Text fontSize="xs" fontWeight="700" color={headingClr}>${betPlacedAmt.toFixed(2)}</Text>
                      </HStack>
                      <HStack justify="space-between" mb={2.5}>
                        <Text fontSize="xs" color={mutedClr}>Price</Text>
                        <Text fontSize="xs" fontWeight="700" color={headingClr}>
                          {fmtPrice(betPlacedSide === 'yes' ? yesDisplayPrice : noDisplayPrice)}
                        </Text>
                      </HStack>
                      <Box h="1px" bg={borderColor} my={2} />
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={mutedClr}>Potential return</Text>
                        <Text fontSize="sm" fontWeight="900"
                          color={betPlacedSide === 'yes' ? '#22c55e' : '#ef4444'}>
                          ${betPlacedAmt > 0
                            ? (betPlacedAmt / ((betPlacedSide === 'yes' ? yesDisplayPrice : noDisplayPrice) / 100)).toFixed(2)
                            : '0.00'}
                        </Text>
                      </HStack>
                    </Box>

                    <VStack spacing={2}>
                      <Button w="full" size="md" borderRadius="xl" fontWeight="800"
                        bg={betPlacedSide === 'yes'
                          ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                          : 'linear-gradient(135deg,#ef4444,#dc2626)'}
                        color="white" _hover={{ opacity: .9 }}
                        onClick={() => setBetPlaced(false)}>
                        Place Another Bet
                      </Button>
                      <Button w="full" size="sm" variant="ghost" borderRadius="xl"
                        color={mutedClr} _hover={{ color: headingClr }}
                        onClick={onClose}>
                        Done
                      </Button>
                    </VStack>

                    <style>{`
                      @keyframes scale-in {
                        0%   { transform: scale(0.5); opacity: 0; }
                        100% { transform: scale(1);   opacity: 1; }
                      }
                    `}</style>
                  </Box>
                )}

                {/* ── Trading form (hidden after bet placed) ── */}
                {!betPlaced && <>

                {/* Buy / Sell tabs + Order type toggle */}
                <HStack mb={4} justify="space-between" align="center">
                  <HStack spacing={0}>
                    {(['buy', 'sell'] as const).map(t => (
                      <Text key={t} fontSize="sm" fontWeight="700" px={2} pb={1.5} cursor="pointer"
                        color={buySell === t ? headingClr : mutedClr}
                        borderBottom={`2px solid ${buySell === t ? headingClr : 'transparent'}`}
                        textTransform="capitalize" transition="color .15s"
                        onClick={() => { setBuySell(t); setAmount(''); setShares(''); setLimitPriceInput(null); }}>
                        {t}
                      </Text>
                    ))}
                  </HStack>
                  {/* Order type — hover to open dropdown */}
                  <Box position="relative"
                    onMouseEnter={() => setOrderDropOpen(true)}
                    onMouseLeave={() => setOrderDropOpen(false)}>
                    <HStack spacing={1} bg={inputBg} borderRadius="md" px={2.5} py={1.5}
                      cursor="pointer" userSelect="none">
                      <Text fontSize="xs" color={mutedClr} fontWeight="600" textTransform="capitalize">
                        {orderType}
                      </Text>
                      <Text fontSize="10px" color={mutedClr}
                        style={{ transform: orderDropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .15s' }}>
                        ▾
                      </Text>
                    </HStack>
                    {orderDropOpen && (
                      <Box position="absolute" right={0} top="calc(100% + 4px)" zIndex={20}
                        bg={modalBg} border="1px solid" borderColor={borderColor}
                        borderRadius="lg" boxShadow="0 8px 24px rgba(0,0,0,.35)"
                        minW="110px" overflow="hidden">
                        {(['market', 'limit'] as const).map(opt => (
                          <Box key={opt} px={3} py={2.5} cursor="pointer"
                            bg={orderType === opt ? inputBg : 'transparent'}
                            _hover={{ bg: inputBg }} transition="bg .12s"
                            onClick={() => { setOrderType(opt); setLimitPriceInput(null); setOrderDropOpen(false); }}>
                            <Text fontSize="sm" textTransform="capitalize"
                              fontWeight={orderType === opt ? '700' : '500'}
                              color={orderType === opt ? headingClr : mutedClr}>
                              {opt}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </HStack>

                {/* Yes / No price buttons — always show both prices */}
                <HStack mb={4} spacing={2}>
                  <Button flex={1} size="sm" borderRadius="lg" fontWeight="800"
                    bg={side === 'yes' ? '#22c55e' : inputBg}
                    color={side === 'yes' ? 'white' : mutedClr}
                    border="1px solid" borderColor={side === 'yes' ? '#22c55e' : borderColor}
                    _hover={{ opacity: .9 }} transition="all .15s"
                    onClick={() => { setSide('yes'); setLimitPriceInput(null); }}>
                    Yes {fmtPrice(yesDisplayPrice)}
                  </Button>
                  <Button flex={1} size="sm" borderRadius="lg" fontWeight="800"
                    bg={side === 'no' ? '#ef4444' : inputBg}
                    color={side === 'no' ? 'white' : mutedClr}
                    border="1px solid" borderColor={side === 'no' ? '#ef4444' : borderColor}
                    _hover={{ opacity: .9 }} transition="all .15s"
                    onClick={() => { setSide('no'); setLimitPriceInput(null); }}>
                    No {fmtPrice(noDisplayPrice)}
                  </Button>
                </HStack>

                {/* ── Not logged in gate ── */}
                {buySell === 'buy' && !isLoggedIn && (
                  <VStack spacing={4} py={6} align="center">
                    <Text fontSize="2xl">🔒</Text>
                    <VStack spacing={1} textAlign="center">
                      <Text fontSize="sm" fontWeight="800" color={headingClr}>Login to place bets</Text>
                      <Text fontSize="xs" color={mutedClr} maxW="200px" lineHeight="1.6">
                        Create a free account to start predicting
                      </Text>
                    </VStack>
                    <Button w="full" size="md" borderRadius="xl" fontWeight="800"
                      bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                      _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                      onClick={login}>
                      Login / Sign Up →
                    </Button>
                  </VStack>
                )}

                {/* ── Empty wallet gate ── */}
                {buySell === 'buy' && isLoggedIn && cashBalance === 0 && (
                  <VStack spacing={4} py={6} align="center">
                    <Box w={14} h={14} borderRadius="full"
                      bg="rgba(255,215,0,.1)" border="2px solid rgba(255,215,0,.3)"
                      display="flex" alignItems="center" justifyContent="center">
                      <Wallet size={24} color="#ffd700" strokeWidth={1.5} />
                    </Box>
                    <VStack spacing={1} textAlign="center">
                      <Text fontSize="sm" fontWeight="800" color={headingClr}>No balance yet</Text>
                      <Text fontSize="xs" color={mutedClr} maxW="200px" lineHeight="1.6">
                        Deposit USDT to start placing predictions
                      </Text>
                    </VStack>
                    <Button w="full" size="md" borderRadius="xl" fontWeight="800"
                      bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                      _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                      onClick={openDeposit}>
                      Deposit to Bet →
                    </Button>
                  </VStack>
                )}

                {/* ── BUY MARKET ── */}
                {buySell === 'buy' && isLoggedIn && cashBalance > 0 && orderType === 'market' && (
                  <>
                    <HStack justify="space-between" mb={1.5}>
                      <Text fontSize="xs" fontWeight="600" color={mutedClr}>Amount</Text>
                      <HStack spacing={1}>
                        <Text fontSize="xs" color={mutedClr}>Balance:</Text>
                        <Text fontSize="xs" fontWeight="700" color="#ffd700">${cashBalance.toFixed(2)}</Text>
                      </HStack>
                    </HStack>
                    <HStack mb={2} bg={inputBg} borderRadius="lg" px={3} py={2}
                      border="1px solid" borderColor={borderColor}
                      _focusWithin={{ borderColor: '#3b82f6' }} transition="border .15s">
                      <Text fontSize="sm" fontWeight="700" color={mutedClr}>$</Text>
                      <Input variant="unstyled" fontSize="md" fontWeight="700" color={headingClr}
                        placeholder="0" _placeholder={{ color: mutedClr }}
                        value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
                    </HStack>
                    <HStack mb={4} spacing={1.5}>
                      {[1, 5, 10, 100].map(v => (
                        <Button key={v} size="xs" flex={1} borderRadius="md" fontWeight="700"
                          bg={inputBg} color={mutedClr}
                          border="1px solid" borderColor={borderColor}
                          _hover={{ borderColor: '#3b82f6', color: headingClr }} transition="all .15s"
                          onClick={() => setAmount(String((Number(amount) || 0) + v))}>
                          +${v}
                        </Button>
                      ))}
                    </HStack>

                    {/* Calculations — only shown when amount > 0 */}
                    {amountNum > 0 && (
                      <VStack spacing={2} mb={4} p={3}
                        bg={inputBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={mutedClr}>Avg price</Text>
                          <Text fontSize="xs" fontWeight="700" color={headingClr}>{fmtPrice(activeSidePrice)}</Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={mutedClr}>Shares</Text>
                          <Text fontSize="xs" fontWeight="700" color={headingClr}>{sharesFromAmount.toFixed(2)}</Text>
                        </HStack>
                        <Box w="full" h="1px" bg={borderColor} />
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={mutedClr}>Potential return</Text>
                          <HStack spacing={1}>
                            <Box w="7px" h="7px" borderRadius="full" bg="#22c55e" flexShrink={0} />
                            <Text fontSize="xs" fontWeight="800" color="#22c55e">
                              ${totalPayout.toFixed(2)} ({pctReturn > 0 ? '+' : ''}{pctReturn.toFixed(0)}%)
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    )}
                  </>
                )}

                {/* ── BUY LIMIT ── */}
                {buySell === 'buy' && isLoggedIn && cashBalance > 0 && orderType === 'limit' && (
                  <>
                    <HStack mb={3} justify="space-between" align="center">
                      <Text fontSize="xs" fontWeight="600" color={mutedClr}>Limit price</Text>
                      <HStack spacing={2} align="center">
                        <Box as="button" w={7} h={7} borderRadius="md" bg={inputBg}
                          border="1px solid" borderColor={borderColor}
                          display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                          _hover={{ borderColor: '#3b82f6' }} transition="border .15s" style={{ outline: 'none' }}
                          onClick={() => setLimitPriceInput(p => +(Math.max(0.5, (p ?? activeSidePrice) - 0.5).toFixed(1)))}>
                          <Text fontWeight="700" color={headingClr} lineHeight="1">−</Text>
                        </Box>
                        <Text fontSize="sm" fontWeight="800" color={headingClr} minW="42px" textAlign="center">
                          {fmtPrice(activeLimitPrice)}
                        </Text>
                        <Box as="button" w={7} h={7} borderRadius="md" bg={inputBg}
                          border="1px solid" borderColor={borderColor}
                          display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                          _hover={{ borderColor: '#3b82f6' }} transition="border .15s" style={{ outline: 'none' }}
                          onClick={() => setLimitPriceInput(p => +(Math.min(99.5, (p ?? activeSidePrice) + 0.5).toFixed(1)))}>
                          <Text fontWeight="700" color={headingClr} lineHeight="1">+</Text>
                        </Box>
                      </HStack>
                    </HStack>

                    <HStack justify="space-between" mb={1.5}>
                      <Text fontSize="xs" fontWeight="600" color={mutedClr}>Shares</Text>
                      <HStack spacing={1}>
                        <Text fontSize="xs" color={mutedClr}>Balance:</Text>
                        <Text fontSize="xs" fontWeight="700" color="#ffd700">${cashBalance.toFixed(2)}</Text>
                      </HStack>
                    </HStack>
                    <HStack mb={0.5} bg={inputBg} borderRadius="lg" px={3} py={2}
                      border="1px solid" borderColor={borderColor}
                      _focusWithin={{ borderColor: '#3b82f6' }} transition="border .15s">
                      <Input variant="unstyled" fontSize="md" fontWeight="700" color={headingClr} textAlign="right"
                        placeholder="0" _placeholder={{ color: mutedClr }}
                        value={shares} onChange={e => setShares(e.target.value.replace(/[^0-9]/g, ''))} />
                    </HStack>

                    <HStack mb={3} spacing={1.5}>
                      {([-100, -10, 10, 100] as const).map(v => (
                        <Button key={v} size="xs" flex={1} borderRadius="md" fontWeight="700"
                          bg={inputBg} color={mutedClr}
                          border="1px solid" borderColor={borderColor}
                          _hover={{ borderColor: '#3b82f6', color: headingClr }} transition="all .15s"
                          onClick={() => setShares(s => String(Math.max(0, (Number(s) || 0) + v)))}>
                          {v > 0 ? `+${v}` : v}
                        </Button>
                      ))}
                    </HStack>

                    <HStack justify="space-between" mb={3}>
                      <Text fontSize="xs" color={mutedClr}>Expires</Text>
                      <HStack spacing={1} cursor="pointer" _hover={{ opacity: .75 }}
                        onClick={() => setExpires(e => e === 'Never' ? '1 Day' : e === '1 Day' ? '1 Week' : 'Never')}>
                        <Text fontSize="xs" fontWeight="600" color={headingClr}>{expires}</Text>
                        <Text fontSize="10px" color={mutedClr}>▾</Text>
                      </HStack>
                    </HStack>

                    <VStack spacing={2} mb={4} p={3}
                      bg={inputBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color={mutedClr}>Total</Text>
                        <Text fontSize="xs" fontWeight="800" color={headingClr}>${limitTotal.toFixed(2)}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="xs" color={mutedClr}>To win</Text>
                        <HStack spacing={1}>
                          <Box w="7px" h="7px" borderRadius="full" bg="#22c55e" flexShrink={0} />
                          <Text fontSize="xs" fontWeight="800" color="#22c55e">${limitToWin.toFixed(2)}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </>
                )}

                {/* ── SELL MARKET ── */}
                {buySell === 'sell' && orderType === 'market' && (
                  <>
                    <Text fontSize="xs" fontWeight="600" color={mutedClr} mb={1.5}>Shares</Text>
                    <HStack mb={2} bg={inputBg} borderRadius="lg" px={3} py={2}
                      border="1px solid" borderColor={borderColor}
                      _focusWithin={{ borderColor: '#3b82f6' }} transition="border .15s">
                      <Input variant="unstyled" fontSize="md" fontWeight="700" color={headingClr} textAlign="right"
                        placeholder="0" _placeholder={{ color: mutedClr }}
                        value={shares} onChange={e => setShares(e.target.value.replace(/[^0-9]/g, ''))} />
                    </HStack>
                    <HStack mb={4} spacing={2}>
                      {['25%', '50%', 'Max'].map(pct => (
                        <Button key={pct} size="xs" flex={1} borderRadius="md" fontWeight="700"
                          bg={inputBg} color={mutedClr}
                          border="1px solid" borderColor={borderColor}
                          _hover={{ borderColor: '#3b82f6', color: headingClr }} transition="all .15s"
                          onClick={() => {}}>
                          {pct}
                        </Button>
                      ))}
                    </HStack>
                  </>
                )}

                {/* ── SELL LIMIT ── */}
                {buySell === 'sell' && orderType === 'limit' && (
                  <>
                    <HStack mb={3} justify="space-between" align="center">
                      <Text fontSize="xs" fontWeight="600" color={mutedClr}>Limit price</Text>
                      <HStack spacing={2} align="center">
                        <Box as="button" w={7} h={7} borderRadius="md" bg={inputBg}
                          border="1px solid" borderColor={borderColor}
                          display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                          _hover={{ borderColor: '#3b82f6' }} transition="border .15s" style={{ outline: 'none' }}
                          onClick={() => setLimitPriceInput(p => +(Math.max(0.5, (p ?? activeSidePrice) - 0.5).toFixed(1)))}>
                          <Text fontWeight="700" color={headingClr} lineHeight="1">−</Text>
                        </Box>
                        <Text fontSize="sm" fontWeight="800" color={headingClr} minW="42px" textAlign="center">
                          {fmtPrice(activeLimitPrice)}
                        </Text>
                        <Box as="button" w={7} h={7} borderRadius="md" bg={inputBg}
                          border="1px solid" borderColor={borderColor}
                          display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                          _hover={{ borderColor: '#3b82f6' }} transition="border .15s" style={{ outline: 'none' }}
                          onClick={() => setLimitPriceInput(p => +(Math.min(99.5, (p ?? activeSidePrice) + 0.5).toFixed(1)))}>
                          <Text fontWeight="700" color={headingClr} lineHeight="1">+</Text>
                        </Box>
                      </HStack>
                    </HStack>

                    <Text fontSize="xs" fontWeight="600" color={mutedClr} mb={1.5}>Shares</Text>
                    <HStack mb={2} bg={inputBg} borderRadius="lg" px={3} py={2}
                      border="1px solid" borderColor={borderColor}
                      _focusWithin={{ borderColor: '#3b82f6' }} transition="border .15s">
                      <Input variant="unstyled" fontSize="md" fontWeight="700" color={headingClr} textAlign="right"
                        placeholder="0" _placeholder={{ color: mutedClr }}
                        value={shares} onChange={e => setShares(e.target.value.replace(/[^0-9]/g, ''))} />
                    </HStack>
                    <HStack mb={3} spacing={2}>
                      {['25%', '50%', 'Max'].map(pct => (
                        <Button key={pct} size="xs" flex={1} borderRadius="md" fontWeight="700"
                          bg={inputBg} color={mutedClr}
                          border="1px solid" borderColor={borderColor}
                          _hover={{ borderColor: '#3b82f6', color: headingClr }} transition="all .15s"
                          onClick={() => {}}>
                          {pct}
                        </Button>
                      ))}
                    </HStack>

                    <HStack justify="space-between" mb={3}>
                      <Text fontSize="xs" color={mutedClr}>Expires</Text>
                      <HStack spacing={1} cursor="pointer" _hover={{ opacity: .75 }}
                        onClick={() => setExpires(e => e === 'Never' ? '1 Day' : e === '1 Day' ? '1 Week' : 'Never')}>
                        <Text fontSize="xs" fontWeight="600" color={headingClr}>{expires}</Text>
                        <Text fontSize="10px" color={mutedClr}>▾</Text>
                      </HStack>
                    </HStack>

                    <VStack spacing={2} mb={4} p={3}
                      bg={inputBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
                      <HStack justify="space-between" w="full">
                        <HStack spacing={1}>
                          <Text fontSize="xs" color={mutedClr}>You'll receive</Text>
                          <Text fontSize="10px" color={mutedClr} cursor="help" title="Estimated payout if filled at limit price">ⓘ</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Box w="7px" h="7px" borderRadius="full" bg="#22c55e" flexShrink={0} />
                          <Text fontSize="xs" fontWeight="800" color="#22c55e">${limitReceive.toFixed(2)}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </>
                )}

                {/* ── ACTION BUTTON ── */}
                <Button w="full" borderRadius="xl" fontWeight="800" size="md" color="white"
                  bg={buySell === 'buy' ? '#3b82f6' : '#ef4444'}
                  _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                  onClick={placeBet}>
                  {buySell === 'buy'
                    ? orderType === 'market'
                      ? amountNum < 0.5 ? 'Min. $0.50 to bet' : `Buy ${side === 'yes' ? 'Yes' : 'No'}`
                      : 'Place buy order'
                    : orderType === 'market' ? `Sell ${side === 'yes' ? 'Yes' : 'No'}` : 'Place sell order'
                  }
                </Button>

                <Text fontSize="9px" color={mutedClr} textAlign="center" mt={2}>
                  By trading, you agree to the{' '}
                  <Text as="span" color="#3b82f6" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                    Terms of Use
                  </Text>.
                </Text>
                </>}
              </Box>

              {/* Related markets */}
              <Box borderTop="1px solid" borderColor={borderColor}>
                {/* Tabs */}
                <HStack px={4} pt={3} pb={2} spacing={1} flexWrap="wrap">
                  {relTabs.map(t => (
                    <Box key={t} px={3} py={1} borderRadius="full" cursor="pointer"
                      bg={relTab === t ? inputBg : 'transparent'}
                      border="1px solid" borderColor={relTab === t ? borderColor : 'transparent'}
                      onClick={() => setRelTab(t)}>
                      <Text fontSize="xs" fontWeight="700" color={relTab === t ? headingClr : mutedClr}>{t}</Text>
                    </Box>
                  ))}
                </HStack>

                {/* Related list */}
                {related.map((r, i) => (
                  <Box key={r.id}>
                    {i > 0 && <Box h="1px" bg={dividerClr} />}
                    <HStack px={4} py={3} _hover={{ bg: rowHover }} cursor="pointer" spacing={3} transition="bg .15s">
                      <Box w={7} h={7} borderRadius="md" bg={inputBg} flexShrink={0}
                        display="flex" alignItems="center" justifyContent="center" fontSize="0.85rem">
                        {CATEGORY_EMOJI[r.category] ?? '📊'}
                      </Box>
                      <Text flex={1} fontSize="xs" fontWeight="600" color={headingClr} lineHeight="1.4" noOfLines={2}>
                        {r.title}
                      </Text>
                      <Text fontSize="sm" fontWeight="800" color={headingClr} flexShrink={0}>
                        {Math.round((1 / (r.yesOdds || 1.9)) / ((1/(r.yesOdds||1.9)) + (1/(r.noOdds||1.9))) * 100)}%
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
