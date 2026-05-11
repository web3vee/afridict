import React, { useState } from 'react';
import {
  Box, HStack, VStack, Text, Button, Badge, Input,
  useColorMode, useColorModeValue, Divider,
} from '@chakra-ui/react';
const LOGO2 = '/mylogo2.png';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OrderBook from '../components/mentions/OrderBook';
import MentionChart from '../components/mentions/MentionChart';

interface Keyword {
  phrase: string;
  chance: number;
  trend?: number;
  yesOdds: number;
  noOdds: number;
  volume: string;
}

interface MentionDetail {
  flag: string;
  color: string;
  person: string;
  role: string;
  breadcrumb: string;
  question: string;
  date: string;
  isNew?: boolean;
  totalVolume: string;
  keywords: Keyword[];
}

const MENTION_DATA: Record<number, MentionDetail> = {
  1: {
    flag: '🇰🇪', color: '#4ade80',
    person: 'William Ruto', role: 'President of Kenya',
    breadcrumb: 'Mentions · Kenya',
    question: 'What will President William Ruto say about the Bomas Convention Centre?',
    date: 'May 2, 2026', isNew: false, totalVolume: '$12,450',
    keywords: [
      { phrase: 'Convention Centre',    chance: 74, trend: 12, yesOdds: 77, noOdds: 30, volume: '$2,140' },
      { phrase: 'Historic Achievement', chance: 45, trend: -3, yesOdds: 48, noOdds: 58, volume: '$890'  },
      { phrase: 'Infrastructure',       chance: 62,            yesOdds: 65, noOdds: 40, volume: '$1,320' },
      { phrase: 'Nairobi',              chance: 81, trend: 8,  yesOdds: 84, noOdds: 22, volume: '$3,100' },
      { phrase: 'Development Agenda',   chance: 55,            yesOdds: 58, noOdds: 48, volume: '$980'  },
      { phrase: 'Legacy Project',       chance: 39, trend: -6, yesOdds: 42, noOdds: 62, volume: '$640'  },
    ],
  },
  2: {
    flag: '🇳🇬', color: '#ffd700',
    person: 'Bola Tinubu', role: 'President of Nigeria',
    breadcrumb: 'Mentions · Nigeria',
    question: 'What will President Bola Tinubu say about economic reforms / fuel subsidy?',
    date: 'May 5, 2026', isNew: false, totalVolume: '$31,200',
    keywords: [
      { phrase: 'Subsidy Removal',     chance: 68, trend: 5,  yesOdds: 71, noOdds: 36, volume: '$5,800' },
      { phrase: 'Economic Reform',     chance: 71,            yesOdds: 74, noOdds: 32, volume: '$6,200' },
      { phrase: 'Inflation',           chance: 55, trend: -4, yesOdds: 58, noOdds: 48, volume: '$3,100' },
      { phrase: 'Foreign Investment',  chance: 48,            yesOdds: 51, noOdds: 55, volume: '$2,400' },
      { phrase: 'Palliative Measures', chance: 39, trend: -8, yesOdds: 42, noOdds: 63, volume: '$1,900' },
      { phrase: 'NNPC',                chance: 62, trend: 11, yesOdds: 65, noOdds: 41, volume: '$4,100' },
    ],
  },
  3: {
    flag: '🇳🇬', color: '#f472b6',
    person: 'Burna Boy', role: 'Afrobeats Artist',
    breadcrumb: 'Mentions · Music',
    question: 'What will Burna Boy say in his next major interview about Afrobeats?',
    date: 'May 7, 2026', isNew: true, totalVolume: '$9,870',
    keywords: [
      { phrase: 'African Giant',  chance: 77, trend: 14, yesOdds: 80, noOdds: 27, volume: '$2,900' },
      { phrase: 'Grammy',         chance: 63,            yesOdds: 66, noOdds: 40, volume: '$1,800' },
      { phrase: 'Global Music',   chance: 58, trend: 3,  yesOdds: 61, noOdds: 45, volume: '$1,400' },
      { phrase: 'Lagos',          chance: 71, trend: 7,  yesOdds: 74, noOdds: 32, volume: '$2,100' },
      { phrase: 'Colonialism',    chance: 42,            yesOdds: 45, noOdds: 61, volume: '$820'  },
      { phrase: 'World Tour',     chance: 35, trend: -5, yesOdds: 38, noOdds: 68, volume: '$640'  },
    ],
  },
  4: {
    flag: '🇿🇦', color: '#60a5fa',
    person: 'Cyril Ramaphosa', role: 'President of South Africa',
    breadcrumb: 'Mentions · South Africa',
    question: 'What will President Cyril Ramaphosa say about Palestine / global issues?',
    date: 'May 8, 2026', isNew: false, totalVolume: '$22,100',
    keywords: [
      { phrase: 'Ceasefire',           chance: 79, trend: 18, yesOdds: 82, noOdds: 25, volume: '$5,400' },
      { phrase: 'Palestine',           chance: 88,            yesOdds: 91, noOdds: 14, volume: '$7,200' },
      { phrase: 'International Court', chance: 65, trend: 4,  yesOdds: 68, noOdds: 38, volume: '$3,100' },
      { phrase: 'Two-State Solution',  chance: 54,            yesOdds: 57, noOdds: 49, volume: '$2,200' },
      { phrase: 'Solidarity',          chance: 71, trend: 9,  yesOdds: 74, noOdds: 32, volume: '$3,800' },
      { phrase: 'Sanctions',           chance: 38, trend: -7, yesOdds: 41, noOdds: 65, volume: '$1,400' },
    ],
  },
  5: {
    flag: '🇬🇭', color: '#34d399',
    person: 'John Mahama', role: 'President of Ghana',
    breadcrumb: 'Mentions · Ghana',
    question: 'What will John Mahama say about Nigeria-Ghana relations?',
    date: 'May 10, 2026', isNew: true, totalVolume: '$7,640',
    keywords: [
      { phrase: 'ECOWAS',          chance: 67, trend: 6,  yesOdds: 70, noOdds: 36, volume: '$1,800' },
      { phrase: 'Trade Relations', chance: 71,            yesOdds: 74, noOdds: 32, volume: '$2,100' },
      { phrase: 'Integration',     chance: 58, trend: 2,  yesOdds: 61, noOdds: 45, volume: '$1,300' },
      { phrase: 'Nigeria',         chance: 83, trend: 11, yesOdds: 86, noOdds: 20, volume: '$2,900' },
      { phrase: 'Partnership',     chance: 62,            yesOdds: 65, noOdds: 41, volume: '$1,500' },
      { phrase: 'Free Trade Zone', chance: 34, trend: -9, yesOdds: 37, noOdds: 69, volume: '$610'  },
    ],
  },
  6: {
    flag: '🌍', color: '#f97316',
    person: 'AFCON Official', role: 'CAF Representative',
    breadcrumb: 'Mentions · AFCON',
    question: 'What will a top AFCON official say about the Senegal-Morocco hosting drama?',
    date: 'May 12, 2026', isNew: false, totalVolume: '$18,930',
    keywords: [
      { phrase: 'Hosting Rights',  chance: 74, trend: 10, yesOdds: 77, noOdds: 30, volume: '$4,200' },
      { phrase: 'FIFA',            chance: 68,            yesOdds: 71, noOdds: 36, volume: '$3,500' },
      { phrase: 'Senegal',         chance: 79, trend: 8,  yesOdds: 82, noOdds: 25, volume: '$4,800' },
      { phrase: 'Morocco',         chance: 72,            yesOdds: 75, noOdds: 31, volume: '$3,900' },
      { phrase: 'Controversy',     chance: 55, trend: -3, yesOdds: 58, noOdds: 48, volume: '$2,100' },
      { phrase: 'Final Decision',  chance: 41, trend: -5, yesOdds: 44, noOdds: 62, volume: '$1,500' },
    ],
  },
};

