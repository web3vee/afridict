import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, HStack, SimpleGrid, Text, VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import BalanceCard from '../components/portfolio/BalanceCard';
import PositionsTable from '../components/portfolio/PositionsTable';
import TradeHistory from '../components/portfolio/TradeHistory';
import MarketCard from '../components/market/MarketCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useApp } from '../context/AppContext';
import { MY_POSITIONS_INITIAL } from '../data/staticData';
import { TrendingUp, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'win',   Icon: CheckCircle2, color: '#22c55e', title: 'Market resolved — YES wins!',  body: 'Your position on "Will Nigeria qualify for 2026 World Cup?" resolved YES. You earned $24.50.',  time: '2m ago',  unread: true  },
  { id: 2, type: 'alert', Icon: TrendingUp,   color: '#3b82f6', title: 'Market moving fast',           body: '"Will Burna Boy win a Grammy?" odds just shifted 12% — check it out.',                      time: '18m ago', unread: true  },
  { id: 3, type: 'alert', Icon: AlertCircle,  color: '#f59e0b', title: 'Market ending soon',           body: '"Will the Naira strengthen below ₦1,500/USD?" closes in less than 24 hours.',               time: '1h ago',  unread: true  },
  { id: 4, type: 'info',  Icon: Info,         color: '#94a3b8', title: 'New market in Elections',     body: '"Will Peter Obi\'s movement form a new party before 2027?" is now live.',                    time: '3h ago',  unread: false },
  { id: 5, type: 'info',  Icon: Info,         color: '#94a3b8', title: 'New market in Sports',        body: '"Will Morocco reach the semi-finals in the 2026 World Cup?" is now live.',                   time: '5h ago',  unread: false },
  { id: 6, type: 'win',   Icon: CheckCircle2, color: '#22c55e', title: 'Deposit confirmed',            body: 'Your deposit of $100 USDT has been confirmed and added to your balance.',                   time: '1d ago',  unread: false },
];

