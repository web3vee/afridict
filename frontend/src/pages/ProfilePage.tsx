import React from 'react';
import {
  Box, HStack, Text, VStack, useColorModeValue,
  SimpleGrid, Button,
} from '@chakra-ui/react';
import {
  Edit3, TrendingUp, Target, Zap, Calendar,
  Wallet, CheckCircle2, Lock, BarChart2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Achievement definitions ────────────────────────────────────────────────────

interface Achievement {
  id: string;
  label: string;
  desc: string;
  emoji: string;
  color: string;
  bg: string;
  unlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    label: 'First Blood',
    desc: 'Placed your first prediction',
    emoji: '🩸',
    color: '#f87171',
    bg: '#f8717122',
    unlocked: true,
  },
  {
    id: 'hot_streak',
    label: 'Hot Streak',
    desc: '50 correct predictions in a row',
    emoji: '🔥',
    color: '#f97316',
    bg: '#f9731622',
    unlocked: false,
  },
  {
    id: 'market_maker',
    label: 'Market Maker',
    desc: 'Made 10+ predictions total',
    emoji: '📊',
    color: '#3b82f6',
    bg: '#3b82f622',
    unlocked: true,
  },
  {
    id: 'prophet',
    label: 'Prophet',
    desc: 'Reached >60% accuracy',
    emoji: '🔮',
    color: '#a78bfa',
    bg: '#a78bfa22',
    unlocked: false,
  },
  {
    id: 'whale',
    label: 'Whale',
    desc: 'Placed a bet over $10,000',
    emoji: '🐋',
    color: '#60a5fa',
    bg: '#60a5fa22',
    unlocked: false,
  },
  {
    id: 'africa_rising',
    label: 'Africa Rising',
    desc: 'Predicted on 20 different countries',
    emoji: '🌍',
    color: '#4ade80',
    bg: '#4ade8022',
    unlocked: true,
  },
];

// ── Category breakdown ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Elections', count: 8,  color: '#f87171' },
  { label: 'Sports',    count: 6,  color: '#fb923c' },
  { label: 'Economy',   count: 5,  color: '#fbbf24' },
  { label: 'Politics',  count: 4,  color: '#4ade80' },
  { label: 'Music',     count: 3,  color: '#60a5fa' },
  { label: 'Crypto',    count: 2,  color: '#a78bfa' },
  { label: 'Security',  count: 1,  color: '#94a3b8' },
];

const TOTAL_CATS = CATEGORIES.reduce((s, c) => s + c.count, 0);

// ── Recent activity ────────────────────────────────────────────────────────────

interface ActivityItem {
  id: number;
  title: string;
  side: 'YES' | 'NO';
  result: 'WIN' | 'LOSS' | 'PENDING';
  amount: number;
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 1, title: 'Will Nigeria qualify for 2026 World Cup?',       side: 'YES', result: 'WIN',     amount: 24.50  },
  { id: 2, title: 'Will the Naira strengthen below ₦1,500/USD?',    side: 'NO',  result: 'LOSS',    amount: -15.00 },
  { id: 3, title: 'Will Burna Boy win a Grammy in 2026?',            side: 'YES', result: 'PENDING', amount: 0      },
  { id: 4, title: 'Will South Africa GDP grow above 2% in 2026?',   side: 'YES', result: 'WIN',     amount: 18.75  },
  { id: 5, title: 'Will AFCON 2026 have 32 teams?',                  side: 'NO',  result: 'PENDING', amount: 0      },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function resultColor(result: ActivityItem['result']): string {
  if (result === 'WIN')     return '#4ade80';
  if (result === 'LOSS')    return '#f87171';
  return '#fbbf24';
}

function resultBg(result: ActivityItem['result']): string {
  if (result === 'WIN')     return '#4ade8020';
  if (result === 'LOSS')    return '#f8717120';
  return '#fbbf2420';
}

function sideBg(side: 'YES' | 'NO'): string {
  return side === 'YES' ? '#4ade8020' : '#f8717120';
}