const RELATED = [
  { title: 'What will Ruto say about Nairobi?',          chance: 61 },
  { title: 'Will Tinubu address ECOWAS summit?',         chance: 74 },
  { title: 'What will Ramaphosa say at the UN?',         chance: 55 },
];

/* ── helpers ── */
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

function makeGraphPath(chance: number): string {
  const W = 400, H = 120;
  const toY = (pct: number) => H - ((pct - 40) / 55) * H;
  const pts: [number, number][] = [
    [0,   chance - 22], [30,  chance - 25], [60,  chance - 20],
    [100, chance - 15], [140, chance - 10], [180, chance - 6 ],
    [220, chance - 8 ], [260, chance + 3 ], [290, chance - 2 ],
    [310, chance + 5 ], [340, chance + 2 ], [370, chance - 1 ],
    [400, chance      ],
  ];
  const d = pts.map(([x, p], i) => {
    const y = toY(Math.max(40, Math.min(95, p)));
    return i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }).join(' ');
  const fill = pts.map(([x, p], i) => {
    const y = toY(Math.max(40, Math.min(95, p)));
    return i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }).join(' ') + ` L${W},${H} L0,${H} Z`;
  return JSON.stringify({ line: d, fill, lastX: 400, lastY: toY(chance) });
}

type Tab = 'orderbook' | 'graph' | 'resolution';