interface PortfolioProps {
  displayName: string | null;
  displayAddress: string | null;
  displayPhoto: string | null;
  portfolioValue: number;
  positions: typeof MY_POSITIONS_INITIAL;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function Portfolio({
  displayName, displayAddress, displayPhoto, portfolioValue,
  positions, onDeposit, onWithdraw,
}: PortfolioProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'positions' | 'activity' | 'bookmarks' | 'notifications'>('positions');
  const [readIds, setReadIds]     = useState<Set<number>>(new Set());

  const { bookmarks } = useBookmarks();
  const { openMarketDetail, openBetYes, openBetNo, openEmbed } = useApp();

  const cardBg           = useColorModeValue('#ffffff',  '#111827');
  const borderColor      = useColorModeValue('#e2e8f0',  '#1e293b');
  const headingColor     = useColorModeValue('#0f172a',  '#f8fafc');
  const mutedColor       = useColorModeValue('#64748b',  '#94a3b8');
  const subtleBg         = useColorModeValue('#f8fafc',  '#0d1117');
  const inactiveTabColor = useColorModeValue('gray.400', '#64748b');
  const rowHover         = useColorModeValue('#f8fafc',  '#1e293b');

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;

  const TABS = [
    { key: 'positions',     label: 'Positions'  },
    { key: 'activity',      label: 'Activity'   },
    { key: 'bookmarks',     label: `Bookmarks${bookmarks.length ? ` (${bookmarks.length})` : ''}` },
    { key: 'notifications', label: 'Notifications', badge: unreadCount },
  ] as const;

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>

      <BalanceCard
        displayName={displayName}
        displayAddress={displayAddress}
        displayPhoto={displayPhoto}
        portfolioValue={portfolioValue}
        onDeposit={onDeposit}
        onWithdraw={onWithdraw}
        onSettings={() => navigate('/settings')}
      />

      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">

        <HStack spacing={0} borderBottom="1px solid" borderColor={borderColor} px={6}>
          {TABS.map(t => (
            <Button key={t.key} variant="ghost" size="md" fontWeight="700" borderRadius="none"
              borderBottom="2px solid"
              borderColor={activeTab === t.key ? headingColor : 'transparent'}
              color={activeTab === t.key ? headingColor : inactiveTabColor}
              px={5} py={4} h="auto"
              onClick={() => setActiveTab(t.key)}>
              <HStack spacing={1.5}>
                <Text>{t.label}</Text>
                {(t as any).badge > 0 && (
                  <Box bg="#ef4444" borderRadius="full" minW="17px" h="17px"
                    display="flex" alignItems="center" justifyContent="center" px={1}>
                    <Text fontSize="9px" fontWeight="900" color="white" lineHeight="1">
                      {(t as any).badge}
                    </Text>
                  </Box>
                )}
              </HStack>
            </Button>
          ))}
        </HStack>

        {activeTab === 'positions' && <PositionsTable positions={positions} />}
        {activeTab === 'activity'  && <TradeHistory />}

        {activeTab === 'bookmarks' && (
          <Box p={6}>
            {bookmarks.length === 0 ? (
              <VStack py={16} spacing={3}>
                <Text fontSize="3xl">🔖</Text>
                <Text fontWeight="700" color={headingColor}>No bookmarks yet</Text>
                <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="280px">
                  Tap the bookmark icon on any market card to save it here for quick access.
                </Text>
              </VStack>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {bookmarks.map((m: any) => (
                  <MarketCard
                    key={m.contractId ?? m.id}
                    market={m}
                    onClick={() => openMarketDetail(m)}
                    onBetYes={() => openBetYes(m)}
                    onBetNo={() => openBetNo(m)}
                    onEmbed={() => openEmbed(m)}
                  />
                ))}
              </SimpleGrid>
            )}
          </Box>
        )}

        {activeTab === 'notifications' && (
          <Box>
            {/* Header */}
            <HStack px={6} py={4} borderBottom="1px solid" borderColor={borderColor}
              justify="space-between">
              <HStack spacing={2}>
                <Bell size={15} strokeWidth={2} color={mutedColor} />
                <Text fontSize="sm" fontWeight="700" color={headingColor}>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                </Text>
              </HStack>
              {unreadCount > 0 && (
                <Button size="xs" variant="ghost" color="#3b82f6" fontWeight="700"
                  _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                  onClick={() => setReadIds(new Set(NOTIFICATIONS.map(n => n.id)))}>
                  Mark all read
                </Button>
              )}
            </HStack>

            {/* Notification rows */}
            {NOTIFICATIONS.map((n, i) => {
              const isUnread = n.unread && !readIds.has(n.id);
              return (
                <Box key={n.id}>
                  {i > 0 && <Box h="1px" bg={borderColor} />}
                  <HStack px={6} py={4} spacing={4} align="flex-start"
                    bg={isUnread ? `${n.color}06` : 'transparent'}
                    _hover={{ bg: rowHover }} transition="bg .15s" cursor="pointer"
                    onClick={() => setReadIds(prev => new Set([...prev, n.id]))}>

                    {/* Icon */}
                    <Box w={10} h={10} borderRadius="xl" flexShrink={0}
                      display="flex" alignItems="center" justifyContent="center"
                      style={{ background: `${n.color}18` }}>
                      <n.Icon size={18} strokeWidth={2} color={n.color} />
                    </Box>

                    {/* Content */}
                    <Box flex={1} minW={0}>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight={isUnread ? '700' : '600'} color={headingColor}>
                          {n.title}
                        </Text>
                        <Text fontSize="11px" color={mutedColor} flexShrink={0} ml={3}>{n.time}</Text>
                      </HStack>
                      <Text fontSize="sm" color={mutedColor} lineHeight="1.6">{n.body}</Text>
                    </Box>

                    {/* Unread dot */}
                    {isUnread && (
                      <Box w="8px" h="8px" borderRadius="full" bg="#ef4444" flexShrink={0} mt={1} />
                    )}
                  </HStack>
                </Box>
              );
            })}

            {/* Empty state once all read */}
            {NOTIFICATIONS.every(n => !n.unread || readIds.has(n.id)) && unreadCount === 0 && (
              <VStack py={10} spacing={3} borderTop="1px solid" borderColor={borderColor}>
                <Box w={12} h={12} borderRadius="xl" bg={subtleBg}
                  display="flex" alignItems="center" justifyContent="center">
                  <Bell size={20} strokeWidth={1.5} color={mutedColor} />
                </Box>
                <Text fontSize="sm" fontWeight="600" color={headingColor}>You're all caught up</Text>
                <Text fontSize="xs" color={mutedColor}>New notifications will appear here.</Text>
              </VStack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
