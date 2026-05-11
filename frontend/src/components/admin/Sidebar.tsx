import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { useApp } from '../../context/AppContext';
const LOGO2 = '/mylogo2.png';
import {
  LayoutDashboard, TrendingUp, Users, ArrowLeftRight,
  BarChart3, Flag, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview',     Icon: LayoutDashboard, label: 'Overview'     },
  { id: 'markets',      Icon: TrendingUp,      label: 'Markets'      },
  { id: 'users',        Icon: Users,           label: 'Users'        },
  { id: 'transactions', Icon: ArrowLeftRight,  label: 'Transactions' },
  { id: 'analytics',    Icon: BarChart3,       label: 'Analytics'    },
  { id: 'moderation',   Icon: Flag,            label: 'Moderation'   },
  { id: 'settings',     Icon: Settings,        label: 'Settings'     },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const c         = useAdminColors();
  const { pendingMarkets } = useApp();
  const pendingCount = pendingMarkets.length;

  const parts    = location.pathname.split('/').filter(Boolean);
  const activeId = parts.length > 1 ? parts[1] : 'overview';

  return (
    <Box w="220px" bg={c.adminSidebarBg} borderRight="1px solid" borderColor={c.adminBorderColor}
      display="flex" flexDirection="column" flexShrink={0}
      position="sticky" top={0} h="100vh" overflowY="auto">

      <Box px={5} py={5} borderBottom="1px solid" borderColor={c.adminBorderColor}>
        <HStack spacing={3}>
          <img src={LOGO2} alt="" style={{ width: 30, height: 30, objectFit: 'contain', filter: 'invert(1)' }} />
          <Box>
            <Text fontWeight="800" color={c.adminHeadingColor} fontSize="sm" lineHeight="1.2">Afridict</Text>
            <Box bg="#ffd700" display="inline-block" px={2} py={0.5} borderRadius="sm" mt={0.5}>
              <Text fontSize="9px" fontWeight="800" color="gray.900" letterSpacing="wider">ADMIN</Text>
            </Box>
          </Box>
        </HStack>
      </Box>

      <VStack align="stretch" spacing={0.5} px={3} py={4} flex={1}>
        {NAV_ITEMS.map(item => (
          <Box key={item.id} px={3} py={2.5} borderRadius="lg" cursor="pointer"
            bg={activeId === item.id ? 'rgba(255,215,0,0.08)' : 'transparent'}
            borderLeft={`3px solid ${activeId === item.id ? '#ffd700' : 'transparent'}`}
            onClick={() => navigate(`/admin/${item.id}`)}
            transition="all 0.15s"
            _hover={{ bg: activeId === item.id ? 'rgba(255,215,0,0.08)' : c.adminSidebarHoverBg }}
          >
            <HStack spacing={3} justify="space-between" w="full">
              <HStack spacing={3}>
                <item.Icon
                  size={15} strokeWidth={2.2}
                  color={activeId === item.id ? '#ffd700' : c.adminMutedColor}
                />
                <Text fontSize="sm" fontWeight={activeId === item.id ? '700' : '500'}
                  color={activeId === item.id ? '#ffd700' : c.adminSecondaryColor}
                >{item.label}</Text>
              </HStack>
              {item.id === 'markets' && pendingCount > 0 && (
                <Box bg="#f87171" color="white" fontSize="9px" fontWeight="800"
                  borderRadius="full" px={1.5} py={0.5} lineHeight="1.4" minW="18px" textAlign="center"
                >
                  {pendingCount}
                </Box>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>

      <Box px={5} py={4} borderTop="1px solid" borderColor={c.adminBorderColor}>
        <Text fontSize="10px" color={c.adminMutedColor} fontWeight="600">v1.0.0 · Polygon Mainnet</Text>
      </Box>
    </Box>
  );
}
