import React, { memo, useMemo } from 'react';
import { Badge, Box, HStack, Heading, SimpleGrid, Text, Button, useToast } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { ADMIN_USERS } from '../../data/staticData';

interface AdminUsersProps {
  adminSearch: string;
}

function AdminUsers({ adminSearch }: AdminUsersProps) {
  const c = useAdminColors();
  const toast = useToast();

  const visible = useMemo(() =>
    ADMIN_USERS.filter(u =>
      !adminSearch ||
      u.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(adminSearch.toLowerCase())
    ),
  [adminSearch]);

  const stats = useMemo(() => [
    { label: 'Total Users', val: ADMIN_USERS.length,                                       color: '#60a5fa' },
    { label: 'Active',      val: ADMIN_USERS.filter(u => u.status === 'active').length,    color: '#4ade80' },
    { label: 'Suspended',   val: ADMIN_USERS.filter(u => u.status === 'suspended').length, color: '#f87171' },
  ], []);

  return (
    <Box>
      <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor} mb={2}>Users</Heading>
      <Text fontSize="sm" color={c.adminSubtextColor} mb={6}>{ADMIN_USERS.length} registered users</Text>

      <SimpleGrid columns={3} spacing={4} mb={6}>
        {stats.map(s => (
          <Box key={s.label} bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="xl" p={5} textAlign="center">
            <Text fontSize="2xl" fontWeight="800" color={s.color}>{s.val}</Text>
            <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mt={1}>{s.label}</Text>
          </Box>
        ))}
      </SimpleGrid>

      <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" overflow="hidden">
        {/* Header */}
        <HStack px={6} py={3} bg={c.adminSidebarBg} borderBottom="1px solid" borderColor={c.adminBorderColor}>
          {[
            { label: 'User',   flex: 2 },
            { label: 'Email',  flex: 2 },
            { label: 'Balance', w: '80px' },
            { label: 'Bets',   w: '60px' },
            { label: 'Status', w: '80px' },
            { label: 'Joined', w: '80px' },
            { label: 'Action', w: '80px' },
          ].map(col => (
            <Text key={col.label} fontSize="xs" color={c.adminMutedColor} fontWeight="700"
              flex={col.flex} w={col.w} textTransform="uppercase" letterSpacing="wider"
            >{col.label}</Text>
          ))}
        </HStack>

        {visible.map(u => (
          <HStack key={u.id} px={6} py={4} borderBottom="1px solid" borderColor={c.adminRowBorder} _hover={{ bg: c.adminHoverBg }} align="center">
            <HStack flex={2} spacing={3} minW={0}>
              <Box w={8} h={8} bg="linear-gradient(135deg,#ffd700,#f59e0b)" borderRadius="full"
                display="flex" alignItems="center" justifyContent="center" flexShrink={0}
              >
                <Text fontSize="xs" fontWeight="800" color="gray.900">{u.name[1].toUpperCase()}</Text>
              </Box>
              <Box minW={0}>
                <Text fontSize="xs" fontWeight="700" color={c.adminHeadingColor} noOfLines={1}>{u.name}</Text>
                <Text fontSize="10px" color={c.adminMutedColor}>{u.country}</Text>
              </Box>
            </HStack>
            <Text fontSize="xs" color={c.adminSubtextColor} flex={2} noOfLines={1}>{u.email}</Text>
            <Text fontSize="sm" fontWeight="700" color="#4ade80" w="80px">${u.balance.toLocaleString()}</Text>
            <Text fontSize="sm" color={c.adminSecondaryColor} w="60px">{u.bets}</Text>
            <Box w="80px"><Badge fontSize="9px" colorScheme={u.status === 'active' ? 'green' : 'red'}>{u.status}</Badge></Box>
            <Text fontSize="10px" color={c.adminMutedColor} w="80px">{u.joined.slice(5)}</Text>
            <Button size="xs" variant="outline"
              borderColor={c.adminInputBorder}
              color={u.status === 'active' ? '#f87171' : '#4ade80'}
              borderRadius="md" w="80px" fontSize="10px"
              _hover={{ borderColor: u.status === 'active' ? '#f87171' : '#4ade80' }}
              onClick={() => toast({
                title: `${u.status === 'active' ? 'Suspended' : 'Activated'} ${u.name}`,
                status: u.status === 'active' ? 'warning' : 'success',
                duration: 2000,
              })}
            >{u.status === 'active' ? 'Suspend' : 'Activate'}</Button>
          </HStack>
        ))}
      </Box>
    </Box>
  );
}

export default memo(AdminUsers);
