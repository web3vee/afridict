import React, { useState, useMemo } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalBody,
  Badge, Box, HStack, Input, SimpleGrid, Text, VStack,
  useColorModeValue,
} from '@chakra-ui/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: any[];
  onSelect: (market: any) => void;
}

const FILTERS = [
  { label: '🔥 Trending',    color: '#ffd700' },
  { label: '🆕 New',         color: '#4ade80' },
  { label: '⚡ Live',        color: '#f87171' },
  { label: '⏰ Ending Soon', color: '#60a5fa' },
  { label: '💰 High Pool',   color: '#a78bfa' },
];

const TOPICS = [
  { icon: '🗳️', label: 'Elections', color: '#ffd700', bg: 'rgba(255,215,0,.08)' },
  { icon: '⚽',  label: 'Sports',    color: '#4ade80', bg: 'rgba(74,222,128,.08)' },
  { icon: '🎵',  label: 'Music',     color: '#f472b6', bg: 'rgba(244,114,182,.08)' },
  { icon: '₿',   label: 'Crypto',    color: '#a78bfa', bg: 'rgba(167,139,250,.08)' },
  { icon: '💹',  label: 'Economy',   color: '#60a5fa', bg: 'rgba(96,165,250,.08)' },
  { icon: '🏛️', label: 'Politics',  color: '#34d399', bg: 'rgba(52,211,153,.08)' },
  { icon: '💻',  label: 'Tech',      color: '#38bdf8', bg: 'rgba(56,189,248,.08)' },
  { icon: '🔒',  label: 'Security',  color: '#f87171', bg: 'rgba(248,113,113,.08)' },
];

function categoryIcon(cat: string) {
  if (cat === 'Sports')    return '⚽';
  if (cat === 'Elections') return '🗳️';
  if (cat === 'Crypto')    return '₿';
  if (cat === 'Music')     return '🎵';
  return '📊';
}

