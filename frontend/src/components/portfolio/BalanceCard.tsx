import React, { useState } from 'react';
import { Box, Button, HStack, SimpleGrid, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
const LOGO2 = '/mylogo2.png';
import AppChart from '../shared/AppChart';
import { Link2, Pencil, Share2, ArrowDown, ArrowUp } from 'lucide-react';

const PNL_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: '',
  value: +(Math.sin(i * 0.55 + 1.2) * 2.5 + Math.sin(i * 0.3) * 1.5).toFixed(2),
}));

interface BalanceCardProps {
  displayName: string | null;
  displayAddress: string | null;
  displayPhoto: string | null;
  portfolioValue: number;
  onDeposit: () => void;
  onWithdraw: () => void;
  onSettings: () => void;
}

export default function BalanceCard({
  displayName, displayAddress, displayPhoto, portfolioValue, onDeposit, onWithdraw, onSettings,
}: BalanceCardProps) {
  const [pnlRange, setPnlRange] = useState<'1D' | '1W' | '1M' | 'ALL'>('ALL');
  const { colorMode } = useColorMode();

  const pageBg       = useColorModeValue('#f8fafc', '#070b14');
  const cardBg       = useColorModeValue('#ffffff', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const subtleBorder = useColorModeValue('#f1f5f9', '#1e293b');
  const borderMd     = useColorModeValue('#cbd5e1', '#334155');
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const textColor    = useColorModeValue('#1e293b', '#e2e8f0');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');
  const pnlBg        = useColorModeValue('blue.50', 'rgba(96,165,250,0.05)');

  const displayLabel = displayName
    || (displayAddress ? displayAddress.slice(0, 6) + '...' + displayAddress.slice(-4) : '0xGuest');
  const avatarLetter = (displayName || displayAddress || 'U')[0].toUpperCase();

  const pnlRangeLabel =
    pnlRange === '1D' ? 'Past Day' :
    pnlRange === '1W' ? 'Past Week' :
    pnlRange === '1M' ? 'Past Month' : 'All Time';

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mb={6}>

      {/* ── Profile card ── */}
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" p={6}>
        <HStack spacing={4} mb={4}>
          {displayPhoto
            ? <img src={displayPhoto} alt="av" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #1e293b' }} />
            : <Box w="52px" h="52px" borderRadius="full" bg="linear-gradient(135deg,#38bdf8,#4ade80)"
                display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <Text fontSize="xl" fontWeight="900" color="white">{avatarLetter}</Text>
              </Box>
          }
          <Box flex={1} minW={0}>
            <HStack spacing={2} mb={0.5}>
              <Text fontWeight="800" fontSize="sm" color={headingColor} isTruncated>{displayLabel}</Text>
              <HStack spacing={1}>
                <Box w={6} h={6} borderRadius="md" border="1px solid" borderColor={borderMd}
                  display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                  color={mutedColor} _hover={{ borderColor: '#ffd700', color: headingColor }}
                  transition="all .15s" title="Copy profile link">
                  <Link2 size={11} strokeWidth={2.2} />
                </Box>
                <Box w={6} h={6} borderRadius="md" border="1px solid" borderColor={borderMd}
                  display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                  color={mutedColor} _hover={{ borderColor: '#ffd700', color: headingColor }}
                  transition="all .15s" title="Edit profile" onClick={onSettings}>
                  <Pencil size={11} strokeWidth={2.2} />
                </Box>
                <Box w={6} h={6} borderRadius="md" border="1px solid" borderColor={borderMd}
                  display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                  color={mutedColor} _hover={{ borderColor: '#ffd700', color: headingColor }}
                  transition="all .15s" title="Share">
                  <Share2 size={11} strokeWidth={2.2} />
                </Box>
              </HStack>
            </HStack>
            <Text fontSize="xs" color="gray.400">Joined Apr 2026 · 0 views</Text>
          </Box>
        </HStack>

        {/* Stats row */}
        <HStack spacing={0} mb={5} borderRadius="xl" overflow="hidden" border="1px solid" borderColor={subtleBorder}>
          {[
            { label: 'Positions Value', value: `$${portfolioValue.toFixed(2)}` },
            { label: 'Biggest Win',     value: '—' },
            { label: 'Predictions',     value: '0' },
          ].map((s, i) => (
            <Box key={s.label} flex={1} px={3} py={3} textAlign="center"
              borderRight={i < 2 ? '1px solid' : 'none'} borderColor={subtleBorder} bg={pageBg}
            >
              <Text fontSize="sm" fontWeight="800" color={headingColor} mb={0.5}>{s.value}</Text>
              <Text fontSize="10px" color="gray.400" lineHeight="1.2">{s.label}</Text>
            </Box>
          ))}
        </HStack>

        <HStack spacing={3}>
          <Button flex={1} borderRadius="xl" fontWeight="700" fontSize="sm"
            bg="linear-gradient(135deg,#3b82f6,#2563eb)" color="white"
            leftIcon={<ArrowDown size={14} strokeWidth={2.5} />}
            _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
            onClick={onDeposit}
          >Deposit</Button>
          <Button flex={1} variant="outline" borderRadius="xl" fontWeight="700" fontSize="sm"
            borderColor={borderMd} color={textColor}
            leftIcon={<ArrowUp size={14} strokeWidth={2.5} />}
            _hover={{ borderColor: '#ffd700', color: '#ffd700' }} transition="all .2s"
            onClick={onWithdraw}
          >Withdraw</Button>
        </HStack>
      </Box>

      {/* ── PnL card ── */}
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" p={6}>
        <HStack justify="space-between" mb={1}>
          <HStack spacing={2}>
            <Box w={2} h={2} borderRadius="full" bg="#60a5fa" flexShrink={0} />
            <Text fontSize="sm" fontWeight="600" color={mutedColor}>Profit/Loss</Text>
          </HStack>
          <HStack spacing={1}>
            {(['1D', '1W', '1M', 'ALL'] as const).map(r => (
              <Button key={r} size="xs"
                bg={pnlRange === r ? borderColor : 'transparent'}
                color={pnlRange === r ? headingColor : mutedColor}
                fontWeight="700" borderRadius="md" px={2.5} minW="auto" h="22px" fontSize="xs"
                _hover={{ bg: subtleBorder }}
                onClick={() => setPnlRange(r)}
              >{r}</Button>
            ))}
            <HStack spacing={1} ml={2} opacity={0.55}>
              <img src={LOGO2} alt="Afridict" style={{ width: 14, height: 14, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
              <Text fontSize="10px" fontWeight="700" color={mutedColor}>Afridict</Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack spacing={2} mb={0.5}>
          <Text fontSize="3xl" fontWeight="900" color={headingColor}>$0.00</Text>
          <Box w={5} h={5} borderRadius="full" border="1px solid" borderColor={borderMd}
            display="flex" alignItems="center" justifyContent="center" cursor="pointer"
            color={mutedColor} _hover={{ borderColor: '#ffd700', color: headingColor }}
            transition="all .15s" title="Share P&L">
            <Share2 size={11} strokeWidth={2.2} />
          </Box>
        </HStack>
        <Text fontSize="xs" color="gray.400" mb={4}>{pnlRangeLabel}</Text>

        <Box h="80px" borderRadius="lg" overflow="hidden" bg={pnlBg}>
          <AppChart
            data={PNL_DATA}
            color="#60a5fa"
            height={80}
            showXAxis={false}
            showYAxis={false}
            showGrid={false}
            tooltipLabel="P&L"
          />
        </Box>
      </Box>
    </SimpleGrid>
  );
}
