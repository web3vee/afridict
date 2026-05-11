import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LOGO2 = '/mylogo2.png';
import {
  Box, HStack, VStack, Heading, Text, Button,
  Menu, MenuButton, MenuList, MenuItem, Switch, Divider,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  useColorModeValue, useColorMode,
} from '@chakra-ui/react';
import { LANGUAGES } from '../data/staticData';
import { useApp } from '../context/AppContext';
import { useBookmarks } from '../hooks/useBookmarks';
import {
  Search, Bookmark, Bell, Settings, Trophy, Gift, Plug, Users,
  Code2, Moon, ShieldAlert, LogOut, TrendingUp, CheckCircle2, AlertCircle, Info,
} from 'lucide-react';

const CATEGORIES = [
  { label: '🔥 Trending', key: 'Trending'    },
  { label: 'Breaking',    key: 'Breaking'    },
  { label: 'New',         key: 'New'         },
  { label: 'Elections',   key: 'Elections'   },
  { label: 'Politics',    key: 'Politics'    },
  { label: 'Sports',      key: 'Sports'      },
  { label: 'Music',       key: 'Music'       },
  { label: 'Crypto',      key: 'Crypto'      },
  { label: 'Economy',     key: 'Economy'     },
  { label: 'Finance',     key: 'Finance'     },
  { label: 'Tech',        key: 'Tech'        },
  { label: 'Security',    key: 'Security'    },
  { label: 'Commodities', key: 'Commodities' },
  { label: 'Weather',     key: 'Weather'     },
  { label: 'Mentions',    key: 'Mentions',   separator: true },
  { label: 'Countries',   key: 'Countries'                 },
];

const SPECIAL_KEYS = new Set(['Trending', 'Breaking', 'New']);

