import React, { memo, useState, useMemo } from 'react';
import { Badge, Box, Button, HStack, Input, Text, useColorModeValue } from '@chakra-ui/react';
import { Search, ArrowUpDown, BarChart2 } from 'lucide-react';

interface Position {
  market: string;
  side: string;
  avg: number;
  now: number;
  traded: number;
  toWin: number;
  value: number;
  category: string;
}

interface PositionsTableProps {
  positions: Position[];
}

function PositionsTable({ positions }: PositionsTableProps) {
  const [positionFilter, setPositionFilter] = useState<'Active' | 'Closed'>('Active');
  const [positionSearch, setPositionSearch] = useState('');

  const cardBg        = useColorModeValue('#ffffff', '#111827');
  const borderColor   = useColorModeValue('#e2e8f0', '#1e293b');
  const subtleBorder  = useColorModeValue('#f1f5f9', '#1e293b');
  const subtleBg      = useColorModeValue('#f1f5f9', '#1e293b');
  const borderMd      = useColorModeValue('#cbd5e1', '#334155');
  const deepBg        = useColorModeValue('#e2e8f0', '#162032');
  const rowHoverBg    = useColorModeValue('#f1f5f9', '#162032');
  const headingColor  = useColorModeValue('#0f172a', '#f8fafc');
  const textColor     = useColorModeValue('#1e293b', '#e2e8f0');
  const toggleBg      = useColorModeValue('#e2e8f0', '#162032');
  const inactiveColor = useColorModeValue('gray.400', '#64748b');
  const sortBtnColor  = useColorModeValue('gray.600', '#94a3b8');
  const activeBoxShadow = useColorModeValue('sm', 'none') as string;
  const avgColor      = useColorModeValue('gray.600', '#94a3b8');

  const filtered = useMemo(() =>
    positions.filter(p => p.market.toLowerCase().includes(positionSearch.toLowerCase())),
  [positions, positionSearch]);

  return (
    <>
      {/* Sub-controls row */}
      <HStack px={5} py={3} borderBottom="1px solid" borderColor={subtleBorder} justify="space-between">
        <HStack spacing={1} bg={toggleBg} borderRadius="lg" p={1}>
          {(['Active', 'Closed'] as const).map(f => (
            <Button key={f} size="sm" h="28px" px={4} borderRadius="md" fontWeight="700" fontSize="xs"
              bg={positionFilter === f ? cardBg : 'transparent'}
              color={positionFilter === f ? headingColor : 'gray.400'}
              boxShadow={positionFilter === f ? activeBoxShadow : 'none'}
              border={positionFilter === f ? '1px solid' : '1px solid transparent'}
              borderColor={positionFilter === f ? borderColor : 'transparent'}
              onClick={() => setPositionFilter(f)}
            >{f}</Button>
          ))}
        </HStack>

        <HStack spacing={2} flex={1} maxW="380px" mx={4}>
          <HStack bg={subtleBg} borderRadius="lg" px={3} py={1.5} border="1px solid" borderColor={borderMd} flex={1}>
            <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
            <Input variant="unstyled" placeholder="Search positions..." fontSize="xs"
              color={textColor} _placeholder={{ color: 'gray.400' }}
              value={positionSearch} onChange={e => setPositionSearch(e.target.value)}
            />
          </HStack>
        </HStack>

        <Button size="sm" variant="outline" borderRadius="lg" fontWeight="700" fontSize="xs"
          borderColor={borderMd} color={sortBtnColor}
          leftIcon={<ArrowUpDown size={11} strokeWidth={2.2} />}
          _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
        >Value</Button>
      </HStack>

      {/* Column headers */}
      <Box px={6} py={2} display="grid" gridTemplateColumns="3fr 1fr 1fr 1fr" gap={4}
        borderBottom="1px solid" borderColor={subtleBorder}
      >
        {['MARKET', 'AVG', 'CURRENT', 'VALUE'].map(h => (
          <Text key={h} fontSize="10px" fontWeight="700" color="gray.400" letterSpacing="wider"
            cursor="pointer" _hover={{ color: headingColor }}
          >
            <HStack spacing={1} display="inline-flex" align="center">
              <span>{h}</span><ArrowUpDown size={9} />
            </HStack>
          </Text>
        ))}
      </Box>

      {/* Position rows */}
      {filtered.map((p, i) => (
        <Box key={i} px={6} py={4} display="grid" gridTemplateColumns="3fr 1fr 1fr 1fr" gap={4} alignItems="center"
          borderBottom="1px solid" borderColor={deepBg}
          _hover={{ bg: rowHoverBg }} transition="background 0.15s"
          cursor="pointer" style={{ animation: `fadeIn 0.3s ease ${i * 0.07}s both` }}
        >
          <Box>
            <HStack spacing={1.5} mb={1}>
              <Badge fontSize="9px" px={1.5} borderRadius="sm"
                bg={p.side === 'YES' ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.15)'}
                color={p.side === 'YES' ? '#4ade80' : '#f87171'}
                border="1px solid"
                borderColor={p.side === 'YES' ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)'}
              >{p.side}</Badge>
              <Badge fontSize="9px" px={1.5} borderRadius="sm" variant="outline" colorScheme="blue">{p.category}</Badge>
            </HStack>
            <Text fontSize="sm" fontWeight="600" color={headingColor} lineHeight="1.4" noOfLines={2}>{p.market}</Text>
          </Box>
          <Text fontSize="sm" fontWeight="600" color={avgColor}>{p.avg}¢</Text>
          <Text fontSize="sm" fontWeight="700" color={p.now > p.avg ? '#4ade80' : '#f87171'}>{p.now}¢</Text>
          <Text fontSize="sm" fontWeight="700" color={headingColor}>${p.value.toFixed(2)}</Text>
        </Box>
      ))}

      {filtered.length === 0 && (
        <Box py={16} textAlign="center">
          <Box mb={3} color="gray.400"><BarChart2 size={36} strokeWidth={1.5} /></Box>
          {positions.length === 0 ? (
            <>
              <Text fontSize="sm" fontWeight="700" color={headingColor} mb={1}>No open positions yet</Text>
              <Text fontSize="xs" color={inactiveColor} mb={4}>
                Browse markets and place your first prediction.
              </Text>
              <Button size="sm" bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                fontWeight="700" borderRadius="lg" px={5}
                _hover={{ opacity: .9 }} transition="all .15s"
                onClick={() => window.location.href = '/'}>
                Browse Markets
              </Button>
            </>
          ) : (
            <Text fontSize="sm" color="gray.400">No positions match your search.</Text>
          )}
        </Box>
      )}
    </>
  );
}

export default memo(PositionsTable);
