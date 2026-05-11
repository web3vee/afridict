import React, { memo, useState, useMemo } from 'react';
import { Badge, Box, Button, HStack, Heading, Text } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { ADMIN_TXNS } from '../../data/staticData';

interface AdminTransactionsProps {
  adminSearch: string;
}

const FILTERS = ['All', 'Deposit', 'Bet', 'Withdrawal'];

function AdminTransactions({ adminSearch }: AdminTransactionsProps) {
  const c = useAdminColors();
  const [txFilter, setTxFilter] = useState('All');

  const visible = useMemo(() =>
    ADMIN_TXNS.filter(t =>
      (txFilter === 'All' || t.type === txFilter) &&
      (!adminSearch || t.user.includes(adminSearch) || t.id.includes(adminSearch))
    ),
  [txFilter, adminSearch]);

  return (
    <Box>
      <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor} mb={6}>Transactions</Heading>

      <HStack spacing={2} mb={6}>
        {FILTERS.map(f => (
          <Button key={f} size="sm" borderRadius="lg" fontSize="xs" fontWeight="600"
            bg={txFilter === f ? 'rgba(255,215,0,0.1)' : 'transparent'}
            color={txFilter === f ? '#ffd700' : c.adminSubtextColor}
            border="1px solid"
            borderColor={txFilter === f ? 'rgba(255,215,0,0.3)' : c.adminBorderColor}
            onClick={() => setTxFilter(f)}
            _hover={{ borderColor: c.adminInputBorder }}
          >{f}</Button>
        ))}
      </HStack>

      <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" overflow="hidden">
        <HStack px={6} py={3} bg={c.adminSidebarBg} borderBottom="1px solid" borderColor={c.adminBorderColor}>
          {['ID', 'User', 'Type', 'Amount', 'Currency', 'Status', 'Date'].map(h => (
            <Text key={h} fontSize="xs" color={c.adminMutedColor} fontWeight="700"
              flex={h === 'ID' ? 0.8 : h === 'Date' ? 1.5 : 1}
              textTransform="uppercase" letterSpacing="wider"
            >{h}</Text>
          ))}
        </HStack>
        {visible.map(tx => (
          <HStack key={tx.id} px={6} py={4} borderBottom="1px solid" borderColor={c.adminRowBorder} _hover={{ bg: c.adminHoverBg }}>
            <Text fontSize="xs" color={c.adminMutedColor} fontFamily="mono" flex={0.8}>{tx.id}</Text>
            <Text fontSize="xs" fontWeight="700" color={c.adminHeadingColor} flex={1}>{tx.user}</Text>
            <Box flex={1}>
              <Badge fontSize="9px" colorScheme={tx.type === 'Deposit' ? 'green' : tx.type === 'Withdrawal' ? 'orange' : 'blue'}>{tx.type}</Badge>
            </Box>
            <Text fontSize="sm" fontWeight="700" flex={1}
              color={tx.type === 'Deposit' ? '#4ade80' : tx.type === 'Withdrawal' ? '#f87171' : '#60a5fa'}
            >
              {tx.type === 'Withdrawal' ? '-' : '+'}{tx.amount}
            </Text>
            <Text fontSize="xs" color={c.adminSubtextColor} flex={1}>{tx.currency}</Text>
            <Box flex={1}>
              <Badge fontSize="9px" colorScheme={tx.status === 'completed' ? 'green' : tx.status === 'pending' ? 'yellow' : 'red'}>{tx.status}</Badge>
            </Box>
            <Text fontSize="10px" color={c.adminMutedColor} flex={1.5}>{tx.date}</Text>
          </HStack>
        ))}
      </Box>
    </Box>
  );
}

export default memo(AdminTransactions);