const NOTIFICATIONS = [
  { id: 1, type: 'win',     icon: CheckCircle2, color: '#22c55e', title: 'Market resolved — YES wins!',           body: 'Your position on "Will Nigeria qualify for 2026 World Cup?" resolved YES. You earned $24.50.',  time: '2m ago',   unread: true  },
  { id: 2, type: 'alert',   icon: TrendingUp,   color: '#3b82f6', title: 'Market moving fast',                   body: '"Will Burna Boy win a Grammy?" odds just shifted 12% — check it out.',                      time: '18m ago',  unread: true  },
  { id: 3, type: 'alert',   icon: AlertCircle,  color: '#f59e0b', title: 'Market ending soon',                   body: '"Will the Naira strengthen below ₦1,500/USD?" closes in less than 24 hours.',               time: '1h ago',   unread: true  },
  { id: 4, type: 'info',    icon: Info,         color: '#94a3b8', title: 'New market in Elections',              body: '"Will Peter Obi\'s movement form a new party before 2027?" is now live.',                    time: '3h ago',   unread: false },
  { id: 5, type: 'info',    icon: Info,         color: '#94a3b8', title: 'New market in Sports',                 body: '"Will Morocco reach the semi-finals in the 2026 World Cup?" is now live.',                   time: '5h ago',   unread: false },
  { id: 6, type: 'win',     icon: CheckCircle2, color: '#22c55e', title: 'Deposit confirmed',                    body: 'Your deposit of $100 USDT has been confirmed and added to your balance.',                   time: '1d ago',   unread: false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isLoggedIn, authenticated,
    displayName, displayPhoto, displayAddress,
    portfolioValue, cashBalance,
    language, activeCategory,
    openSearch, login: onLogin, openDeposit: onDeposit, logout: onLogout,
    setHowItWorksStep, onCategoryChange, setLanguage: onLanguageChange,
    isAdminUser, openMarketDetail, openCreateMarket,
  } = useApp();

  const { bookmarks } = useBookmarks();
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.has(n.id)).length;
  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map(n => n.id)));

  const navBg         = 'transparent';
  const menuBg        = useColorModeValue('#ffffff',  '#111827');
  const borderColor   = useColorModeValue('gray.200', '#374151');
  const borderMd      = useColorModeValue('#cbd5e1',  '#334155');
  const headingColor  = useColorModeValue('#0f172a',  '#f8fafc');
  const subtleBg      = useColorModeValue('#f1f5f9',  '#1e293b');
  const subtleBorder  = useColorModeValue('#f1f5f9',  '#1e293b');
  const textColor     = useColorModeValue('#1e293b',  '#e2e8f0');
  const mutedColor    = useColorModeValue('#475569',  '#94a3b8');
  const searchBg      = useColorModeValue('gray.100', '#1f2937');
  const searchHover   = useColorModeValue('gray.400', '#4b5563');
  const portfolioBg   = useColorModeValue('gray.100', '#1f2937');
  const portfolioText = useColorModeValue('gray.800', 'white');
  const activeCatColor = useColorModeValue('gray.600', 'gray.300');
  const ghostColor    = useColorModeValue('gray.600', 'gray.300');
  const loginColor    = useColorModeValue('gray.700', 'white');
  const profileNameColor = useColorModeValue('gray.800', 'white');
  const chevronColor  = useColorModeValue('gray.500', 'gray.400');

  const initials = (displayName || displayAddress || 'A')[0].toUpperCase();

  return (
    <Box bg={navBg} borderBottom="1px solid" borderColor={borderColor}>

      {/* ── Top bar ── */}
      <Box px={{ base: 3, md: 6 }} py={0} h="56px" display="flex" alignItems="center" gap={3}>

        {/* Logo */}
        <HStack spacing={2} cursor="pointer" flexShrink={0} onClick={() => navigate('/')}>
          <img src={LOGO2} alt="Afridict" style={{ width: 32, height: 32, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
          <Heading size="md" color={headingColor} letterSpacing="tight">Afridict</Heading>
        </HStack>

        {/* Search — grows to fill available space */}
        <Box flex={1} onClick={openSearch} cursor="pointer" minW={0}>
          <HStack bg={searchBg} borderRadius="full" px={4} py={1.5}
            border="1px solid" borderColor={borderColor}
            _hover={{ borderColor: searchHover }} transition="all .15s">
            <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
            <Text fontSize="sm" color="gray.400" userSelect="none" isTruncated>Search afridict...</Text>
          </HStack>
        </Box>

        {/* Actions */}
        <HStack spacing={2} flexShrink={0}>
          {isLoggedIn ? (
            <>
              {/* Portfolio + Cash pill — hidden on mobile */}
              <HStack display={{ base: 'none', md: 'flex' }} spacing={0} cursor="pointer" onClick={() => navigate('/portfolio')}
                bg={portfolioBg} borderRadius="lg"
                border="1px solid" borderColor={borderMd}
                _hover={{ borderColor: '#ffd700' }} transition="all .2s"
                overflow="hidden">
                <VStack spacing={0} align="start" px={3} py={1.5}>
                  <Text fontSize="9px" color="gray.400" fontWeight="600" textTransform="uppercase">Portfolio</Text>
                  <Text fontSize="xs" fontWeight="800" color={portfolioText}>${portfolioValue.toFixed(2)}</Text>
                </VStack>
                <Box w="1px" h="32px" bg={borderMd} />
                <VStack spacing={0} align="start" px={3} py={1.5}>
                  <Text fontSize="9px" color="gray.400" fontWeight="600" textTransform="uppercase">Cash</Text>
                  <Text fontSize="xs" fontWeight="800" color={portfolioText}>${cashBalance.toFixed(2)}</Text>
                </VStack>
              </HStack>

              <Button display={{ base: 'none', md: 'inline-flex' }} size="sm" borderRadius="lg"
                fontWeight="700" px={4} variant="outline"
                borderColor={borderMd} color={headingColor}
                _hover={{ borderColor: '#ffd700', color: '#ffd700' }} transition="all .2s"
                onClick={openCreateMarket}>+ Create</Button>
              <Button size="sm" borderRadius="lg" fontWeight="700" px={4}
                bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                onClick={onDeposit}>Deposit</Button>
            </>
          ) : (
            <>
              <Button display={{ base: 'none', md: 'inline-flex' }} variant="ghost" fontSize="sm" color={ghostColor} size="sm"
                leftIcon={<Info size={14} strokeWidth={2} />}
                onClick={() => setHowItWorksStep(1)}>How it works</Button>
              <Button display={{ base: 'none', md: 'inline-flex' }} variant="ghost" fontSize="sm" color={loginColor} size="sm"
                onClick={onLogin}>Log In</Button>
              <Button size="sm" fontWeight="700" px={4} borderRadius="lg"
                bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                _hover={{ opacity: .9 }} transition="all .2s"
                onClick={onLogin}>
                <Box as="span" display={{ base: 'inline', md: 'none' }}>Log In</Box>
                <Box as="span" display={{ base: 'none', md: 'inline' }}>Sign Up</Box>
              </Button>
            </>
          )}

          {/* Notifications */}
          {isLoggedIn && <Popover placement="bottom-end" gutter={8}>
            <PopoverTrigger>
              <Box as="button" position="relative" cursor="pointer" bg="transparent" border="none" p={1}
                color={mutedColor} _hover={{ color: headingColor }} transition="color .15s"
                style={{ outline: 'none', display: 'flex', alignItems: 'center' }}>
                <Bell size={18} strokeWidth={2} />
                {unreadCount > 0 && (
                  <Box position="absolute" top="-1px" right="-1px"
                    w="14px" h="14px" borderRadius="full" bg="#ef4444"
                    display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="8px" fontWeight="900" color="white" lineHeight="1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </Box>
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent bg={menuBg} borderColor={borderColor} w="340px"
              boxShadow="0 8px 32px rgba(0,0,0,.3)" borderRadius="xl" overflow="hidden">
              <PopoverBody p={0}>
                <HStack px={4} py={3} borderBottom="1px solid" borderColor={subtleBorder}
                  justify="space-between">
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="800" color={headingColor}>Notifications</Text>
                    {unreadCount > 0 && (
                      <Box bg="rgba(239,68,68,0.15)" borderRadius="full" px={1.5}>
                        <Text fontSize="10px" fontWeight="700" color="#ef4444">{unreadCount}</Text>
                      </Box>
                    )}
                  </HStack>
                  {unreadCount > 0 && (
                    <Text fontSize="xs" color="#3b82f6" fontWeight="700" cursor="pointer"
                      _hover={{ textDecoration: 'underline' }} onClick={markAllRead}>
                      Mark all read
                    </Text>
                  )}
                </HStack>

                <Box maxH="380px" overflowY="auto"
                  sx={{ '&::-webkit-scrollbar': { w: '4px' }, '&::-webkit-scrollbar-thumb': { bg: subtleBg, borderRadius: 'full' } }}>
                  {NOTIFICATIONS.map((n, i) => {
                    const isUnread = n.unread && !readIds.has(n.id);
                    return (
                      <Box key={n.id}>
                        {i > 0 && <Box h="1px" bg={subtleBorder} />}
                        <HStack px={4} py={3} spacing={3} align="flex-start"
                          bg={isUnread ? `${n.color}08` : 'transparent'}
                          _hover={{ bg: subtleBg }} transition="bg .15s" cursor="pointer"
                          onClick={() => setReadIds(prev => new Set([...prev, n.id]))}>
                          <Box w={8} h={8} borderRadius="full" flexShrink={0}
                            display="flex" alignItems="center" justifyContent="center"
                            style={{ background: `${n.color}18` }}>
                            <n.icon size={15} strokeWidth={2} color={n.color} />
                          </Box>
                          <Box flex={1} minW={0}>
                            <HStack justify="space-between" mb={0.5}>
                              <Text fontSize="xs" fontWeight={isUnread ? '700' : '600'} color={headingColor} noOfLines={1}>
                                {n.title}
                              </Text>
                              <Text fontSize="10px" color={mutedColor} flexShrink={0} ml={2}>{n.time}</Text>
                            </HStack>
                            <Text fontSize="11px" color={mutedColor} lineHeight="1.5" noOfLines={2}>
                              {n.body}
                            </Text>
                          </Box>
                          {isUnread && (
                            <Box w="7px" h="7px" borderRadius="full" bg="#ef4444" flexShrink={0} mt={1} />
                          )}
                        </HStack>
                      </Box>
                    );
                  })}
                </Box>

                <Box px={4} py={3} borderTop="1px solid" borderColor={subtleBorder}
                  textAlign="center" cursor="pointer" _hover={{ bg: subtleBg }} transition="bg .15s">
                  <Text fontSize="xs" color={mutedColor} fontWeight="600">View all notifications</Text>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>}

          {/* Bookmarks popover */}
          {isLoggedIn && <Popover placement="bottom-end" gutter={8}>
            <PopoverTrigger>
              <Box as="button" position="relative" cursor="pointer" bg="transparent" border="none" p={1}
                color={mutedColor} _hover={{ color: headingColor }} transition="color .15s"
                style={{ outline: 'none', display: 'flex', alignItems: 'center' }}>
                <Bookmark size={18} strokeWidth={2} />
                {bookmarks.length > 0 && (
                  <Box position="absolute" top="-1px" right="-1px"
                    w="14px" h="14px" borderRadius="full" bg="#ffd700"
                    display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="8px" fontWeight="900" color="gray.900" lineHeight="1">
                      {bookmarks.length > 9 ? '9+' : bookmarks.length}
                    </Text>
                  </Box>
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent bg={menuBg} borderColor={borderColor} w="320px"
              boxShadow="0 8px 32px rgba(0,0,0,.3)" borderRadius="xl" overflow="hidden">
              <PopoverBody p={0}>
                {/* Header */}
                <HStack px={4} py={3} borderBottom="1px solid" borderColor={subtleBorder}
                  justify="space-between">
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="800" color={headingColor}>Bookmarks</Text>
                    {bookmarks.length > 0 && (
                      <Box bg="rgba(255,215,0,0.15)" borderRadius="full" px={1.5}>
                        <Text fontSize="10px" fontWeight="700" color="#ffd700">{bookmarks.length}</Text>
                      </Box>
                    )}
                  </HStack>
                  <Text fontSize="xs" color="#ffd700" fontWeight="700" cursor="pointer"
                    onClick={() => navigate('/bookmarks')}>
                    View all →
                  </Text>
                </HStack>

                {bookmarks.length === 0 ? (
                  <VStack py={10} spacing={2}>
                    <Text fontSize="2xl">🔖</Text>
                    <Text fontSize="sm" fontWeight="600" color={headingColor}>No bookmarks yet</Text>
                    <Text fontSize="xs" color={mutedColor} textAlign="center" maxW="200px">
                      Tap the bookmark icon on any market to save it here.
                    </Text>
                  </VStack>
                ) : (
                  <Box maxH="340px" overflowY="auto"
                    sx={{ '&::-webkit-scrollbar': { w: '4px' }, '&::-webkit-scrollbar-thumb': { bg: subtleBg, borderRadius: 'full' } }}>
                    {bookmarks.slice(0, 8).map((m: any, i: number) => (
                      <Box key={m.contractId ?? m.id}>
                        {i > 0 && <Box h="1px" bg={subtleBorder} />}
                        <HStack px={4} py={3} cursor="pointer" spacing={3}
                          _hover={{ bg: subtleBg }} transition="bg .15s"
                          onClick={() => openMarketDetail(m)}>
                          <Box w={8} h={8} borderRadius="md" bg={subtleBg} flexShrink={0}
                            display="flex" alignItems="center" justifyContent="center" fontSize="1rem">
                            {m.category === 'Elections' ? '🗳️' : m.category === 'Sports' ? '⚽' :
                             m.category === 'Music' ? '🎵' : m.category === 'Crypto' ? '₿' :
                             m.category === 'Economy' ? '💹' : m.category === 'Commodities' ? '📦' :
                             m.category === 'Security' ? '🔒' : m.category === 'Politics' ? '🏛️' :
                             m.category === 'Tech' ? '💻' : m.category === 'Weather' ? '☁️' : '📊'}
                          </Box>
                          <Box flex={1} minW={0}>
                            <Text fontSize="xs" fontWeight="700" color={headingColor} noOfLines={2} lineHeight="1.4">
                              {m.title || m.description}
                            </Text>
                            <Text fontSize="10px" color={mutedColor} mt={0.5}>{m.category}</Text>
                          </Box>
                          <Text fontSize="sm" fontWeight="800" color="#22c55e" flexShrink={0}>
                            {(() => {
                              const yp = 1 / (m.yesOdds || 1.9);
                              const np = 1 / (m.noOdds  || 1.9);
                              return Math.round((yp / (yp + np)) * 100);
                            })()}%
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                    {bookmarks.length > 8 && (
                      <Box px={4} py={3} borderTop="1px solid" borderColor={subtleBorder}
                        textAlign="center" cursor="pointer" _hover={{ bg: subtleBg }}
                        onClick={() => navigate('/bookmarks')}>
                        <Text fontSize="xs" color="#ffd700" fontWeight="700">
                          +{bookmarks.length - 8} more — View all
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>}

          {/* Profile menu */}
          <Menu>
            <MenuButton as={Button} variant="ghost" p={1}>
              <HStack spacing={1}>
                {displayPhoto
                  ? <img src={displayPhoto} alt="av" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  : <Box w={8} h={8} borderRadius="full" bg="linear-gradient(135deg,#4ade80,#60a5fa)"
                      display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="sm" fontWeight="800" color="white">{initials}</Text>
                    </Box>
                }
                <Text fontSize="xs" color={chevronColor}>▾</Text>
              </HStack>
            </MenuButton>

            <MenuList bg={menuBg} borderColor={borderColor} minW="220px" py={2} boxShadow="0 8px 32px rgba(0,0,0,.3)">
              {/* Profile header */}
              <Box px={4} py={3} borderBottom="1px solid" borderColor={subtleBorder} mb={1}>
                <HStack justify="space-between">
                  <HStack spacing={2} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity .15s"
                    onClick={() => navigate('/portfolio')}>
                    {displayPhoto
                      ? <img src={displayPhoto} alt="av" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      : <Box w={7} h={7} borderRadius="full" bg="linear-gradient(135deg,#38bdf8,#4ade80)"
                          display="flex" alignItems="center" justifyContent="center">
                          <Text fontSize="xs" fontWeight="800" color="white">{initials}</Text>
                        </Box>
                    }
                    <Text fontSize="sm" fontWeight="700" color={profileNameColor}>
                      {displayName || (displayAddress ? displayAddress.slice(0, 6) + '...' + displayAddress.slice(-4) : 'Guest')}
                    </Text>
                  </HStack>
                  <Box w={7} h={7} borderRadius="full" border="1px solid" borderColor={borderMd}
                    display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                    color={mutedColor} _hover={{ borderColor: '#ffd700', color: headingColor }}
                    transition="all .15s" onClick={() => navigate('/settings')}>
                    <Settings size={13} strokeWidth={2} />
                  </Box>
                </HStack>
              </Box>

              <MenuItem icon={<Trophy size={14} strokeWidth={2} />} _hover={{ bg: subtleBg }}
                onClick={() => navigate('/leaderboard')}>Leaderboard</MenuItem>
              <MenuItem icon={<Gift size={14} strokeWidth={2} />} _hover={{ bg: subtleBg }}>Rewards</MenuItem>
              <MenuItem icon={<Plug size={14} strokeWidth={2} />} _hover={{ bg: subtleBg }}>APIs</MenuItem>
              {isLoggedIn && (
                <MenuItem icon={<Users size={14} strokeWidth={2} />} _hover={{ bg: subtleBg }}>
                  <HStack justify="space-between" w="full">
                    <Text>Refer &amp; Earn</Text>
                    <Text fontSize="9px" fontWeight="700" color="#ffd700" bg="rgba(255,215,0,0.12)"
                      px={1.5} py={0.5} borderRadius="full">Soon</Text>
                  </HStack>
                </MenuItem>
              )}
              {isLoggedIn && (
                <MenuItem icon={<Code2 size={14} strokeWidth={2} />} _hover={{ bg: subtleBg }}>
                  <HStack justify="space-between" w="full">
                    <Text>Builders</Text>
                    <Text fontSize="9px" fontWeight="700" color="#ffd700" bg="rgba(255,215,0,0.12)"
                      px={1.5} py={0.5} borderRadius="full">Soon</Text>
                  </HStack>
                </MenuItem>
              )}

              <Box px={3} py={2} display="flex" alignItems="center" justifyContent="space-between"
                _hover={{ bg: subtleBg }} cursor="pointer" onClick={toggleColorMode}>
                <HStack spacing={3}>
                  <Moon size={14} strokeWidth={2} />
                  <Text fontSize="sm" color={textColor}>Dark mode</Text>
                </HStack>
                <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} colorScheme="green" size="sm" />
              </Box>

              <Divider borderColor={subtleBorder} my={1} />

              <MenuItem fontSize="sm" color={mutedColor} _hover={{ bg: subtleBg }}>Accuracy</MenuItem>
              <MenuItem fontSize="sm" color={mutedColor} _hover={{ bg: subtleBg }}>Support</MenuItem>
              <MenuItem fontSize="sm" color={mutedColor} _hover={{ bg: subtleBg }}>Documentation</MenuItem>
              <MenuItem fontSize="sm" color={mutedColor} _hover={{ bg: subtleBg }}>Help Center</MenuItem>
              <MenuItem fontSize="sm" color={mutedColor} _hover={{ bg: subtleBg }}>Terms of Use</MenuItem>

              {/* Language submenu */}
              <Menu placement="right">
                <MenuButton as={Box} px={3} py={2} cursor="pointer" w="full" _hover={{ bg: subtleBg }}
                  display="flex" alignItems="center" justifyContent="space-between">
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color={mutedColor}>{language.flag} {language.label}</Text>
                    <Text fontSize="xs" color="gray.400">›</Text>
                  </HStack>
                </MenuButton>
                <MenuList bg={menuBg} borderColor={borderColor} minW="160px" boxShadow="0 8px 32px rgba(0,0,0,.3)">
                  {LANGUAGES.map(l => (
                    <MenuItem key={l.code} onClick={() => onLanguageChange(l)}
                      bg={language.code === l.code ? subtleBg : 'transparent'}
                      _hover={{ bg: subtleBg }} fontSize="sm">
                      <HStack justify="space-between" w="full">
                        <HStack spacing={2}>
                          <Text>{l.flag}</Text>
                          <Text color={textColor}>{l.label}</Text>
                        </HStack>
                        {language.code === l.code && <Text color="#4ade80" fontSize="sm">●</Text>}
                      </HStack>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Divider borderColor={subtleBorder} my={1} />

              {isAdminUser && (
              <MenuItem icon={<ShieldAlert size={14} strokeWidth={2} />} fontWeight="700" color="#ffd700"
                _hover={{ bg: subtleBg }} onClick={() => navigate('/admin')}>
                Admin Dashboard
              </MenuItem>
              )}

              {isLoggedIn && (
                <MenuItem icon={<LogOut size={14} strokeWidth={2} />} fontSize="sm" color="#f87171" fontWeight="600"
                  _hover={{ bg: subtleBg }} onClick={onLogout}>Logout</MenuItem>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Box>

      {/* ── Category strip ── */}
      <Box px={{ base: 0, md: 8 }} py={0} borderTop="1px solid" borderColor={borderColor}
        overflowX="auto" whiteSpace="nowrap" display="flex"
        sx={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
        <HStack spacing={0} fontSize="sm" fontWeight="medium" px={{ base: 2, md: 0 }}>
          {CATEGORIES.map(c => (
            <React.Fragment key={c.key}>
              {(c as any).separator && (
                <Box w="1px" h="18px" bg={borderColor} mx={2} flexShrink={0} alignSelf="center" />
              )}
              <Box px={4} py={3} cursor="pointer" position="relative"
                color={activeCategory === c.key ? '#ffd700' : activeCatColor}
                fontWeight={activeCategory === c.key ? '700' : (c as any).separator ? '700' : '500'}
                _hover={{ color: '#ffd700' }} transition="color .15s"
                onClick={() => onCategoryChange(c.key, SPECIAL_KEYS.has(c.key))}>
                {c.label}
                {activeCategory === c.key && (
                  <Box position="absolute" bottom={0} left={0} right={0} h="2px" bg="#ffd700" borderRadius="full" />
                )}
              </Box>
            </React.Fragment>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