export default function SearchModal({ isOpen, onClose, markets, onSelect }: SearchModalProps) {
  const [query, setQuery]               = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const isDark           = useColorModeValue(false, true);
  const modalBg          = useColorModeValue('white', '#0f1623');
  const borderColor      = useColorModeValue('gray.200', '#1e293b');
  const inputDivider     = useColorModeValue('gray.100', '#1e293b');
  const inputColor       = useColorModeValue('gray.900', 'white');
  const escBg            = useColorModeValue('gray.100', '#1e293b');
  const escColor         = useColorModeValue('gray.500', 'gray.400');
  const escBorder        = useColorModeValue('gray.200', '#374151');
  const filterBg         = useColorModeValue('gray.100', '#1e293b');
  const filterBorder     = useColorModeValue('gray.200', '#374151');
  const filterColor      = useColorModeValue('gray.700', 'gray.200');
  const topicLightBg     = 'gray.50';
  const topicLabelColor  = useColorModeValue('gray.700', 'gray.200');
  const marketRowBg      = useColorModeValue('gray.50', '#1e293b');
  const marketRowBorder  = useColorModeValue('gray.200', '#2d3748');
  const marketRowHoverBg = useColorModeValue('gray.100', '#253347');
  const marketTitleColor = useColorModeValue('gray.800', 'white');
  const iconBg           = useColorModeValue('gray.200', '#374151');
  const emptyStateColor  = useColorModeValue('gray.400', 'gray.500');

  // Derive whether we're in search/filter mode
  const isSearchMode = query.length >= 2 || activeFilter !== null;

  // Filtered / default results
  const displayedMarkets = useMemo(() => {
    let result = [...markets];

    // Apply text query filter
    if (query.length >= 2) {
      const q = query.toLowerCase();
      result = result.filter(
        m =>
          m.title?.toLowerCase().includes(q) ||
          m.category?.toLowerCase().includes(q),
      );
    }

    // Apply topic/category filter
    if (activeFilter !== null) {
      // Strip the emoji prefix from TOPICS label to get category name
      const topic = TOPICS.find(t => t.label === activeFilter);
      if (topic) {
        result = result.filter(m => m.category === topic.label);
      }

      // Special sort for High Pool filter tag
      if (activeFilter === '💰 High Pool') {
        result = [...result].sort((a, b) => (b.pool ?? 0) - (a.pool ?? 0));
      }
    }

    return isSearchMode ? result.slice(0, 8) : result.slice(0, 4);
  }, [markets, query, activeFilter, isSearchMode]);

  // Default trending — top 4 by pool
  const trendingMarkets = useMemo(
    () => [...markets].sort((a, b) => (b.pool ?? 0) - (a.pool ?? 0)).slice(0, 4),
    [markets],
  );

  const handleTopicClick = (label: string) => {
    setActiveFilter(prev => (prev === label ? null : label));
  };

  const handleFilterClick = (label: string) => {
    setActiveFilter(prev => (prev === label ? null : label));
  };

  const handleClose = () => {
    setQuery('');
    setActiveFilter(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)"/>
      <ModalContent bg={modalBg} border="1px solid" borderColor={borderColor}
        borderRadius="2xl" overflow="hidden" mt="80px"
        boxShadow="0 24px 80px rgba(0,0,0,.5)">

        {/* Search input */}
        <Box px={5} pt={5} pb={3} borderBottom="1px solid" borderColor={inputDivider}>
          <HStack spacing={3}>
            <Text fontSize="lg" color="gray.400">🔍</Text>
            <Input
              placeholder="Search markets, topics, events..."
              variant="unstyled"
              fontSize="md"
              fontWeight="500"
              color={inputColor}
              _placeholder={{ color: 'gray.400' }}
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Escape') handleClose(); }}
            />
            <Box px={2} py={0.5} borderRadius="md" fontSize="11px" fontWeight="700"
              bg={escBg} color={escColor} border="1px solid" borderColor={escBorder}
              cursor="pointer" onClick={handleClose}>ESC</Box>
          </HStack>
        </Box>

        <ModalBody px={5} py={4}>
          {/* Quick filters */}
          <HStack spacing={2} mb={5} flexWrap="wrap">
            {FILTERS.map(f => {
              const isActive = activeFilter === f.label;
              return (
                <Box
                  key={f.label}
                  px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="700"
                  bg={isActive ? `${f.color}22` : filterBg}
                  border="1px solid"
                  borderColor={isActive ? f.color : filterBorder}
                  color={isActive ? f.color : filterColor}
                  cursor="pointer"
                  _hover={{ borderColor: f.color, color: f.color }}
                  transition="all .15s"
                  onClick={() => handleFilterClick(f.label)}
                >
                  {f.label}
                </Box>
              );
            })}
          </HStack>

          {/* Topics */}
          <Text fontSize="11px" fontWeight="800" letterSpacing="widest" color="gray.400"
            textTransform="uppercase" mb={3}>Topics</Text>
          <SimpleGrid columns={4} spacing={3} mb={5}>
            {TOPICS.map(t => {
              const isActive = activeFilter === t.label;
              return (
                <Box
                  key={t.label}
                  p={3} borderRadius="xl"
                  bg={isDark ? (isActive ? t.bg : t.bg) : topicLightBg}
                  border="1px solid"
                  borderColor={isActive ? t.color : borderColor}
                  _hover={{ borderColor: t.color, transform: 'translateY(-1px)' }}
                  transition="all .18s"
                  cursor="pointer"
                  textAlign="center"
                  onClick={() => handleTopicClick(t.label)}
                >
                  <Text fontSize="2xl" mb={1}>{t.icon}</Text>
                  <Text fontSize="xs" fontWeight="700" color={isActive ? t.color : topicLabelColor}>
                    {t.label}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Results section */}
          {isSearchMode ? (
            <>
              <Text fontSize="11px" fontWeight="800" letterSpacing="widest" color="gray.400"
                textTransform="uppercase" mb={3}>
                {displayedMarkets.length > 0
                  ? `Results (${displayedMarkets.length})`
                  : 'Results'}
              </Text>

              {displayedMarkets.length === 0 ? (
                <Box py={8} textAlign="center">
                  <Text fontSize="2xl" mb={2}>🔍</Text>
                  <Text fontSize="sm" fontWeight="700" color={emptyStateColor}>No markets found</Text>
                  <Text fontSize="xs" color={emptyStateColor} mt={1}>
                    Try a different keyword or category
                  </Text>
                </Box>
              ) : (
                <VStack spacing={2}>
                  {displayedMarkets.map(m => (
                    <HStack key={m.id} w="full" p={3} borderRadius="xl"
                      bg={marketRowBg} border="1px solid" borderColor={marketRowBorder}
                      _hover={{ borderColor: '#ffd700', bg: marketRowHoverBg }}
                      transition="all .15s" cursor="pointer"
                      onClick={() => { onSelect(m); handleClose(); }}>
                      <Box w={8} h={8} borderRadius="lg" bg={iconBg}
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                        <Text fontSize="sm">{categoryIcon(m.category)}</Text>
                      </Box>
                      <Box flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="600" color={marketTitleColor} noOfLines={1}>{m.title}</Text>
                        <HStack spacing={2} mt={0.5}>
                          <Badge colorScheme="green" fontSize="9px">{m.category}</Badge>
                          <Text fontSize="10px" color="gray.400">${(m.pool / 1000).toFixed(1)}K Vol.</Text>
                        </HStack>
                      </Box>
                      <HStack spacing={1} flexShrink={0}>
                        <Box px={2} py={0.5} borderRadius="md" bg="rgba(74,222,128,.15)"
                          fontSize="11px" fontWeight="700" color="#4ade80">YES</Box>
                        <Box px={2} py={0.5} borderRadius="md" bg="rgba(248,113,113,.15)"
                          fontSize="11px" fontWeight="700" color="#f87171">NO</Box>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </>
          ) : (
            <>
              {/* Trending markets (default) */}
              <Text fontSize="11px" fontWeight="800" letterSpacing="widest" color="gray.400"
                textTransform="uppercase" mb={3}>Trending Markets</Text>
              <VStack spacing={2}>
                {trendingMarkets.map(m => (
                  <HStack key={m.id} w="full" p={3} borderRadius="xl"
                    bg={marketRowBg} border="1px solid" borderColor={marketRowBorder}
                    _hover={{ borderColor: '#ffd700', bg: marketRowHoverBg }}
                    transition="all .15s" cursor="pointer"
                    onClick={() => { onSelect(m); handleClose(); }}>
                    <Box w={8} h={8} borderRadius="lg" bg={iconBg}
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                      <Text fontSize="sm">{categoryIcon(m.category)}</Text>
                    </Box>
                    <Box flex={1} minW={0}>
                      <Text fontSize="sm" fontWeight="600" color={marketTitleColor} noOfLines={1}>{m.title}</Text>
                      <HStack spacing={2} mt={0.5}>
                        <Badge colorScheme="green" fontSize="9px">{m.category}</Badge>
                        <Text fontSize="10px" color="gray.400">${(m.pool / 1000).toFixed(1)}K Vol.</Text>
                      </HStack>
                    </Box>
                    <HStack spacing={1} flexShrink={0}>
                      <Box px={2} py={0.5} borderRadius="md" bg="rgba(74,222,128,.15)"
                        fontSize="11px" fontWeight="700" color="#4ade80">YES</Box>
                      <Box px={2} py={0.5} borderRadius="md" bg="rgba(248,113,113,.15)"
                        fontSize="11px" fontWeight="700" color="#f87171">NO</Box>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