function sideColor(side: 'YES' | 'NO'): string {
  return side === 'YES' ? '#4ade80' : '#f87171';
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { displayName, displayPhoto, displayAddress } = useApp();

  const pageBg       = useColorModeValue('#f8fafc',  '#070b14');
  const cardBg       = useColorModeValue('#ffffff',  '#0f172a');
  const borderColor  = useColorModeValue('#e2e8f0',  '#1e293b');
  const headingColor = useColorModeValue('#0f172a',  '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b',  '#94a3b8');
  const subtleBg     = useColorModeValue('#f8fafc',  '#111827');
  const rowHover     = useColorModeValue('#f1f5f9',  '#1e293b');

  const initials = (displayName || displayAddress || 'U')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 2)
    .toUpperCase() || 'WV';

  const shortAddress = displayAddress
    ? displayAddress.slice(0, 6) + '...' + displayAddress.slice(-4)
    : '0x3f8a...d92e';

  return (
    <Box bg={pageBg} minH="100vh" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="900px" mx="auto">

        {/* ── Profile header ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          p={{ base: 5, md: 7 }}
          mb={6}
          position="relative"
          overflow="hidden"
        >
          {/* Background gradient */}
          <Box
            position="absolute"
            top={0} left={0} right={0}
            h="120px"
            bg="linear-gradient(135deg,#4ade8015,#60a5fa15,#a78bfa10)"
            pointerEvents="none"
          />

          <HStack
            align={{ base: 'flex-start', sm: 'center' }}
            justify="space-between"
            flexWrap="wrap"
            gap={4}
            position="relative"
          >
            <HStack spacing={5} align="center">
              {/* Avatar */}
              {displayPhoto ? (
                <Box
                  w="80px" h="80px"
                  borderRadius="full"
                  overflow="hidden"
                  border="3px solid"
                  borderColor={borderColor}
                  flexShrink={0}
                >
                  <img
                    src={displayPhoto}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ) : (
                <Box
                  w="80px" h="80px"
                  borderRadius="full"
                  bg="linear-gradient(135deg,#4ade80,#60a5fa,#a78bfa)"
                  display="flex" alignItems="center" justifyContent="center"
                  border="3px solid"
                  borderColor={borderColor}
                  boxShadow="0 0 24px rgba(96,165,250,0.25)"
                  flexShrink={0}
                >
                  <Text fontSize="2xl" fontWeight="900" color="white">{initials}</Text>
                </Box>
              )}

              {/* Name & meta */}
              <Box>
                <HStack spacing={2} mb={1} flexWrap="wrap">
                  <Text fontSize="xl" fontWeight="900" color={headingColor} lineHeight="1.2">
                    {displayName || 'web3vee'}
                  </Text>
                  <Box
                    px={2} py={0.5}
                    borderRadius="full"
                    bg="#ffd70022"
                    border="1px solid #ffd70044"
                  >
                    <Text fontSize="10px" fontWeight="800" color="#ffd700">🇳🇬 Nigeria</Text>
                  </Box>
                </HStack>

                <HStack spacing={3} flexWrap="wrap" gap={2}>
                  <HStack spacing={1.5}>
                    <Wallet size={13} strokeWidth={2} color={mutedColor} />
                    <Text fontSize="xs" color={mutedColor} fontFamily="mono">
                      {shortAddress}
                    </Text>
                  </HStack>
                  <Box w="3px" h="3px" borderRadius="full" bg={mutedColor} />
                  <HStack spacing={1.5}>
                    <Calendar size={13} strokeWidth={2} color={mutedColor} />
                    <Text fontSize="xs" color={mutedColor}>Joined Jan 2026</Text>
                  </HStack>
                </HStack>
              </Box>
            </HStack>

            {/* Edit button */}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Edit3 size={13} strokeWidth={2} />}
              borderColor={borderColor}
              color={headingColor}
              fontWeight="700"
              borderRadius="lg"
              _hover={{ bg: subtleBg }}
            >
              Edit Profile
            </Button>
          </HStack>
        </Box>

        {/* ── Stats row ── */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          {[
            {
              icon: BarChart2,
              label: 'Total Predicted',
              value: '29',
              sub: 'predictions made',
              color: '#60a5fa',
            },
            {
              icon: Target,
              label: 'Accuracy',
              value: '56%',
              sub: 'prediction accuracy',
              color: '#4ade80',
            },
            {
              icon: TrendingUp,
              label: 'Total Profit',
              value: '$650',
              sub: 'lifetime earnings',
              color: '#ffd700',
            },
            {
              icon: Zap,
              label: 'Current Streak',
              value: '🔥1',
              sub: 'predictions correct',
              color: '#f97316',
            },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <Box
              key={label}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="2xl"
              p={5}
            >
              <Box
                w={10} h={10}
                borderRadius="xl"
                bg={`${color}18`}
                display="flex" alignItems="center" justifyContent="center"
                mb={3}
              >
                <Icon size={18} strokeWidth={2} color={color} />
              </Box>
              <Text fontSize="2xl" fontWeight="900" color={headingColor} lineHeight="1.1" mb={0.5}>
                {value}
              </Text>
              <Text fontSize="xs" color={mutedColor} fontWeight="600">{label}</Text>
              <Text fontSize="10px" color={mutedColor} mt={0.5}>{sub}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* ── Achievements ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          p={6}
          mb={6}
        >
          <HStack justify="space-between" mb={5}>
            <VStack align="flex-start" spacing={0.5}>
              <Text fontSize="md" fontWeight="800" color={headingColor}>Achievements</Text>
              <Text fontSize="xs" color={mutedColor}>
                {ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length} unlocked
              </Text>
            </VStack>
            <Box
              px={2.5} py={1}
              borderRadius="lg"
              bg={subtleBg}
              border="1px solid"
              borderColor={borderColor}
            >
              <Text fontSize="xs" fontWeight="700" color={mutedColor}>
                {ACHIEVEMENTS.filter(a => a.unlocked).length} badges
              </Text>
            </Box>
          </HStack>

          <SimpleGrid columns={{ base: 2, sm: 3, md: 3 }} spacing={3}>
            {ACHIEVEMENTS.map(ach => (
              <Box
                key={ach.id}
                p={4}
                borderRadius="xl"
                border="1px solid"
                borderColor={ach.unlocked ? `${ach.color}44` : borderColor}
                bg={ach.unlocked ? ach.bg : subtleBg}
                opacity={ach.unlocked ? 1 : 0.55}
                transition="all 0.15s"
                _hover={{ opacity: 1, transform: ach.unlocked ? 'translateY(-1px)' : 'none' }}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="1.5rem" lineHeight="1">
                    {ach.unlocked ? ach.emoji : '🔒'}
                  </Text>
                  {ach.unlocked ? (
                    <CheckCircle2 size={14} strokeWidth={2} color={ach.color} />
                  ) : (
                    <Lock size={14} strokeWidth={2} color={mutedColor} />
                  )}
                </HStack>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color={ach.unlocked ? headingColor : mutedColor}
                  mb={0.5}
                >
                  {ach.label}
                </Text>
                <Text fontSize="11px" color={mutedColor} lineHeight="1.4">
                  {ach.desc}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* ── Category breakdown ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          p={6}
          mb={6}
        >
          <HStack justify="space-between" mb={5}>
            <VStack align="flex-start" spacing={0.5}>
              <Text fontSize="md" fontWeight="800" color={headingColor}>Category Breakdown</Text>
              <Text fontSize="xs" color={mutedColor}>{TOTAL_CATS} predictions across all categories</Text>
            </VStack>
          </HStack>

          <VStack spacing={3} align="stretch">
            {CATEGORIES.map(cat => {
              const pct = Math.round((cat.count / TOTAL_CATS) * 100);
              return (
                <Box key={cat.label}>
                  <HStack justify="space-between" mb={1.5}>
                    <Text fontSize="sm" fontWeight="600" color={headingColor}>{cat.label}</Text>
                    <HStack spacing={2}>
                      <Text fontSize="xs" color={mutedColor}>{cat.count} bets</Text>
                      <Text fontSize="xs" fontWeight="700" color={cat.color}>{pct}%</Text>
                    </HStack>
                  </HStack>
                  <Box h="8px" bg={subtleBg} borderRadius="full" overflow="hidden">
                    <Box
                      h="full"
                      w={`${pct}%`}
                      bg={`linear-gradient(90deg,${cat.color}cc,${cat.color}88)`}
                      borderRadius="full"
                      transition="width 0.4s ease"
                    />
                  </Box>
                </Box>
              );
            })}
          </VStack>
        </Box>

        {/* ── Recent activity ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          overflow="hidden"
        >
          <Box px={6} py={4} borderBottom="1px solid" borderColor={borderColor}>
            <Text fontSize="md" fontWeight="800" color={headingColor}>Recent Activity</Text>
            <Text fontSize="xs" color={mutedColor}>Last 5 predictions</Text>
          </Box>

          {RECENT_ACTIVITY.map((item, idx) => (
            <Box key={item.id}>
              {idx > 0 && <Box h="1px" bg={borderColor} />}
              <Box
                px={6} py={4}
                _hover={{ bg: rowHover }}
                transition="bg 0.12s"
                cursor="default"
              >
                <HStack justify="space-between" flexWrap="wrap" gap={3}>
                  {/* Title + badges */}
                  <Box flex={1} minW="200px">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={headingColor}
                      noOfLines={2}
                      lineHeight="1.4"
                      mb={2}
                    >
                      {item.title}
                    </Text>
                    <HStack spacing={2}>
                      {/* Side pill */}
                      <Box
                        px={2.5} py={0.5}
                        borderRadius="full"
                        bg={sideBg(item.side)}
                        border={`1px solid ${sideColor(item.side)}44`}
                      >
                        <Text fontSize="10px" fontWeight="800" color={sideColor(item.side)}>
                          {item.side}
                        </Text>
                      </Box>
                      {/* Result pill */}
                      <Box
                        px={2.5} py={0.5}
                        borderRadius="full"
                        bg={resultBg(item.result)}
                        border={`1px solid ${resultColor(item.result)}44`}
                      >
                        <Text fontSize="10px" fontWeight="800" color={resultColor(item.result)}>
                          {item.result}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  {/* Profit / loss */}
                  <Box textAlign="right" flexShrink={0}>
                    {item.result === 'PENDING' ? (
                      <Text fontSize="sm" fontWeight="700" color={mutedColor}>Pending</Text>
                    ) : (
                      <Text
                        fontSize="md"
                        fontWeight="900"
                        color={item.amount >= 0 ? '#4ade80' : '#f87171'}
                      >
                        {item.amount >= 0 ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Box>
            </Box>
          ))}

          {/* Footer */}
          <Box
            px={6} py={3.5}
            borderTop="1px solid"
            borderColor={borderColor}
            bg={subtleBg}
            textAlign="center"
          >
            <Text fontSize="xs" color={mutedColor} fontWeight="600">
              Showing last 5 of 29 predictions
            </Text>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
