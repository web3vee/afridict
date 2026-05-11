import React from 'react';
import {
  Box, Heading, SimpleGrid, Text, VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import MarketCard from '../components/market/MarketCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { useApp } from '../context/AppContext';

export default function Bookmarks() {
  const { bookmarks } = useBookmarks();
  const { openMarketDetail, openBetYes, openBetNo, openEmbed } = useApp();

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b', '#94a3b8');
  const cardBg       = useColorModeValue('#ffffff', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>

      {/* Header */}
      <Box mb={8}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700"
          textTransform="uppercase" mb={1}>Saved</Text>
        <Heading fontSize="2xl" fontWeight="800" color={headingColor}>
          Your Bookmarks
        </Heading>
        {bookmarks.length > 0 && (
          <Text fontSize="sm" color={mutedColor} mt={1}>
            {bookmarks.length} market{bookmarks.length !== 1 ? 's' : ''} saved
          </Text>
        )}
      </Box>

      {bookmarks.length === 0 ? (
        <Box bg={cardBg} border="1px solid" borderColor={borderColor}
          borderRadius="2xl" p={16}>
          <VStack spacing={4}>
            <Text fontSize="4xl">🔖</Text>
            <Text fontSize="lg" fontWeight="700" color={headingColor}>Nothing saved yet</Text>
            <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="320px">
              Tap the bookmark icon on any market card or in the market detail view to save it here.
            </Text>
          </VStack>
        </Box>
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
  );
}
