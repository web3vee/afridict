import React from 'react';
import { Box, HStack, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { useApp } from '../../context/AppContext';
import AppChart from '../shared/AppChart';

const VOL_DATA: { time: string; value: number }[] = [
  { time: 'Aug', value: 180 }, { time: 'Sep', value: 320 }, { time: 'Oct', value: 280 },
  { time: 'Nov', value: 510 }, { time: 'Dec', value: 640 }, { time: 'Jan', value: 820 },
  { time: 'Feb', value: 1100 }, { time: 'Mar', value: 1580 },
];
const USER_GROWTH = [
  { m: 'Oct', v: 320 }, { m: 'Nov', v: 480 }, { m: 'Dec', v: 410 },
  { m: 'Jan', v: 690 }, { m: 'Feb', v: 820 }, { m: 'Mar', v: 1240 }, { m: 'Apr', v: 990 },
];
const RESOLUTION_DATA: { time: string; value: number }[] = [
  { time: 'Sep', value: 2 }, { time: 'Oct', value: 5 }, { time: 'Nov', value: 4 },
  { time: 'Dec', value: 8 }, { time: 'Jan', value: 11 }, { time: 'Feb', value: 9 },
  { time: 'Mar', value: 15 },
];

export default function AdminAnalytics() {
  const c = useAdminColors();
  const { markets } = useApp();

  const totalPool     = markets.reduce((s, m) => s + (m.pool ?? 0), 0);
  const activeMarkets = markets.filter(m => m.status !== 'resolved').length;
  const totalMarkets  = markets.length;
  const avgPool       = totalMarkets > 0 ? Math.round(totalPool / totalMarkets) : 0;

  // Category breakdown from live markets
  const catCount: Record<string, number> = {};
  markets.forEach(m => { catCount[m.category] = (catCount[m.category] || 0) + (m.pool ?? 1); });
  const total = Object.values(catCount).reduce((s, v) => s + v, 0) || 1;
  const COLORS = ['#4ade80','#ffd700','#60a5fa','#f472b6','#a78bfa','#f97316','#22d3ee','#fb923c'];
  const categoryBreakdown = Object.entries(catCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, val], i) => ({ label, pct: Math.round((val / total) * 100), color: COLORS[i] }));

  const STAT_CARDS = [
    { label: 'Total Pool Volume',  value: `$${totalPool >= 1000 ? (totalPool/1000).toFixed(1)+'K' : totalPool.toLocaleString()}`, sub: 'All-time across markets',  color: '#4ade80' },
    { label: 'Active Markets',     value: activeMarkets,    sub: `${totalMarkets} total created`,      color: '#ffd700' },
    { label: 'Avg Pool / Market',  value: `$${avgPool.toLocaleString()}`, sub: 'Based on live markets', color: '#60a5fa' },
    { label: 'Monthly Users',      value: '990',            sub: '↑ 20% from last month',             color: '#a78bfa' },
  ];

  return (
    <Box>
      <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor} mb={6}>Analytics</Heading>

      {/* Stat cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={6}>
        {STAT_CARDS.map(s => (
          <Box key={s.label} bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor}
            borderRadius="2xl" p={5}>
            <Text fontSize="xs" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase"
              letterSpacing="wider" mb={3}>{s.label}</Text>
            <Text fontSize="2xl" fontWeight="900" color={s.color} mb={0.5}>{s.value}</Text>
            <Text fontSize="xs" color={c.adminMutedColor}>{s.sub}</Text>
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        {/* Volume Chart */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={1}>Volume Over Time</Text>
          <Text fontSize="xs" color={c.adminMutedColor} mb={4}>Last 8 months (USD)</Text>
          <Box h="180px">
            <AppChart
              data={VOL_DATA} color="#4ade80" height={180}
              yFormatter={(v: number) => `$${v >= 1000 ? `${(v/1000).toFixed(1)}K` : v}`}
              tooltipLabel="volume"
            />
          </Box>
        </Box>

        {/* Category Breakdown */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={1}>Volume by Category</Text>
          <Text fontSize="xs" color={c.adminMutedColor} mb={5}>
            % of total pool — {totalMarkets} live markets
          </Text>
          <VStack spacing={3} align="stretch">
            {categoryBreakdown.map(cat => (
              <Box key={cat.label}>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="xs" color={c.adminSecondaryColor} fontWeight="600">{cat.label}</Text>
                  <Text fontSize="xs" color={cat.color} fontWeight="700">{cat.pct}%</Text>
                </HStack>
                <Box h="6px" bg={c.adminBarTrackBg} borderRadius="full">
                  <Box h="full" w={`${cat.pct}%`} bg={cat.color} borderRadius="full" transition="width 0.6s ease" />
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* User Growth */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={1}>User Growth</Text>
          <Text fontSize="xs" color={c.adminMutedColor} mb={5}>New signups per month</Text>
          <HStack align="end" spacing={3} h="100px">
            {USER_GROWTH.map(b => (
              <Box key={b.m} flex={1} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Text fontSize="9px" color={c.adminMutedColor}>{b.v}</Text>
                <Box w="full" bg="linear-gradient(180deg,#60a5fa,#3b82f6)" borderRadius="sm"
                  style={{ height: `${(b.v / 1240) * 80}px` }}
                  _hover={{ opacity: 0.8 }} transition="opacity 0.2s" cursor="pointer" />
                <Text fontSize="9px" color={c.adminMutedColor}>{b.m}</Text>
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Resolutions Chart */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={1}>Markets Resolved</Text>
          <Text fontSize="xs" color={c.adminMutedColor} mb={4}>Per month</Text>
          <Box h="130px">
            <AppChart
              data={RESOLUTION_DATA} color="#ffd700" height={130}
              yFormatter={(v: number) => `${v}`}
              tooltipLabel="resolved"
            />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
