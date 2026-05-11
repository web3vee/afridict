import React from 'react';
import { Box, HStack, SimpleGrid, Text, Badge } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { ADMIN_TXNS } from '../../data/staticData';

const METRICS = [
  { label: 'Total Volume',     val: '$2.4M',  change: '+12.3%', color: '#4ade80', pts: '20,50 50,30 80,40 110,20 140,28 170,15 200,22' },
  { label: 'Active Users',     val: '4,218',  change: '+8.1%',  color: '#60a5fa', pts: '20,45 50,38 80,42 110,25 140,35 170,20 200,28' },
  { label: 'Active Markets',   val: '25',     change: '+4',     color: '#ffd700', pts: '20,50 50,48 80,42 110,38 140,35 170,30 200,25' },
  { label: 'Platform Revenue', val: '$48.2K', change: '+15.2%', color: '#a78bfa', pts: '20,52 50,45 80,48 110,30 140,25 170,18 200,15' },
];

interface AdminOverviewProps {
  adminMarkets: { id: number; title: string; category: string; pool: number; yes: number; status: string; created: string }[];
  onViewTransactions: () => void;
  onViewMarkets: () => void;
}

export default function AdminOverview({ adminMarkets, onViewTransactions, onViewMarkets }: AdminOverviewProps) {
  const c = useAdminColors();

  return (
    <Box>
      {/* Metric cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        {METRICS.map(m => (
          <Box key={m.label} bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}
            _hover={{ borderColor: '#ffd700', transform: 'translateY(-2px)' }} transition="all 0.2s"
          >
            <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={3} textTransform="uppercase" letterSpacing="wider">{m.label}</Text>
            <HStack justify="space-between" align="end">
              <Box>
                <Text fontSize="2xl" fontWeight="800" color={c.adminHeadingColor}>{m.val}</Text>
                <HStack spacing={1} mt={1}>
                  <Text fontSize="xs" color="#4ade80" fontWeight="700">{m.change}</Text>
                  <Text fontSize="xs" color={c.adminMutedColor}>vs last month</Text>
                </HStack>
              </Box>
              <svg width="80" height="36" viewBox="0 0 220 60">
                <defs>
                  <linearGradient id={`sg-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={m.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={m.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline points={m.pts} fill="none" stroke={m.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Recent Transactions + Top Markets */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Txns */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" overflow="hidden">
          <Box px={6} py={4} borderBottom="1px solid" borderColor={c.adminBorderColor}>
            <Text fontWeight="700" color={c.adminHeadingColor} fontSize="sm">Recent Transactions</Text>
          </Box>
          {ADMIN_TXNS.slice(0, 5).map(tx => (
            <HStack key={tx.id} px={6} py={3} borderBottom="1px solid" borderColor={c.adminRowBorder}
              _hover={{ bg: c.adminHoverBg }} justify="space-between"
            >
              <HStack spacing={3}>
                <Box w={8} h={8} borderRadius="lg"
                  bg={tx.type === 'Deposit' ? 'rgba(74,222,128,0.1)' : tx.type === 'Withdrawal' ? 'rgba(248,113,113,0.1)' : 'rgba(96,165,250,0.1)'}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <Text fontSize="xs">{tx.type === 'Deposit' ? '↓' : tx.type === 'Withdrawal' ? '↑' : '⇄'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="700" color={c.adminHeadingColor}>{tx.user}</Text>
                  <Text fontSize="10px" color={c.adminSubtextColor}>{tx.type} · {tx.currency}</Text>
                </Box>
              </HStack>
              <Box textAlign="right">
                <Text fontSize="sm" fontWeight="700"
                  color={tx.type === 'Deposit' ? '#4ade80' : tx.type === 'Withdrawal' ? '#f87171' : '#60a5fa'}
                >
                  {tx.type === 'Withdrawal' ? '-' : '+'}{tx.amount} USDT
                </Text>
                <Badge fontSize="9px" colorScheme={tx.status === 'completed' ? 'green' : tx.status === 'pending' ? 'yellow' : 'red'}>{tx.status}</Badge>
              </Box>
            </HStack>
          ))}
          <Box px={6} py={3} textAlign="center">
            <Text fontSize="xs" color="#ffd700" cursor="pointer" fontWeight="700" onClick={onViewTransactions}>View all transactions →</Text>
          </Box>
        </Box>

        {/* Top Markets */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" overflow="hidden">
          <Box px={6} py={4} borderBottom="1px solid" borderColor={c.adminBorderColor}>
            <Text fontWeight="700" color={c.adminHeadingColor} fontSize="sm">Top Markets by Volume</Text>
          </Box>
          {adminMarkets.slice(0, 5).map((m, i) => (
            <HStack key={m.id} px={6} py={3} borderBottom="1px solid" borderColor={c.adminRowBorder}
              _hover={{ bg: c.adminHoverBg }} justify="space-between"
            >
              <HStack spacing={3} flex={1} minW={0}>
                <Text fontSize="sm" color={c.adminMutedColor} w={5} fontWeight="700">{i + 1}</Text>
                <Box flex={1} minW={0}>
                  <Text fontSize="xs" fontWeight="700" color={c.adminHeadingColor} noOfLines={1}>{m.title}</Text>
                  <HStack spacing={1} mt={0.5}>
                    <Badge fontSize="8px" colorScheme="blue">{m.category}</Badge>
                    <Badge fontSize="8px" colorScheme={m.status === 'active' ? 'green' : 'gray'}>{m.status}</Badge>
                  </HStack>
                </Box>
              </HStack>
              <Text fontSize="sm" fontWeight="700" color="#4ade80" flexShrink={0}>${m.pool.toLocaleString()}</Text>
            </HStack>
          ))}
          <Box px={6} py={3} textAlign="center">
            <Text fontSize="xs" color="#ffd700" cursor="pointer" fontWeight="700" onClick={onViewMarkets}>Manage all markets →</Text>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