export default function MentionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerBetSplash } = useApp();

  const market = MENTION_DATA[Number(id)];

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab]     = useState<Tab>('orderbook');
  const [side, setSide]               = useState<'yes' | 'no'>('yes');
  const [amount, setAmount]           = useState('');

  const { colorMode } = useColorMode();
  const pageBg       = useColorModeValue('#f8fafc', '#070b14');
  const cardBg       = useColorModeValue('white',   '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const hoverBg      = useColorModeValue('gray.50', 'rgba(255,255,255,.04)');
  const expandedBg   = useColorModeValue('gray.50', '#0d1219');
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');
  const labelColor   = useColorModeValue('gray.700','#e2e8f0');
  const inputBg      = useColorModeValue('gray.100','#0f1623');
  const quickBtnBg   = useColorModeValue('gray.100','#1e293b');
  const quickBtnColor= useColorModeValue('gray.700','#94a3b8');
  const dividerColor = useColorModeValue('#e2e8f0', '#1e293b');
  const tableHdr = useColorModeValue('gray.400','#64748b');
  const avatarBg = useColorModeValue('gray.100','#1e293b');
  const askColor = '#ef4444';
  const bidColor = '#22c55e';

  if (!market) { navigate('/mentions'); return null; }

  const tradingKw = expandedIdx !== null ? market.keywords[expandedIdx] : market.keywords[0];
  const price = side === 'yes' ? tradingKw.yesOdds : tradingKw.noOdds;
  const potentialWin = amount ? ((Number(amount) / (price / 100)) - Number(amount)).toFixed(2) : '0.00';

  const handleKeywordClick = (i: number) => {
    if (expandedIdx === i) { setExpandedIdx(null); return; }
    setExpandedIdx(i);
    setActiveTab('orderbook');
  };

  const handleTrade = () => {
    if (!amount || Number(amount) <= 0) return;
    triggerBetSplash(side);
    setAmount('');
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'orderbook',  label: 'Order Book'  },
    { key: 'graph',      label: 'Graph'       },
    { key: 'resolution', label: 'Resolution'  },
  ];

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={8}>

        {/* Breadcrumb */}
        <HStack spacing={2} mb={4} fontSize="sm" color={mutedColor}>
          <Text cursor="pointer" _hover={{ color: '#ffd700' }} onClick={() => navigate('/mentions')}>Mentions</Text>
          <Text>›</Text>
          <Text color={labelColor}>{market.breadcrumb.split('· ')[1]}</Text>
        </HStack>

        {/* Title row */}
        <HStack spacing={3} mb={2} align="start">
          <Box w="52px" h="52px" borderRadius="lg" flexShrink={0} bg={avatarBg}
            display="flex" alignItems="center" justifyContent="center"
            fontSize="1.9rem" border="2px solid" borderColor={market.color + '44'}>
            {market.flag}
          </Box>
          <Box flex={1}>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={headingColor} lineHeight="1.3">
              {market.question}
            </Text>
            <HStack mt={1.5} spacing={3} flexWrap="wrap">
              {market.isNew && <Badge colorScheme="yellow" fontSize="10px">✦ NEW</Badge>}
              <Text fontSize="xs" color={mutedColor}>📅 {market.date}</Text>
              <Text fontSize="xs" color={mutedColor}>· {market.totalVolume} Vol.</Text>
            </HStack>
          </Box>
          {/* Afridict watermark */}
          <HStack spacing={1.5} opacity={0.45} flexShrink={0} display={{ base: 'none', md: 'flex' }}>
            <img src={LOGO2} alt="Afridict" style={{ width: 18, height: 18, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
            <Text fontSize="sm" fontWeight="800" color={headingColor} letterSpacing="tight">Afridict</Text>
          </HStack>
        </HStack>

        <Divider borderColor={dividerColor} my={6} />

        {/* Main: keyword list + trading panel */}
        <HStack spacing={6} align="start" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>

          {/* ── Left: keyword list ── */}
          <Box flex={1} minW={0}>
            <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">

              {/* Table header */}
              <HStack px={5} py={3} bg={useColorModeValue('gray.50','#0d1219')}
                borderBottom="1px solid" borderColor={dividerColor}>
                <Text flex={1} fontSize="xs" fontWeight="700" color={tableHdr} textTransform="uppercase">Phrase</Text>
                <Text w="70px" fontSize="xs" fontWeight="700" color={tableHdr} textTransform="uppercase" textAlign="right">Chance</Text>
                <Text w="70px" fontSize="xs" fontWeight="700" color={tableHdr} textTransform="uppercase" textAlign="right" display={{ base: 'none', md: 'block' }}>Vol.</Text>
                <Box w="170px" />
              </HStack>

              {market.keywords.map((kw, i) => {
                const ob = makeOrderBook(kw.yesOdds);
                const graphData = JSON.parse(makeGraphPath(kw.chance));
                const isExpanded = expandedIdx === i;

                return (
                  <Box key={kw.phrase}>
                    {i > 0 && <Box h="1px" bg={dividerColor} />}

                    {/* Keyword row */}
                    <HStack px={5} py={4} spacing={3}
                      bg={isExpanded ? useColorModeValue('yellow.50','rgba(255,215,0,.04)') : 'transparent'}
                      _hover={{ bg: isExpanded ? undefined : hoverBg }} transition="background .15s"
                      cursor="pointer" onClick={() => handleKeywordClick(i)}
                    >
                      <Text flex={1} fontSize="sm" fontWeight="600" color={headingColor}>{kw.phrase}</Text>

                      <HStack w="70px" justify="flex-end" spacing={1}>
                        <Text fontSize="sm" fontWeight="700" color={headingColor}>{kw.chance}%</Text>
                        {kw.trend !== undefined && (
                          <Text fontSize="10px" fontWeight="700"
                            color={kw.trend > 0 ? bidColor : askColor}>
                            {kw.trend > 0 ? `▲${kw.trend}` : `▼${Math.abs(kw.trend)}`}
                          </Text>
                        )}
                      </HStack>

                      <Text w="70px" fontSize="xs" color={mutedColor} textAlign="right"
                        display={{ base: 'none', md: 'block' }}>{kw.volume}</Text>

                      <HStack w="170px" spacing={2}>
                        <Button size="xs" flex={1} borderRadius="lg" fontWeight="700"
                          bg="#dcfce7" color="#16a34a" border="1px solid" borderColor="#4ade8044"
                          _hover={{ bg: '#4ade80', color: 'white' }} transition="all .15s"
                          onClick={e => { e.stopPropagation(); setExpandedIdx(i); setSide('yes'); }}
                        >Buy Yes {kw.yesOdds}¢</Button>
                        <Button size="xs" flex={1} borderRadius="lg" fontWeight="700"
                          bg="#fee2e2" color="#dc2626" border="1px solid" borderColor="#f8717144"
                          _hover={{ bg: '#f87171', color: 'white' }} transition="all .15s"
                          onClick={e => { e.stopPropagation(); setExpandedIdx(i); setSide('no'); }}
                        >Buy No {kw.noOdds}¢</Button>
                      </HStack>
                    </HStack>

                    {/* ── Expanded panel ── */}
                    {isExpanded && (
                      <Box bg={expandedBg} borderTop="1px solid" borderColor={dividerColor}>

                        {/* Tabs */}
                        <HStack px={5} pt={3} pb={0} spacing={0} position="relative">
                          {TABS.map(t => (
                            <Box key={t.key} px={4} py={2} cursor="pointer"
                              borderBottom="2px solid"
                              borderColor={activeTab === t.key ? '#ffd700' : 'transparent'}
                              onClick={() => setActiveTab(t.key)}>
                              <Text fontSize="sm" fontWeight={activeTab === t.key ? '700' : '500'}
                                color={activeTab === t.key ? headingColor : mutedColor}>
                                {t.label}
                              </Text>
                            </Box>
                          ))}
                          {/* Afridict watermark inside expanded panel */}
                          <HStack ml="auto" spacing={1} opacity={0.35} pr={2}>
                            <img src={LOGO2} alt="Afridict" style={{ width: 14, height: 14, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
                            <Text fontSize="xs" fontWeight="800" color={headingColor}>Afridict</Text>
                          </HStack>
                        </HStack>
                        <Box h="1px" bg={dividerColor} />

                        {/* ── Order Book ── */}
                        {activeTab === 'orderbook' && (
                          <Box py={2}>
                            <OrderBook
                              asks={ob.asks}
                              bids={ob.bids}
                              last={ob.last}
                              spread={ob.spread}
                            />
                          </Box>
                        )}

                        {/* ── Graph ── */}
                        {activeTab === 'graph' && (
                          <Box px={5} py={4}>
                            <MentionChart chance={kw.chance} trend={kw.trend} seed={i + 1} />
                          </Box>
                        )}

                        {/* ── Resolution ── */}
                        {activeTab === 'resolution' && (
                          <Box px={5} py={6}>
                            <HStack justify="space-between" flexWrap="wrap" gap={3}>
                              <Button size="sm" borderRadius="lg" fontWeight="700"
                                variant="outline" borderColor={borderColor} color={headingColor}
                                _hover={{ borderColor: '#ffd700', color: '#ffd700' }}>
                                Propose resolution
                              </Button>
                              <HStack spacing={1} cursor="pointer"
                                _hover={{ color: '#ffd700' }} color={mutedColor} transition="color .15s">
                                <Text fontSize="sm" fontWeight="600">View details</Text>
                                <Text fontSize="sm">↗</Text>
                              </HStack>
                            </HStack>
                            <Text fontSize="xs" color={mutedColor} mt={4} lineHeight="1.7">
                              This market resolves YES if the phrase <Text as="span" fontWeight="700" color={headingColor}>"{kw.phrase}"</Text> is
                              said by {market.person} in a verified public statement before {market.date}.
                              Resolution is determined by Afridict moderators within 24 hours of the event.
                            </Text>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Right: trading panel ── */}
          <Box w={{ base: 'full', lg: '290px' }} flexShrink={0}>
            <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">

              {/* Person header */}
              <HStack px={4} py={3} borderBottom="1px solid" borderColor={dividerColor} spacing={3}>
                <Box w={9} h={9} borderRadius="lg" bg={avatarBg}
                  display="flex" alignItems="center" justifyContent="center" fontSize="1.2rem"
                  border="2px solid" borderColor={market.color + '44'}>
                  {market.flag}
                </Box>
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight="700" color={headingColor} isTruncated>{tradingKw.phrase}</Text>
                  <Text fontSize="10px" color={mutedColor}>{market.person}</Text>
                </Box>
              </HStack>

              <Box px={4} py={4}>
                {/* Buy / Sell tabs + Market label */}
                <HStack mb={4} justify="space-between">
                  <HStack spacing={0}>
                    {(['Buy','Sell'] as const).map((tab, ti) => (
                      <Text key={tab} fontSize="sm" fontWeight="700" px={2} pb={1}
                        color={ti === 0 ? headingColor : mutedColor}
                        borderBottom={ti === 0 ? '2px solid #ffd700' : 'none'}
                        cursor="pointer">{tab}</Text>
                    ))}
                  </HStack>
                  <HStack spacing={1} bg={inputBg} px={2} py={1} borderRadius="md" cursor="pointer">
                    <Text fontSize="xs" color={mutedColor} fontWeight="600">Market</Text>
                    <Text fontSize="xs" color={mutedColor}>▾</Text>
                  </HStack>
                </HStack>

                {/* Yes / No price buttons */}
                <HStack mb={4} spacing={2}>
                  <Button flex={1} size="sm" borderRadius="lg" fontWeight="700"
                    bg={side === 'yes' ? '#4ade80' : inputBg}
                    color={side === 'yes' ? 'gray.900' : mutedColor}
                    _hover={{ opacity: .9 }} transition="all .15s"
                    onClick={() => setSide('yes')}
                  >Yes {tradingKw.yesOdds}¢</Button>
                  <Button flex={1} size="sm" borderRadius="lg" fontWeight="700"
                    bg={side === 'no' ? '#f87171' : inputBg}
                    color={side === 'no' ? 'white' : mutedColor}
                    _hover={{ opacity: .9 }} transition="all .15s"
                    onClick={() => setSide('no')}
                  >No {tradingKw.noOdds}¢</Button>
                </HStack>

                {/* Amount */}
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" fontWeight="600" color={mutedColor}>Amount</Text>
                  <Text fontSize="lg" fontWeight="800" color={headingColor}>
                    ${amount || '0'}
                  </Text>
                </HStack>
                <HStack mb={3} bg={inputBg} borderRadius="lg" px={3} py={2}
                  border="1px solid" borderColor={borderColor}>
                  <Text fontSize="sm" color={mutedColor} fontWeight="700">$</Text>
                  <Input variant="unstyled" fontSize="md" fontWeight="700" color={headingColor}
                    placeholder="0" value={amount}
                    onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
                </HStack>

                {/* Quick amounts */}
                <HStack mb={4} spacing={2}>
                  {[1, 5, 10, 100].map(v => (
                    <Button key={v} size="xs" flex={1} borderRadius="md"
                      bg={quickBtnBg} color={quickBtnColor} fontWeight="700"
                      _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
                      border="1px solid" borderColor={borderColor}
                      onClick={() => setAmount(String((Number(amount) || 0) + v))}
                    >+${v}</Button>
                  ))}
                </HStack>

                {Number(amount) > 0 && (
                  <HStack justify="space-between" mb={3} px={1}>
                    <Text fontSize="xs" color={mutedColor}>Potential win</Text>
                    <Text fontSize="sm" fontWeight="800" color={bidColor}>+${potentialWin}</Text>
                  </HStack>
                )}

                <Button w="full" borderRadius="xl" fontWeight="800" size="md"
                  bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                  _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                  onClick={handleTrade}>Trade</Button>

                <Text fontSize="9px" color={mutedColor} textAlign="center" mt={2}>
                  By trading, you agree to the{' '}
                  <Text as="span" color="#ffd700" cursor="pointer">Terms of Use</Text>
                </Text>
              </Box>
            </Box>

            {/* Related mentions */}
            <Box mt={4} bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
              <HStack px={4} pt={4} pb={2} spacing={2} flexWrap="wrap">
                {(['All','Mentions','Africa'] as const).map((t, ti) => (
                  <Box key={t} px={3} py={1} borderRadius="full" cursor="pointer"
                    bg={ti === 0 ? useColorModeValue('gray.200','#1e293b') : 'transparent'}
                    border="1px solid" borderColor={ti === 0 ? 'transparent' : borderColor}>
                    <Text fontSize="xs" fontWeight="700"
                      color={ti === 0 ? headingColor : mutedColor}>{t}</Text>
                  </Box>
                ))}
              </HStack>
              {RELATED.map((r, i) => (
                <Box key={i}>
                  {i > 0 && <Box h="1px" bg={dividerColor} />}
                  <HStack px={4} py={3} _hover={{ bg: hoverBg }} cursor="pointer" transition="bg .15s" spacing={3}>
                    <Box w={7} h={7} borderRadius="md" bg={avatarBg}
                      display="flex" alignItems="center" justifyContent="center" fontSize="0.9rem" flexShrink={0}>
                      🌍
                    </Box>
                    <Text flex={1} fontSize="xs" fontWeight="600" color={headingColor} lineHeight="1.4">{r.title}</Text>
                    <Text fontSize="sm" fontWeight="800" color={headingColor} flexShrink={0}>{r.chance}%</Text>
                  </HStack>
                </Box>
              ))}
            </Box>
          </Box>

        </HStack>
      </Box>
    </Box>
  );
}
