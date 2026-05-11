import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Badge, Button, HStack, Heading, Input, Text, VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Clock, CheckCircle2 } from 'lucide-react';
import AppChart from '../components/shared/AppChart';
import OrderBook from '../components/mentions/OrderBook';

function marketChance(market: any): number {
  const yp = 1 / (market?.yesOdds || 1.9);
  const np = 1 / (market?.noOdds || 1.9);
  return Math.round((yp / (yp + np)) * 100);
}

function genPanelChartData(market: any): { time: string; value: number }[] {
  const chance = marketChance(market);
  const seed = ((market?.id || 1) * 997) & 0xffffff;
  const pts: { time: string; value: number }[] = [];
  let cur = Math.max(30, chance - 20);
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const progress = i / n;
    const r = Math.sin(seed * 9301 + i * 49297 + 233280) * 43758.5453;
    const noise = (r - Math.floor(r) - 0.5) * (8 - progress * 4);
    cur = Math.max(5, Math.min(97, cur + (chance - cur) * 0.12 + noise));
    pts.push({ time: i % 10 === 0 ? `${Math.round((i / n) * 24)}h` : '', value: +cur.toFixed(1) });
  }
  pts[pts.length - 1].value = chance;
  return pts;
}

function makePanelOrderBook(yesCents: number) {
  const sp = 11;
  return {
    asks: [
      { price: yesCents + 9, shares: 20.00 },
      { price: yesCents + 8, shares: 7.20  },
      { price: yesCents + 1, shares: 10.00 },
      { price: yesCents,     shares: 19.00 },
    ],
    bids: [
      { price: yesCents - sp,     shares: 31.00 },
      { price: yesCents - sp - 1, shares: 10.00 },
      { price: yesCents - sp - 6, shares: 10.00 },
      { price: yesCents - sp - 7, shares: 5.31  },
    ],
    last: yesCents - 1,
    spread: sp,
  };
}

type PanelTab = 'orderbook' | 'graph' | 'resolution';

const CAT_META: Record<string, { icon: string; color: string; desc: string; sub: string[] }> = {
  Sports:      { icon: '⚽', color: '#4ade80', desc: 'African & global sports prediction markets',          sub: ['All','AFCON','World Cup','CAF Champions','Premier League','NBA Africa','UFC','Rugby'] },
  Elections:   { icon: '🗳️', color: '#ffd700', desc: 'African election and political prediction markets',  sub: ['All','Nigeria','Kenya','South Africa','Ghana','Egypt','Senegal','Ethiopia'] },
  Music:       { icon: '🎵', color: '#f472b6', desc: 'Music, Afrobeats & entertainment markets',           sub: ['All','Afrobeats','Grammy','Albums','Awards','Charts','Collabs'] },
  Crypto:      { icon: '₿',  color: '#a78bfa', desc: 'Crypto price, adoption & blockchain markets',        sub: ['All','Bitcoin','Ethereum','Stablecoins','DeFi','NFTs','Regulation'] },
  Economy:     { icon: '💹', color: '#60a5fa', desc: 'African economic indicators & currency markets',     sub: ['All','Naira','Cedi','KES','Oil','Inflation','Trade'] },
  Politics:    { icon: '🏛️', color: '#34d399', desc: 'African political events & governance markets',    sub: ['All','Nigeria','Kenya','South Africa','Sudan','Ethiopia','Congo'] },
  Finance:     { icon: '💰', color: '#f59e0b', desc: 'Finance, banking & investment markets',              sub: ['All','Banking','Stocks','Bonds','Fintech','Insurance'] },
  Tech:        { icon: '💻', color: '#38bdf8', desc: 'Technology, AI & startup prediction markets',        sub: ['All','AI','Startups','Telecom','Fintech','Space'] },
  Security:    { icon: '🔒', color: '#f87171', desc: 'Security, conflict & peacekeeping markets',          sub: ['All','Nigeria','Sudan','Sahel','East Africa','Horn of Africa'] },
  Commodities: { icon: '📦', color: '#f97316', desc: 'Commodity price & trade prediction markets',         sub: ['All','Oil','Gold','Cocoa','Coffee','Grain'] },
  Weather:     { icon: '☁️', color: '#22d3ee', desc: 'Climate, weather & environmental markets',          sub: ['All','Rainfall','Drought','Flooding','Temperature','Cyclones'] },
};

