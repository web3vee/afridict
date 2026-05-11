import React, { useState } from 'react';
import {
  Box, HStack, Text, VStack, useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import { Trophy, TrendingUp, Target, Zap, Globe } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Player {
  rank: number;
  username: string;
  flag: string;
  country: string;
  predictions: number;
  accuracy: number;
  profit: number;
  streak: number;
  isYou?: boolean;
}

// ── Mock data sets ─────────────────────────────────────────────────────────────

const ALL_TIME: Player[] = [
  { rank: 1,  username: 'cryptoking_ng', flag: '🇳🇬', country: 'Nigeria',   predictions: 142, accuracy: 73, profit: 4820, streak: 12 },
  { rank: 2,  username: 'zara.eth',      flag: '🇿🇦', country: 'S. Africa', predictions: 98,  accuracy: 74, profit: 3640, streak: 8  },
  { rank: 3,  username: 'nairobi_bull',  flag: '🇰🇪', country: 'Kenya',     predictions: 115, accuracy: 69, profit: 2910, streak: 6  },
  { rank: 4,  username: 'accra_ace',     flag: '🇬🇭', country: 'Ghana',     predictions: 87,  accuracy: 68, profit: 2480, streak: 5  },
  { rank: 5,  username: 'afrobeats99',   flag: '🇳🇬', country: 'Nigeria',   predictions: 201, accuracy: 66, profit: 2150, streak: 4  },
  { rank: 6,  username: 'kigali_calls',  flag: '🇷🇼', country: 'Rwanda',    predictions: 63,  accuracy: 65, profit: 1890, streak: 7  },
  { rank: 7,  username: 'dakar_d',       flag: '🇸🇳', country: 'Senegal',   predictions: 79,  accuracy: 64, profit: 1720, streak: 3  },
  { rank: 8,  username: 'cairo_prophet', flag: '🇪🇬', country: 'Egypt',     predictions: 54,  accuracy: 63, profit: 1540, streak: 5  },
  { rank: 9,  username: 'lagos_lion',    flag: '🇳🇬', country: 'Nigeria',   predictions: 168, accuracy: 62, profit: 1380, streak: 2  },
  { rank: 10, username: 'eth_abiy',      flag: '🇪🇹', country: 'Ethiopia',  predictions: 41,  accuracy: 61, profit: 1240, streak: 4  },
  { rank: 11, username: 'lome_luck',     flag: '🇹🇬', country: 'Togo',      predictions: 93,  accuracy: 60, profit: 1100, streak: 1  },
  { rank: 12, username: 'kano_king',     flag: '🇳🇬', country: 'Nigeria',   predictions: 77,  accuracy: 59, profit: 980,  streak: 3  },
  { rank: 13, username: 'tunis_t',       flag: '🇹🇳', country: 'Tunisia',   predictions: 48,  accuracy: 58, profit: 870,  streak: 0  },
  { rank: 14, username: 'maputo_m',      flag: '🇲🇿', country: 'Mozambique',predictions: 35,  accuracy: 57, profit: 760,  streak: 2  },
  { rank: 15, username: 'web3vee',       flag: '🇳🇬', country: 'Nigeria',   predictions: 29,  accuracy: 56, profit: 650,  streak: 1,  isYou: true },
  { rank: 16, username: 'lusaka_leg',    flag: '🇿🇲', country: 'Zambia',    predictions: 62,  accuracy: 55, profit: 540,  streak: 0  },
  { rank: 17, username: 'addis_a',       flag: '🇪🇹', country: 'Ethiopia',  predictions: 29,  accuracy: 54, profit: 430,  streak: 0  },
  { rank: 18, username: 'windhoek_w',    flag: '🇳🇦', country: 'Namibia',   predictions: 44,  accuracy: 53, profit: 320,  streak: 0  },
  { rank: 19, username: 'bamako_bet',    flag: '🇲🇱', country: 'Mali',      predictions: 38,  accuracy: 52, profit: 210,  streak: 1  },
  { rank: 20, username: 'harare_h',      flag: '🇿🇼', country: 'Zimbabwe',  predictions: 27,  accuracy: 51, profit: 140,  streak: 0  },
];

// Month / week data — shuffled profit slice for variety
const THIS_MONTH: Player[] = ALL_TIME.map(p => ({
  ...p,
  predictions: Math.max(1, Math.round(p.predictions * 0.38)),
  profit: Math.round(p.profit * 0.41),
  streak: p.streak > 0 ? Math.max(1, p.streak - 2) : 0,
}));

const THIS_WEEK: Player[] = ALL_TIME.map(p => ({
  ...p,
  predictions: Math.max(1, Math.round(p.predictions * 0.12)),
  profit: Math.round(p.profit * 0.14),
  streak: p.streak > 3 ? p.streak - 3 : p.streak > 0 ? 1 : 0,
}));

const DATA_BY_PERIOD: Record<string, Player[]> = {
  'All Time':   ALL_TIME,
  'This Month': THIS_MONTH,
  'This Week':  THIS_WEEK,
};

const PERIODS = ['All Time', 'This Month', 'This Week'] as const;
type Period = typeof PERIODS[number];

// ── Helpers ────────────────────────────────────────────────────────────────────

function getBadge(rank: number): { label: string; bg: string; color: string } | null {
  if (rank <= 3)  return { label: 'ELITE',   bg: '#ffd70022', color: '#ffd700' };
  if (rank <= 8)  return { label: 'PRO',     bg: '#3b82f622', color: '#60a5fa' };
  if (rank <= 12) return { label: 'RISING',  bg: '#22c55e22', color: '#4ade80' };
  return null;
}

function getRankMedal(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

function getPodiumColor(rank: number): { ring: string; bg: string; text: string } {
  if (rank === 1) return { ring: '#ffd700', bg: 'linear-gradient(135deg,#ffd70033,#f59e0b22)', text: '#ffd700' };
  if (rank === 2) return { ring: '#94a3b8', bg: 'linear-gradient(135deg,#94a3b822,#64748b18)', text: '#94a3b8' };
  return           { ring: '#cd7f32', bg: 'linear-gradient(135deg,#cd7f3222,#a0522d18)', text: '#cd7f32' };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PodiumCard({
  player,
  height,
  headingColor,
  borderColor,
}: {
  player: Player;
  height: string;
  headingColor: string;
  borderColor: string;
}) {
  const colors = getPodiumColor(player.rank);
  const initials = player.username.slice(0, 2).toUpperCase();

  return (
    <VStack spacing={3} flex={1} align="center">
      {/* Avatar */}
      <Box position="relative">
        <Box
          w={player.rank === 1 ? '72px' : '58px'}
          h={player.rank === 1 ? '72px' : '58px'}
          borderRadius="full"
          bg="linear-gradient(135deg,#4ade80,#60a5fa)"
          border={`3px solid ${colors.ring}`}
          boxShadow={`0 0 20px ${colors.ring}55`}
          display="flex" alignItems="center" justifyContent="center"
          flexShrink={0}
        >
          <Text
            fontSize={player.rank === 1 ? 'xl' : 'md'}
            fontWeight="900"
            color="white"
          >
            {initials}
          </Text>
        </Box>
        <Box
          position="absolute"
          bottom="-6px"
          left="50%"
          transform="translateX(-50%)"
          fontSize={player.rank === 1 ? '1.4rem' : '1.1rem'}
          lineHeight="1"
        >
          {getRankMedal(player.rank)}
        </Box>
      </Box>

      {/* Name */}
      <VStack spacing={0.5} mt={2}>
        <Text
          fontSize={player.rank === 1 ? 'md' : 'sm'}
          fontWeight="800"
          color={headingColor}
          textAlign="center"
          maxW="120px"
          noOfLines={1}
        >
          {player.flag} {player.username}
        </Text>
        <Text
          fontSize="lg"
          fontWeight="900"
          color={colors.text}
        >
          ${player.profit.toLocaleString()}
        </Text>
        <Text fontSize="xs" color="#94a3b8">{player.accuracy}% acc</Text>
      </VStack>

      {/* Podium block */}
      <Box
        w="full"
        h={height}
        bg={colors.bg}
        border={`1px solid ${colors.ring}44`}
        borderRadius="xl xl 0 0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        <Text
          fontSize={player.rank === 1 ? '3xl' : '2xl'}
          fontWeight="900"
          color={colors.ring}
          opacity={0.35}
        >
          #{player.rank}
        </Text>
      </Box>
    </VStack>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('All Time');

  const pageBg      = useColorModeValue('#f8fafc',  '#070b14');
  const cardBg      = useColorModeValue('#ffffff',  '#0f172a');
  const borderColor = useColorModeValue('#e2e8f0',  '#1e293b');
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor  = useColorModeValue('#64748b',  '#94a3b8');
  const subtleBg    = useColorModeValue('#f8fafc',  '#111827');
  const rowHover    = useColorModeValue('#f1f5f9',  '#1e293b');
  const tabActiveBg = useColorModeValue('#0f172a',  '#f8fafc');
  const tabActiveText = useColorModeValue('#ffffff', '#0f172a');

  const players = DATA_BY_PERIOD[period];
  const podiumOrder = [players[1], players[0], players[2]]; // 2nd left, 1st center, 3rd right

  const yourEntry = players.find(p => p.isYou)!;

  return (
    <Box bg={pageBg} minH="100vh" px={{ base: 4, md: 8 }} py={8}>
      <Box maxW="1100px" mx="auto">

        {/* ── Header ── */}
        <HStack justify="space-between" align="flex-start" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="flex-start" spacing={1}>
            <HStack spacing={3}>
              <Box
                w={10} h={10} borderRadius="xl"
                bg="linear-gradient(135deg,#ffd700,#f59e0b)"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Trophy size={20} strokeWidth={2} color="#0f172a" />
              </Box>
              <Text fontSize="2xl" fontWeight="900" color={headingColor} letterSpacing="-0.5px">
                Leaderboard
              </Text>
            </HStack>
            <Text fontSize="sm" color={mutedColor}>
              Top African predictors ranked by profit
            </Text>
          </VStack>

          {/* Period tabs */}
          <HStack
            spacing={1}
            bg={subtleBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            p={1}
          >
            {PERIODS.map(p => (
              <Box
                key={p}
                px={4} py={2}
                borderRadius="lg"
                cursor="pointer"
                bg={period === p ? tabActiveBg : 'transparent'}
                color={period === p ? tabActiveText : mutedColor}
                fontWeight={period === p ? '700' : '500'}
                fontSize="sm"
                transition="all 0.15s"
                onClick={() => setPeriod(p)}
                _hover={{ bg: period === p ? tabActiveBg : rowHover }}
              >
                {p}
              </Box>
            ))}
          </HStack>
        </HStack>

        {/* ── Podium ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          p={{ base: 5, md: 8 }}
          mb={6}
          overflow="hidden"
          position="relative"
        >
          {/* Background glow */}
          <Box
            position="absolute"
            top={0} left="50%" transform="translateX(-50%)"
            w="60%" h="200px"
            bg="radial-gradient(ellipse at top, #ffd70012 0%, transparent 70%)"
            pointerEvents="none"
          />

          <Text
            fontSize="xs"
            fontWeight="700"
            color={mutedColor}
            textAlign="center"
            letterSpacing="0.08em"
            textTransform="uppercase"
            mb={6}
          >
            Top 3 Players — {period}
          </Text>

          <HStack align="flex-end" spacing={4} maxW="600px" mx="auto">
            {podiumOrder.map(player => (
              <PodiumCard
                key={player.rank}
                player={player}
                height={player.rank === 1 ? '80px' : player.rank === 2 ? '60px' : '44px'}
                headingColor={headingColor}
                borderColor={borderColor}
              />
            ))}
          </HStack>
        </Box>

        {/* ── Stats strip ── */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          {[
            { icon: Globe,     label: 'Countries',       value: '20+', color: '#60a5fa' },
            { icon: Target,    label: 'Avg Accuracy',    value: '61%', color: '#4ade80' },
            { icon: TrendingUp, label: 'Total Volume',   value: '$28K', color: '#ffd700' },
            { icon: Zap,       label: 'Active Streaks',  value: '14',  color: '#f87171' },
          ].map(({ icon: Icon, label, value, color }) => (
            <Box
              key={label}
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="xl"
              p={4}
            >
              <HStack spacing={3}>
                <Box
                  w={9} h={9} borderRadius="lg"
                  bg={`${color}18`}
                  display="flex" alignItems="center" justifyContent="center"
                  flexShrink={0}
                >
                  <Icon size={16} strokeWidth={2} color={color} />
                </Box>
                <Box>
                  <Text fontSize="xs" color={mutedColor} fontWeight="600">{label}</Text>
                  <Text fontSize="lg" fontWeight="900" color={headingColor} lineHeight="1.2">{value}</Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* ── Full table ── */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="2xl"
          overflow="hidden"
          mb={6}
        >
          {/* Table header */}
          <Box
            display="grid"
            gridTemplateColumns="52px 1fr 90px 90px 80px 100px 70px"
            px={5} py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={subtleBg}
          >
            {['Rank', 'Player', 'Country', 'Bets', 'Accuracy', 'Profit', 'Streak'].map(col => (
              <Text
                key={col}
                fontSize="11px"
                fontWeight="700"
                color={mutedColor}
                textTransform="uppercase"
                letterSpacing="0.07em"
              >
                {col}
              </Text>
            ))}
          </Box>

          {/* Table rows */}
          {players.map((player, idx) => {
            const badge = getBadge(player.rank);
            const isYou = player.isYou;
            return (
              <Box key={player.rank}>
                {idx > 0 && <Box h="1px" bg={borderColor} />}
                <Box
                  display="grid"
                  gridTemplateColumns="52px 1fr 90px 90px 80px 100px 70px"
                  px={5}
                  py={3.5}
                  bg={isYou ? 'rgba(255,215,0,0.04)' : 'transparent'}
                  _hover={{ bg: rowHover }}
                  transition="bg 0.12s"
                  cursor="default"
                  alignItems="center"
                >
                  {/* Rank */}
                  <HStack spacing={1}>
                    {player.rank <= 3 ? (
                      <Text fontSize="lg" lineHeight="1">{getRankMedal(player.rank)}</Text>
                    ) : (
                      <Text fontSize="sm" fontWeight="700" color={mutedColor}>
                        #{player.rank}
                      </Text>
                    )}
                  </HStack>

                  {/* Player */}
                  <HStack spacing={3}>
                    <Box
                      w="32px" h="32px"
                      borderRadius="full"
                      bg="linear-gradient(135deg,#4ade80,#60a5fa)"
                      border={isYou ? '2px solid #ffd700' : '2px solid transparent'}
                      display="flex" alignItems="center" justifyContent="center"
                      flexShrink={0}
                    >
                      <Text fontSize="11px" fontWeight="800" color="white">
                        {player.username.slice(0, 2).toUpperCase()}
                      </Text>
                    </Box>
                    <Box minW={0}>
                      <HStack spacing={2} flexWrap="wrap">
                        <Text
                          fontSize="sm"
                          fontWeight={isYou ? '800' : '600'}
                          color={isYou ? '#ffd700' : headingColor}
                          noOfLines={1}
                        >
                          {player.username}
                        </Text>
                        {isYou && (
                          <Box
                            px={1.5} py={0.5}
                            borderRadius="full"
                            bg="#ffd70022"
                            border="1px solid #ffd70055"
                          >
                            <Text fontSize="9px" fontWeight="800" color="#ffd700" lineHeight="1">
                              YOU
                            </Text>
                          </Box>
                        )}
                        {badge && (
                          <Box
                            px={1.5} py={0.5}
                            borderRadius="full"
                            bg={badge.bg}
                            border={`1px solid ${badge.color}44`}
                          >
                            <Text fontSize="9px" fontWeight="800" color={badge.color} lineHeight="1">
                              {badge.label}
                            </Text>
                          </Box>
                        )}
                      </HStack>
                    </Box>
                  </HStack>

                  {/* Country */}
                  <Text fontSize="sm" color={mutedColor}>
                    {player.flag} {player.country}
                  </Text>

                  {/* Predictions */}
                  <Text fontSize="sm" fontWeight="600" color={headingColor}>
                    {player.predictions}
                  </Text>

                  {/* Accuracy */}
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      color={player.accuracy >= 70 ? '#4ade80' : player.accuracy >= 65 ? '#60a5fa' : headingColor}
                    >
                      {player.accuracy}%
                    </Text>
                  </Box>

                  {/* Profit */}
                  <Text fontSize="sm" fontWeight="800" color="#4ade80">
                    +${player.profit.toLocaleString()}
                  </Text>

                  {/* Streak */}
                  <Text fontSize="sm" fontWeight="700" color={player.streak > 0 ? '#f97316' : mutedColor}>
                    {player.streak > 0 ? `🔥${player.streak}` : '—'}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* ── Your Position card ── */}
        <Box
          bg={cardBg}
          border="2px solid"
          borderColor="#ffd700"
          borderRadius="2xl"
          p={5}
          boxShadow="0 0 30px rgba(255,215,0,0.12)"
          position="relative"
          overflow="hidden"
        >
          {/* Background shimmer */}
          <Box
            position="absolute"
            inset={0}
            bg="radial-gradient(ellipse at left, #ffd70008 0%, transparent 60%)"
            pointerEvents="none"
          />

          <HStack justify="space-between" flexWrap="wrap" gap={4} position="relative">
            <HStack spacing={4}>
              <Box
                w={12} h={12}
                borderRadius="full"
                bg="linear-gradient(135deg,#4ade80,#60a5fa)"
                border="2px solid #ffd700"
                boxShadow="0 0 16px #ffd70044"
                display="flex" alignItems="center" justifyContent="center"
                flexShrink={0}
              >
                <Text fontSize="md" fontWeight="900" color="white">WV</Text>
              </Box>
              <Box>
                <HStack spacing={2} mb={0.5}>
                  <Text fontSize="md" fontWeight="900" color="#ffd700">
                    web3vee
                  </Text>
                  <Box px={2} py={0.5} borderRadius="full" bg="#ffd70022" border="1px solid #ffd70055">
                    <Text fontSize="10px" fontWeight="800" color="#ffd700">YOU</Text>
                  </Box>
                </HStack>
                <Text fontSize="sm" color={mutedColor}>
                  Your current position — keep climbing!
                </Text>
              </Box>
            </HStack>

            <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={5}>
              {[
                { label: 'Rank',       value: `#${yourEntry.rank}`,              color: '#ffd700' },
                { label: 'Predictions', value: String(yourEntry.predictions),    color: headingColor },
                { label: 'Accuracy',   value: `${yourEntry.accuracy}%`,          color: '#60a5fa' },
                { label: 'Profit',     value: `+$${yourEntry.profit}`,           color: '#4ade80' },
              ].map(({ label, value, color }) => (
                <VStack key={label} spacing={0} align={{ base: 'flex-start', sm: 'center' }}>
                  <Text fontSize="xs" color={mutedColor} fontWeight="600">{label}</Text>
                  <Text fontSize="lg" fontWeight="900" color={color}>{value}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </HStack>

          {/* Progress hint */}
          <Box mt={4} pt={4} borderTop="1px solid" borderColor={`${borderColor}`}>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="xs" color={mutedColor} fontWeight="600">
                Progress to rank #14
              </Text>
              <Text fontSize="xs" color="#ffd700" fontWeight="700">
                $110 away
              </Text>
            </HStack>
            <Box h="6px" bg={subtleBg} borderRadius="full" overflow="hidden">
              <Box
                h="full"
                w="85%"
                bg="linear-gradient(90deg,#ffd700,#f59e0b)"
                borderRadius="full"
              />
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
