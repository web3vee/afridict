import React, { memo, useMemo } from 'react';
import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react';

interface Level { price: number; shares: number; }
interface OrderBookProps {
  asks: Level[];
  bids: Level[];
  last: number;
  spread: number;
}

function OrderBook({ asks, bids, last, spread }: OrderBookProps) {
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b', '#64748b');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const rowHoverAsk  = useColorModeValue('rgba(248,113,113,0.08)', 'rgba(248,113,113,0.08)');
  const rowHoverBid  = useColorModeValue('rgba(74,222,128,0.08)',  'rgba(74,222,128,0.08)');
  const spreadBg     = useColorModeValue('#f8fafc', '#0d1219');
  const askColor     = '#ef4444';
  const bidColor     = '#22c55e';
  const askBarColor  = 'rgba(239,68,68,0.12)';
  const bidBarColor  = 'rgba(34,197,94,0.12)';

  const { cumAsks, cumBids, maxSize, maxCum } = useMemo(() => {
    const allSizes = [...asks, ...bids].map(l => l.shares);
    const cumA = asks.reduce<Level[]>((acc, a, i) => {
      const prev = acc[i - 1]?.shares ?? 0;
      return [...acc, { price: a.price, shares: +(prev + a.shares).toFixed(2) }];
    }, []);
    const cumB = bids.reduce<Level[]>((acc, b, i) => {
      const prev = acc[i - 1]?.shares ?? 0;
      return [...acc, { price: b.price, shares: +(prev + b.shares).toFixed(2) }];
    }, []);
    return {
      cumAsks: cumA,
      cumBids: cumB,
      maxSize: Math.max(...allSizes),
      maxCum:  Math.max(...cumA.map(a => a.shares), ...cumB.map(b => b.shares)),
    };
  }, [asks, bids]);

  return (
    <Box fontFamily="'SF Mono', 'Fira Code', monospace">
      {/* Header */}
      <HStack px={3} py={2} justify="space-between">
        <Text fontSize="10px" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="wider">Price (¢)</Text>
        <Text fontSize="10px" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="wider">Size</Text>
        <Text fontSize="10px" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="wider">Total ($)</Text>
      </HStack>

      {/* Asks — reversed so best ask is closest to spread */}
      {[...asks].reverse().map((a, i) => {
        const ri    = asks.length - 1 - i;
        const cum   = cumAsks[ri];
        const barW  = `${(cum.shares / maxCum) * 100}%`;
        const total = (a.price * a.shares / 100).toFixed(2);
        return (
          <Box key={`ask-${i}`} position="relative" cursor="default"
            _hover={{ bg: rowHoverAsk }} transition="bg .1s">
            {/* Depth bar */}
            <Box position="absolute" right={0} top={0} bottom={0} w={barW}
              bg={askBarColor} borderRadius="2px 0 0 2px" transition="width .3s" />
            <HStack position="relative" zIndex={1} px={3} py={1.5} justify="space-between">
              <Text fontSize="sm" fontWeight="700" color={askColor} minW="45px">{a.price}</Text>
              <Text fontSize="sm" color={headingColor} minW="50px" textAlign="right">{a.shares.toFixed(2)}</Text>
              <Text fontSize="sm" color={mutedColor} minW="55px" textAlign="right">${total}</Text>
            </HStack>
          </Box>
        );
      })}

      {/* Spread bar */}
      <Box bg={spreadBg} borderTop="1px solid" borderBottom="1px solid" borderColor={borderColor} py={1.5} px={3}>
        <HStack justify="space-between">
          <Text fontSize="11px" fontWeight="700" color={mutedColor}>
            Last: <Text as="span" color={headingColor}>{last}¢</Text>
          </Text>
          <Text fontSize="11px" fontWeight="700" color={mutedColor}>
            Spread: <Text as="span" color={headingColor}>{spread}¢</Text>
          </Text>
          <Text fontSize="11px" fontWeight="700" color={mutedColor}>
            Mid: <Text as="span" color={headingColor}>{Math.round((asks[asks.length-1].price + bids[0].price) / 2)}¢</Text>
          </Text>
        </HStack>
      </Box>

      {/* Bids */}
      {bids.map((b, i) => {
        const cum   = cumBids[i];
        const barW  = `${(cum.shares / maxCum) * 100}%`;
        const total = (b.price * b.shares / 100).toFixed(2);
        return (
          <Box key={`bid-${i}`} position="relative" cursor="default"
            _hover={{ bg: rowHoverBid }} transition="bg .1s">
            <Box position="absolute" right={0} top={0} bottom={0} w={barW}
              bg={bidBarColor} borderRadius="2px 0 0 2px" transition="width .3s" />
            <HStack position="relative" zIndex={1} px={3} py={1.5} justify="space-between">
              <Text fontSize="sm" fontWeight="700" color={bidColor} minW="45px">{b.price}</Text>
              <Text fontSize="sm" color={headingColor} minW="50px" textAlign="right">{b.shares.toFixed(2)}</Text>
              <Text fontSize="sm" color={mutedColor} minW="55px" textAlign="right">${total}</Text>
            </HStack>
          </Box>
        );
      })}
    </Box>
  );
}

export default memo(OrderBook);