interface CategoryPageProps {
  markets: any[];
  onBetSuccess: (side: 'yes' | 'no') => void;
  onMarketDetail: (market: any) => void;
}

export default function CategoryPage({ markets, onBetSuccess, onMarketDetail }: CategoryPageProps) {
  const { category = '' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [catSubFilter, setCatSubFilter]   = useState('All');
  const [activeBetMarket, setActiveBetMarket] = useState<any>(null);
  const [activeBetSide, setActiveBetSide] = useState<'yes' | 'no'>('yes');
  const [activeBetAmt, setActiveBetAmt]   = useState('');
  const [panelTab, setPanelTab]           = useState<PanelTab>('graph');

  const meta = CAT_META[category] || { icon: '📊', color: '#ffd700', desc: 'Prediction markets', sub: ['All'] };

  const filtered = useMemo(() =>
    markets.filter(m =>
      m.category === category &&
      (catSubFilter === 'All' || m.title.toLowerCase().includes(catSubFilter.toLowerCase()))
    ),
  [markets, category, catSubFilter]);

  const subCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of meta.sub) {
      if (s !== 'All') counts[s] = markets.filter(m => m.category === category && m.title.toLowerCase().includes(s.toLowerCase())).length;
    }
    return counts;
  }, [markets, category, meta.sub]);

  const { yesCents, noCents, panelOB, panelData } = useMemo(() => {
    const yc = activeBetMarket ? marketChance(activeBetMarket) : 50;
    return {
      yesCents:  yc,
      noCents:   100 - yc,
      panelOB:   makePanelOrderBook(yc),
      panelData: activeBetMarket ? genPanelChartData(activeBetMarket) : [],
    };
  }, [activeBetMarket]);

  // Color tokens — all pre-computed, none inside map callbacks
  const pageBg        = useColorModeValue('#f8fafc', '#070b14');
  const headerBg      = useColorModeValue('white', '#0d1117');
  const headerBorder  = useColorModeValue('gray.200', '#1e293b');
  const headingColor  = useColorModeValue('#0f172a', '#f8fafc');
  const sidebarBg     = useColorModeValue('white', '#0d1117');
  const sidebarBorder = useColorModeValue('gray.200', '#1e293b');
  const sidebarRowBorder = useColorModeValue('gray.100', '#1e293b');
  const sidebarRowHover  = useColorModeValue('gray.50', '#161b22');
  const subLabelColor    = useColorModeValue('gray.600', 'gray.300');
  const filterActiveBg   = useColorModeValue('gray.100', '#1e293b');
  const filterActiveColor = useColorModeValue('gray.600', 'gray.300');
  const filterActiveBorder = useColorModeValue('gray.200', '#374151');
  const subFilterBg    = useColorModeValue('gray.100', '#1e293b');
  const subFilterColor = useColorModeValue('gray.600', 'gray.300');
  const subFilterBorder = useColorModeValue('gray.200', '#374151');
  const marketCardBg   = useColorModeValue('white', '#0d1117');
  const marketCardBorder = useColorModeValue('gray.200', '#1e293b');
  const betPanelBg     = useColorModeValue('white', '#0d1117');
  const betPanelBorder = useColorModeValue('gray.200', '#1e293b');
  const betPanelRowBorder = useColorModeValue('gray.100', '#1e293b');
  const amtInputBg     = useColorModeValue('gray.50', '#161b22');
  const amtInputBorder = useColorModeValue('gray.200', '#374151');
  const qtyBg          = useColorModeValue('gray.100', '#1e293b');
  const qtyColor       = useColorModeValue('gray.600', 'gray.300');
  const qtyBorder      = useColorModeValue('gray.200', '#374151');

  return (
    <Box minH="100vh" bg={pageBg} display="flex" flexDirection="column">
      {/* Category hero banner */}
      <Box bg={headerBg} borderBottom="1px solid" borderColor={headerBorder} px={8} py={5}>
        <HStack spacing={4} mb={3}>
          <Box w={10} h={10} borderRadius="xl" display="flex" alignItems="center" justifyContent="center"
            bg={`${meta.color}18`} border="1px solid" borderColor={`${meta.color}40`}>
            <Text fontSize="xl">{meta.icon}</Text>
          </Box>
          <Box>
            <Heading fontSize="xl" fontWeight="800" color={headingColor}>{category}</Heading>
            <Text fontSize="xs" color="gray.400">{meta.desc}</Text>
          </Box>
          <Button ml="auto" size="sm" variant="ghost" color="gray.400" onClick={() => navigate('/')}>← Back</Button>
        </HStack>

        {/* Sub-filters */}
        <HStack spacing={2} overflowX="auto" pb={1}>
          {meta.sub.map(s => (
            <Box key={s} px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="700" flexShrink={0}
              bg={catSubFilter === s ? meta.color : subFilterBg}
              color={catSubFilter === s ? '#000' : subFilterColor}
              border="1px solid" borderColor={catSubFilter === s ? meta.color : subFilterBorder}
              cursor="pointer" transition="all .15s"
              onClick={() => setCatSubFilter(s)}>
              {s}
            </Box>
          ))}
        </HStack>
      </Box>

      {/* Main 3-column layout */}
      <Box flex={1} display="grid" gridTemplateColumns={{ base: '1fr', lg: '220px 1fr 300px' }}
        maxW="1400px" mx="auto" w="full" px={4} py={6} gap={6} alignItems="start">

        {/* LEFT sidebar */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Box bg={sidebarBg} border="1px solid" borderColor={sidebarBorder} borderRadius="xl" overflow="hidden">
            {[
              { icon: <Box w="8px" h="8px" borderRadius="full" bg="#ef4444" flexShrink={0} />, label: 'Live Now',  count: filtered.length },
              { icon: <Clock size={13} strokeWidth={2} />,         label: 'Upcoming', count: Math.floor(filtered.length * 0.6) },
              { icon: <CheckCircle2 size={13} strokeWidth={2} />,  label: 'Resolved', count: 24 },
            ].map(item => (
              <HStack key={item.label} px={4} py={3} justify="space-between"
                borderBottom="1px solid" borderColor={sidebarRowBorder}
                cursor="pointer" _hover={{ bg: sidebarRowHover }} transition="bg .15s">
                <HStack spacing={2}>
                  {item.icon}
                  <Text fontSize="sm" fontWeight="600" color={headingColor}>{item.label}</Text>
                </HStack>
                <Text fontSize="xs" color="gray.400" fontWeight="700">{item.count}</Text>
              </HStack>
            ))}
            <Box px={4} py={3}>
              <Text fontSize="10px" fontWeight="800" letterSpacing="widest" color="gray.400"
                textTransform="uppercase" mb={2}>Sub-topics</Text>
              <VStack align="start" spacing={1}>
                {meta.sub.filter(s => s !== 'All').map(s => (
                  <HStack key={s} w="full" justify="space-between" px={2} py={1.5} borderRadius="lg"
                    bg={catSubFilter === s ? `${meta.color}18` : 'transparent'}
                    cursor="pointer" _hover={{ bg: sidebarRowHover }} transition="all .15s"
                    onClick={() => setCatSubFilter(s)}>
                    <Text fontSize="sm" fontWeight={catSubFilter === s ? '700' : '500'}
                      color={catSubFilter === s ? meta.color : subLabelColor}>{s}</Text>
                    <Text fontSize="10px" color="gray.500">
                      {subCounts[s] || '—'}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>
        </Box>

        {/* CENTER — markets list */}
        <Box>
          {filtered.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Text fontSize="3xl" mb={3}>{meta.icon}</Text>
              <Text fontWeight="700" color={headingColor} mb={1}>No markets yet</Text>
              <Text fontSize="sm" color="gray.400">Check back soon or try a different filter</Text>
            </Box>
          ) : (
            <VStack spacing={3}>
              {filtered.map(m => (
                <Box key={m.id} w="full" bg={marketCardBg}
                  border="1px solid" borderColor={activeBetMarket?.id === m.id ? meta.color : marketCardBorder}
                  borderRadius="xl" p={4} cursor="pointer" transition="all .18s"
                  _hover={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}40` }}
                  onClick={() => { setActiveBetMarket(m); setActiveBetSide('yes'); setActiveBetAmt(''); }}>
                  <HStack justify="space-between" mb={3}>
                    <HStack spacing={2}>
                      <Box w={7} h={7} borderRadius="lg" bg={`${meta.color}18`}
                        display="flex" alignItems="center" justifyContent="center">
                        <Text fontSize="sm">{meta.icon}</Text>
                      </Box>
                      <Badge fontSize="9px" colorScheme="green">● LIVE</Badge>
                      <Badge fontSize="9px" variant="outline" colorScheme="gray">{m.category}</Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.400">${(m.pool / 1000).toFixed(1)}K Vol.</Text>
                  </HStack>
                  <Text fontWeight="700" fontSize="sm" color={headingColor} mb={4} lineHeight="1.5">{m.title}</Text>
                  <HStack spacing={3}>
                    <Button flex={1} size="sm" borderRadius="lg" fontWeight="800"
                      bg="rgba(74,222,128,.15)" color="#4ade80"
                      border="1px solid" borderColor="rgba(74,222,128,.3)"
                      _hover={{ bg: 'rgba(74,222,128,.25)' }}
                      onClick={e => { e.stopPropagation(); setActiveBetMarket(m); setActiveBetSide('yes'); }}>
                      YES {m.yesOdds}x
                    </Button>
                    <Button flex={1} size="sm" borderRadius="lg" fontWeight="800"
                      bg="rgba(248,113,113,.15)" color="#f87171"
                      border="1px solid" borderColor="rgba(248,113,113,.3)"
                      _hover={{ bg: 'rgba(248,113,113,.25)' }}
                      onClick={e => { e.stopPropagation(); setActiveBetMarket(m); setActiveBetSide('no'); }}>
                      NO {m.noOdds}x
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* RIGHT — detail + bet panel */}
        <Box display={{ base: 'none', lg: 'block' }} position="sticky" top="80px">
          {activeBetMarket ? (
            <Box bg={betPanelBg} border="1px solid" borderColor={betPanelBorder} borderRadius="xl" overflow="hidden">

              {/* Header */}
              <Box px={4} py={3} borderBottom="1px solid" borderColor={betPanelRowBorder}>
                <HStack spacing={2} mb={1}>
                  <Badge colorScheme="green" fontSize="9px">● LIVE</Badge>
                  <Text fontSize="10px" color="gray.400">${(activeBetMarket.pool / 1000).toFixed(1)}K Vol.</Text>
                </HStack>
                <Text fontSize="xs" fontWeight="700" color={headingColor} noOfLines={2}>{activeBetMarket.title}</Text>
              </Box>

              {/* Chance + Buy Yes / Buy No */}
              <Box px={4} py={3} borderBottom="1px solid" borderColor={betPanelRowBorder}>
                <HStack justify="space-between" mb={3} align="baseline">
                  <Text fontSize="xl" fontWeight="900" color="#22c55e">{yesCents}% chance</Text>
                  <Text fontSize="xs" color="gray.500">{activeBetMarket.category}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Button flex={1} size="sm" bg="#22c55e" color="white" borderRadius="lg" fontWeight="800"
                    _hover={{ bg: '#16a34a' }} onClick={() => setActiveBetSide('yes')}>
                    Buy Yes {yesCents}¢
                  </Button>
                  <Button flex={1} size="sm" bg="transparent" color="#ef4444" borderRadius="lg" fontWeight="800"
                    border="1px solid" borderColor="rgba(239,68,68,0.4)"
                    _hover={{ bg: 'rgba(239,68,68,0.08)' }} onClick={() => setActiveBetSide('no')}>
                    Buy No {noCents}¢
                  </Button>
                </HStack>
              </Box>

              {/* Tabs */}
              <HStack px={4} spacing={5} borderBottom="1px solid" borderColor={betPanelRowBorder}>
                {(['Order Book', 'Graph', 'Resolution'] as const).map(label => {
                  const key = label === 'Order Book' ? 'orderbook' : label === 'Graph' ? 'graph' : 'resolution';
                  return (
                    <Text key={key} fontSize="12px" fontWeight="700" cursor="pointer" py={2.5}
                      color={panelTab === key ? meta.color : 'gray.400'}
                      borderBottom="2px solid"
                      borderColor={panelTab === key ? meta.color : 'transparent'}
                      onClick={() => setPanelTab(key as PanelTab)}>
                      {label}
                    </Text>
                  );
                })}
              </HStack>

              {/* Tab content */}
              {panelTab === 'orderbook' && (
                <Box maxH="240px" overflowY="auto">
                  <OrderBook asks={panelOB.asks} bids={panelOB.bids} last={panelOB.last} spread={panelOB.spread} />
                </Box>
              )}
              {panelTab === 'graph' && (
                <Box px={3} pt={3} pb={1}>
                  <Text fontSize="sm" fontWeight="900" color="#22c55e" mb={2}>{yesCents}% chance</Text>
                  <Box h="160px">
                    <AppChart
                      data={panelData}
                      color="#3b82f6"
                      height={160}
                      yFormatter={(v: number) => `${v}%`}
                      tooltipLabel="YES chance"
                    />
                  </Box>
                </Box>
              )}
              {panelTab === 'resolution' && (
                <Box p={4}>
                  <Text fontSize="xs" color="gray.400" lineHeight="1.7" mb={4}>
                    This market resolves YES if the described event occurs before the resolution date,
                    as verified by credible sources. Resolves NO otherwise. Resolution is final.
                  </Text>
                  <Button size="sm" w="full" variant="outline" borderRadius="lg" fontWeight="700" fontSize="xs"
                    borderColor={meta.color} color={meta.color}
                    _hover={{ bg: `${meta.color}18` }}>
                    + Propose Resolution
                  </Button>
                </Box>
              )}

              {/* Trading section */}
              <Box px={4} pt={3} pb={4} borderTop="1px solid" borderColor={betPanelRowBorder}>
                <Text fontSize="xs" color="gray.400" mb={1}>
                  Amount · Buying{' '}
                  <Text as="span" fontWeight="700" color={activeBetSide === 'yes' ? '#22c55e' : '#ef4444'}>
                    {activeBetSide === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </Text>
                <HStack mb={2}>
                  <Input value={activeBetAmt} onChange={e => setActiveBetAmt(e.target.value)}
                    placeholder="$0" size="sm" borderRadius="lg"
                    bg={amtInputBg} borderColor={amtInputBorder} color={headingColor} />
                </HStack>
                <HStack spacing={2} mb={3}>
                  {['+$1', '+$5', '+$10', '+$100'].map(v => (
                    <Box key={v} px={2} py={1} borderRadius="md" fontSize="11px" fontWeight="700"
                      bg={qtyBg} color={qtyColor} cursor="pointer"
                      border="1px solid" borderColor={qtyBorder}
                      _hover={{ borderColor: meta.color }}
                      onClick={() => setActiveBetAmt(a => String((parseFloat(a || '0') + parseFloat(v.replace('+$', ''))).toFixed(0)))}>
                      {v}
                    </Box>
                  ))}
                </HStack>
                <Button w="full" borderRadius="lg" fontWeight="800" size="md"
                  bg={activeBetSide === 'yes' ? '#22c55e' : '#ef4444'} color="white"
                  _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                  onClick={() => { onBetSuccess(activeBetSide); setActiveBetAmt(''); }}>
                  Buy {activeBetSide === 'yes' ? 'Yes' : 'No'}
                </Button>
                <Text fontSize="9px" color="gray.400" textAlign="center" mt={2}>
                  By trading, you agree to the Terms of Use
                </Text>
              </Box>

            </Box>
          ) : (
            <Box bg={betPanelBg} border="1px solid" borderColor={betPanelBorder} borderRadius="xl" p={6} textAlign="center">
              <Text fontSize="2xl" mb={2}>{meta.icon}</Text>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={1}>Select a market</Text>
              <Text fontSize="xs" color="gray.400">Click any market on the left to start predicting</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
