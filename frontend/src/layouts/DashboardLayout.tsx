import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, HStack, Text, VStack, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { useApp } from '../context/AppContext';
import { useBookmarks } from '../hooks/useBookmarks';

const LOGO2 = '/mylogo2.png';
import { BarChart2, Bookmark, Settings, Trophy, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'portfolio',   Icon: BarChart2, label: 'Portfolio',   path: '/portfolio'   },
  { id: 'profile',     Icon: User,      label: 'Profile',     path: '/profile'     },
  { id: 'leaderboard', Icon: Trophy,    label: 'Leaderboard', path: '/leaderboard' },
  { id: 'bookmarks',   Icon: Bookmark,  label: 'Bookmarks',   path: '/bookmarks'   },
  { id: 'settings',    Icon: Settings,  label: 'Settings',    path: '/settings'    },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const location = useLocation();
  const {
    displayName, displayPhoto, displayAddress,
    portfolioValue, cashBalance, openDeposit,
  } = useApp();

  const sidebarBg   = useColorModeValue('#ffffff',  '#0f172a');
  const pageBg      = useColorModeValue('#f8fafc',  '#070b14');
  const borderColor = useColorModeValue('#e2e8f0',  '#1e293b');
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor  = useColorModeValue('#475569',  '#94a3b8');
  const hoverBg     = useColorModeValue('#f1f5f9',  '#1e293b');

  const { bookmarks } = useBookmarks();

  const activeId  = location.pathname.startsWith('/settings')
    ? 'settings'
    : location.pathname.startsWith('/bookmarks')
    ? 'bookmarks'
    : location.pathname.startsWith('/leaderboard')
    ? 'leaderboard'
    : location.pathname.startsWith('/profile')
    ? 'profile'
    : 'portfolio';
  const initials  = (displayName || displayAddress || 'U')[0].toUpperCase();

  return (
    <Box display="flex" minH="100vh" bg={pageBg}>

      {/* Sidebar */}
      <Box w="220px" bg={sidebarBg} borderRight="1px solid" borderColor={borderColor}
        display="flex" flexDirection="column" flexShrink={0}
        position="sticky" top={0} h="100vh" overflowY="auto">

        {/* Logo */}
        <Box px={5} py={4} borderBottom="1px solid" borderColor={borderColor}
          cursor="pointer" onClick={() => navigate('/')}>
          <HStack spacing={2}>
            <img src={LOGO2} alt="Afridict"
              style={{ width: 28, height: 28, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
            <Text fontWeight="800" color={headingColor} fontSize="sm">Afridict</Text>
          </HStack>
        </Box>

        {/* User card */}
        <Box px={4} py={4} borderBottom="1px solid" borderColor={borderColor}>
          <HStack spacing={3} mb={3}>
            {displayPhoto
              ? <img src={displayPhoto} alt="av"
                  style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
              : <Box w={9} h={9} borderRadius="full" bg="linear-gradient(135deg,#4ade80,#60a5fa)"
                  display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                  <Text fontSize="sm" fontWeight="800" color="white">{initials}</Text>
                </Box>
            }
            <Box minW={0}>
              <Text fontSize="sm" fontWeight="700" color={headingColor} noOfLines={1}>
                {displayName || (displayAddress
                  ? displayAddress.slice(0, 6) + '…' + displayAddress.slice(-4)
                  : 'Guest')}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="xs" color={mutedColor}>${portfolioValue.toFixed(2)}</Text>
                <Text fontSize="xs" color={mutedColor}>·</Text>
                <Text fontSize="xs" color={mutedColor}>${cashBalance.toFixed(2)} cash</Text>
              </HStack>
            </Box>
          </HStack>
          <Button size="xs" w="full" bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
            fontWeight="700" borderRadius="md" _hover={{ opacity: .9 }} onClick={openDeposit}>
            + Deposit
          </Button>
        </Box>

        {/* Nav links */}
        <VStack align="stretch" spacing={0.5} px={3} py={4} flex={1}>
          {NAV_ITEMS.map(item => (
            <Box key={item.id} px={3} py={2.5} borderRadius="lg" cursor="pointer"
              bg={activeId === item.id ? hoverBg : 'transparent'}
              borderLeft={`3px solid ${activeId === item.id ? headingColor : 'transparent'}`}
              onClick={() => navigate(item.path)} transition="all 0.15s"
              _hover={{ bg: hoverBg }}>
              <HStack spacing={3} justify="space-between">
                <HStack spacing={3}>
                  <item.Icon
                    size={15} strokeWidth={2.2}
                    color={activeId === item.id ? headingColor : mutedColor}
                  />
                  <Text fontSize="sm" fontWeight={activeId === item.id ? '700' : '500'}
                    color={activeId === item.id ? headingColor : mutedColor}>
                    {item.label}
                  </Text>
                </HStack>
                {item.id === 'bookmarks' && bookmarks.length > 0 && (
                  <Box bg="#ffd700" borderRadius="full" px={1.5} minW="18px" h="18px"
                    display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="10px" fontWeight="800" color="gray.900" lineHeight="1">
                      {bookmarks.length}
                    </Text>
                  </Box>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Back to markets */}
        <Box px={4} py={4} borderTop="1px solid" borderColor={borderColor}>
          <Button size="sm" variant="ghost" w="full" justifyContent="flex-start"
            color={mutedColor} fontSize="sm" fontWeight="500"
            _hover={{ color: headingColor }} onClick={() => navigate('/')}>
            ← Back to Markets
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box flex={1} overflowY="auto">
        <Outlet />
      </Box>
    </Box>
  );
}
