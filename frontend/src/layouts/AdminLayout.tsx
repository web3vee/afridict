import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import Sidebar from '../components/admin/Sidebar';
import { useAdminColors } from '../components/admin/useAdminColors';
import { useApp } from '../context/AppContext';
import { ADMIN_MARKETS_INITIAL } from '../data/staticData';

interface Market {
  id: number; title: string; category: string;
  pool: number; yes: number; status: string; created: string;
}

export interface AdminOutletContext {
  adminSearch: string;
  adminMarkets: Market[];
  setAdminMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  pendingMarkets: any[];
  removePendingMarket: (id: string) => void;
  addMarket: (m: any) => void;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const c        = useAdminColors();
  const { pendingMarkets, removePendingMarket, addMarket } = useApp();

  const [searchInput,  setSearchInput]  = useState('');
  const [adminSearch,  setAdminSearch]  = useState('');
  const [adminMarkets, setAdminMarkets] = useState<Market[]>(ADMIN_MARKETS_INITIAL);

  // Debounce: only propagate the search term 300 ms after the user stops typing
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setAdminSearch(searchInput), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  const parts   = location.pathname.split('/').filter(Boolean);
  const section = parts.length > 1 ? parts[1] : 'overview';

  const ctx: AdminOutletContext = { adminSearch, adminMarkets, setAdminMarkets, pendingMarkets, removePendingMarket, addMarket };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <Box flex={1} display="flex" flexDirection="column" overflow="hidden" minH="100vh"
        bg={c.adminBg} color={c.adminHeadingColor}>

        {/* Top bar */}
        <Box h="64px" bg={c.adminSidebarBg} borderBottom="1px solid" borderColor={c.adminBorderColor}
          px={8} display="flex" alignItems="center" justifyContent="space-between" flexShrink={0}>
          <Text fontWeight="700" fontSize="lg" color={c.adminHeadingColor} textTransform="capitalize">
            {section}
          </Text>
          <HStack spacing={4}>
            <Box bg={c.adminInputBg} borderRadius="xl" px={4} py={2} display="flex" alignItems="center" gap={2} w="220px">
              <Text color={c.adminMutedColor} fontSize="sm">🔍</Text>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search admin..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: c.adminInputColor, fontSize: '13px', width: '100%' }}
              />
            </Box>
            <Box position="relative" cursor="pointer" px={1}>
              <Text fontSize="lg">🔔</Text>
              <Box position="absolute" top={0} right={0} w={2} h={2} bg="#f87171" borderRadius="full" />
            </Box>
            <Button size="sm" variant="ghost" onClick={c.toggleColorMode} borderRadius="lg" px={2}
              color={c.adminSecondaryColor} _hover={{ bg: c.adminInputBg }} title="Toggle theme">
              {c.colorMode === 'dark' ? '☀️' : '🌙'}
            </Button>
            <Box w={8} h={8} bg="linear-gradient(135deg,#ffd700,#f59e0b)" borderRadius="full"
              display="flex" alignItems="center" justifyContent="center" cursor="pointer">
              <Text fontSize="xs" fontWeight="800" color="gray.900">A</Text>
            </Box>
            <Button size="sm" variant="outline" borderColor={c.adminBorderColor} color={c.adminSecondaryColor}
              borderRadius="lg" fontSize="xs" onClick={() => navigate('/')}
              _hover={{ borderColor: '#ffd700', color: '#ffd700' }} transition="all 0.2s">
              ← Back to Browse
            </Button>
          </HStack>
        </Box>

        {/* Section content */}
        <Box flex={1} overflowY="auto" p={8} bg={c.adminBg}>
          <Outlet context={ctx} />
        </Box>
      </Box>
    </div>
  );
}
