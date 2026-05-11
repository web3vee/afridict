import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Button, HStack, Input, Text, VStack,
  useColorModeValue, useColorMode,
} from '@chakra-ui/react';
import { X, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Wallet } from 'lucide-react';

interface QuickBetModalProps {
  market: any | null;
  initialSide: 'yes' | 'no' | null;
  onClose: () => void;
  onBetSuccess: (side: 'yes' | 'no') => void;
}

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

type Step = 'bet' | 'confirm' | 'success';

export default function QuickBetModal({ market, initialSide, onClose, onBetSuccess }: QuickBetModalProps) {
  const { cashBalance, openDeposit } = useApp();
  const { colorMode } = useColorMode();

  const [side,    setSide]    = useState<'yes' | 'no'>(initialSide ?? 'yes');
  const [amount,  setAmount]  = useState('');
  const [step,    setStep]    = useState<Step>('bet');

  useEffect(() => {
    setSide(initialSide ?? 'yes');
    setAmount('');
    setStep('bet');
  }, [market, initialSide]);

  const modalBg     = useColorModeValue('#ffffff',  '#111827');
  const borderColor = useColorModeValue('#e2e8f0',  '#1e293b');
  const subtleBg    = useColorModeValue('#f8fafc',  '#0d1117');
  const headingColor= useColorModeValue('#0f172a',  '#f8fafc');
  const mutedColor  = useColorModeValue('#64748b',  '#94a3b8');
  const inputBg     = useColorModeValue('#f1f5f9',  '#1e293b');

  const odds = side === 'yes' ? (market?.yesOdds ?? 1.9) : (market?.noOdds ?? 1.9);
  const amt  = parseFloat(amount) || 0;
  const payout    = amt > 0 ? (amt * odds).toFixed(2) : '—';
  const profit    = amt > 0 ? ((amt * odds) - amt).toFixed(2) : '—';
  const insufficient = amt > cashBalance;
  const canBet    = amt > 0 && !insufficient;

  const yesColor = '#22c55e';
  const noColor  = '#ef4444';
  const activeColor = side === 'yes' ? yesColor : noColor;

  const yesChance = useMemo(() => {
    if (!market) return 50;
    const yp = 1 / (market.yesOdds || 1.9);
    const np = 1 / (market.noOdds  || 1.9);
    return Math.round((yp / (yp + np)) * 100);
  }, [market]);

  if (!market) return null;

  const handleConfirm = () => {
    setStep('success');
    setTimeout(() => {
      onBetSuccess(side);
      onClose();
    }, 1400);
  };

  return (
    <Box position="fixed" inset={0} bg="blackAlpha.700" zIndex={9999} backdropFilter="blur(4px)"
      display="flex" alignItems="center" justifyContent="center" px={4}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <Box bg={modalBg} borderRadius="2xl" border="1px solid" borderColor={borderColor}
        w="full" maxW="420px" boxShadow="0 24px 80px rgba(0,0,0,.5)" overflow="hidden">

        {/* Header */}
        <HStack px={5} py={4} borderBottom="1px solid" borderColor={borderColor} justify="space-between">
          <HStack spacing={2}>
            <Box w={2} h={2} borderRadius="full" bg="#4ade80" flexShrink={0}
              style={{ animation: 'lp-pulse 1.6s infinite' }} />
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" letterSpacing="wider">
              Place Prediction
            </Text>
          </HStack>
          <Box as="button" onClick={onClose} color={mutedColor} _hover={{ color: headingColor }}
            transition="color .15s" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <X size={18} strokeWidth={2} />
          </Box>
        </HStack>

        {step === 'success' ? (
          /* ── Success ── */
          <VStack py={12} spacing={3}>
            <Box color={activeColor}>
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </Box>
            <Text fontSize="xl" fontWeight="900" color={headingColor}>Bet Placed!</Text>
            <Text fontSize="sm" color={mutedColor}>
              ${amt.toFixed(2)} on <Text as="span" fontWeight="700" color={activeColor}>{side.toUpperCase()}</Text>
            </Text>
            <Text fontSize="xs" color={mutedColor}>Potential win: <Text as="span" fontWeight="700" color={headingColor}>${payout}</Text></Text>
          </VStack>

        ) : step === 'confirm' ? (
          /* ── Confirm ── */
          <Box px={5} py={5}>
            <Text fontSize="xs" fontWeight="700" color={mutedColor} textTransform="uppercase" mb={3}>Confirm Prediction</Text>

            <Box bg={subtleBg} borderRadius="xl" p={4} mb={4} border="1px solid" borderColor={borderColor}>
              <Text fontSize="sm" fontWeight="700" color={headingColor} lineHeight="1.4" mb={3} noOfLines={2}>
                {market.title}
              </Text>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="xs" color={mutedColor}>Your side</Text>
                <Box px={3} py={0.5} borderRadius="full" fontSize="xs" fontWeight="800"
                  bg={side === 'yes' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'}
                  color={activeColor}>
                  {side.toUpperCase()}
                </Box>
              </HStack>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="xs" color={mutedColor}>Amount</Text>
                <Text fontSize="sm" fontWeight="700" color={headingColor}>${amt.toFixed(2)}</Text>
              </HStack>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="xs" color={mutedColor}>Odds</Text>
                <Text fontSize="sm" fontWeight="700" color={headingColor}>{odds}×</Text>
              </HStack>
              <Box h="1px" bg={borderColor} my={2} />
              <HStack justify="space-between">
                <Text fontSize="xs" color={mutedColor}>Potential payout</Text>
                <Text fontSize="sm" fontWeight="900" color={activeColor}>${payout}</Text>
              </HStack>
            </Box>

            <HStack spacing={3}>
              <Button flex={1} size="md" variant="outline" borderRadius="xl"
                borderColor={borderColor} color={mutedColor}
                _hover={{ borderColor: headingColor }} onClick={() => setStep('bet')}>
                ← Back
              </Button>
              <Button flex={2} size="md" borderRadius="xl" fontWeight="800"
                bg={side === 'yes' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)'}
                color="white" _hover={{ opacity: .9 }} onClick={handleConfirm}>
                Confirm {side.toUpperCase()} — ${amt.toFixed(2)}
              </Button>
            </HStack>
          </Box>

        ) : cashBalance === 0 ? (
          /* ── Empty wallet ── */
          <VStack px={5} py={8} spacing={5} align="center">
            <Box w={16} h={16} borderRadius="full"
              bg="rgba(255,215,0,.1)" border="2px solid rgba(255,215,0,.3)"
              display="flex" alignItems="center" justifyContent="center">
              <Wallet size={28} color="#ffd700" strokeWidth={1.5} />
            </Box>
            <VStack spacing={1} textAlign="center">
              <Text fontSize="md" fontWeight="800" color={headingColor}>No balance yet</Text>
              <Text fontSize="sm" color={mutedColor} maxW="260px" lineHeight="1.6">
                Deposit USDT to start placing predictions on AfriPredict
              </Text>
            </VStack>
            <Box bg={subtleBg} border="1px solid" borderColor={borderColor} borderRadius="xl" p={4} w="full">
              <Text fontSize="xs" color={mutedColor} noOfLines={2} fontWeight="600" lineHeight="1.5">
                {market.title}
              </Text>
              <HStack mt={2} spacing={2}>
                <Box flex={1} py={1.5} borderRadius="lg" textAlign="center"
                  bg="rgba(34,197,94,.08)" border="1px solid rgba(34,197,94,.2)">
                  <Text fontSize="10px" fontWeight="700" color={yesColor}>YES {market.yesOdds}×</Text>
                </Box>
                <Box flex={1} py={1.5} borderRadius="lg" textAlign="center"
                  bg="rgba(239,68,68,.08)" border="1px solid rgba(239,68,68,.2)">
                  <Text fontSize="10px" fontWeight="700" color={noColor}>NO {market.noOdds}×</Text>
                </Box>
              </HStack>
            </Box>
            <VStack spacing={2} w="full">
              <Button w="full" size="md" borderRadius="xl" fontWeight="800"
                bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                onClick={() => { onClose(); openDeposit(); }}>
                Deposit to Bet →
              </Button>
              <Button w="full" size="sm" variant="ghost" borderRadius="xl"
                color={mutedColor} _hover={{ color: headingColor }} onClick={onClose}>
                Maybe later
              </Button>
            </VStack>
          </VStack>

        ) : (
          /* ── Bet entry ── */
          <Box px={5} py={5}>
            {/* Market title */}
            <Text fontSize="sm" fontWeight="700" color={headingColor} lineHeight="1.4" mb={4} noOfLines={2}>
              {market.title}
            </Text>

            {/* YES / NO toggle */}
            <HStack spacing={3} mb={5}>
              <Box flex={1} py={3} borderRadius="xl" border="2px solid" textAlign="center" cursor="pointer"
                borderColor={side === 'yes' ? yesColor : borderColor}
                bg={side === 'yes' ? 'rgba(34,197,94,.08)' : 'transparent'}
                _hover={{ borderColor: yesColor }} transition="all .15s"
                onClick={() => setSide('yes')}>
                <HStack justify="center" spacing={1.5} mb={0.5}>
                  <TrendingUp size={14} strokeWidth={2.5} color={yesColor} />
                  <Text fontSize="sm" fontWeight="800" color={yesColor}>YES</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="900" color={headingColor}>{market.yesOdds}×</Text>
                <Text fontSize="10px" color={mutedColor}>{yesChance}% chance</Text>
              </Box>
              <Box flex={1} py={3} borderRadius="xl" border="2px solid" textAlign="center" cursor="pointer"
                borderColor={side === 'no' ? noColor : borderColor}
                bg={side === 'no' ? 'rgba(239,68,68,.08)' : 'transparent'}
                _hover={{ borderColor: noColor }} transition="all .15s"
                onClick={() => setSide('no')}>
                <HStack justify="center" spacing={1.5} mb={0.5}>
                  <TrendingDown size={14} strokeWidth={2.5} color={noColor} />
                  <Text fontSize="sm" fontWeight="800" color={noColor}>NO</Text>
                </HStack>
                <Text fontSize="lg" fontWeight="900" color={headingColor}>{market.noOdds}×</Text>
                <Text fontSize="10px" color={mutedColor}>{100 - yesChance}% chance</Text>
              </Box>
            </HStack>

            {/* Quick amounts */}
            <Text fontSize="10px" fontWeight="700" color={mutedColor} textTransform="uppercase"
              letterSpacing="wider" mb={2}>Amount (USDT)</Text>
            <HStack spacing={2} mb={3}>
              {QUICK_AMOUNTS.map(q => (
                <Box key={q} flex={1} py={1.5} borderRadius="lg" border="1px solid"
                  borderColor={parseFloat(amount) === q ? activeColor : borderColor}
                  bg={parseFloat(amount) === q ? `${activeColor}14` : inputBg}
                  textAlign="center" cursor="pointer" transition="all .12s"
                  _hover={{ borderColor: activeColor }}
                  onClick={() => setAmount(String(q))}>
                  <Text fontSize="xs" fontWeight="700"
                    color={parseFloat(amount) === q ? activeColor : mutedColor}>${q}</Text>
                </Box>
              ))}
            </HStack>

            {/* Custom input */}
            <Box position="relative" mb={4}>
              <Text position="absolute" left={4} top="50%" transform="translateY(-50%)"
                fontSize="sm" fontWeight="700" color={mutedColor} zIndex={1}>$</Text>
              <Input pl={8} bg={inputBg} border="1px solid" borderColor={insufficient ? '#ef4444' : borderColor}
                borderRadius="xl" fontWeight="700" fontSize="md" color={headingColor}
                placeholder="Custom amount" value={amount} type="number" min="0"
                onChange={e => setAmount(e.target.value)}
                _focus={{ borderColor: insufficient ? '#ef4444' : activeColor, boxShadow: 'none' }}
                _placeholder={{ color: mutedColor }} />
            </Box>

            {/* Balance + insufficient warning */}
            <HStack justify="space-between" mb={4}>
              <HStack spacing={1}>
                <Text fontSize="xs" color={mutedColor}>Balance:</Text>
                <Text fontSize="xs" fontWeight="700" color={headingColor}>${cashBalance.toFixed(2)}</Text>
              </HStack>
              {insufficient && (
                <HStack spacing={1} color="#ef4444">
                  <AlertCircle size={12} strokeWidth={2} />
                  <Text fontSize="xs" fontWeight="700">Insufficient balance</Text>
                </HStack>
              )}
            </HStack>

            {/* Payout preview */}
            {amt > 0 && !insufficient && (
              <Box bg={`${activeColor}0a`} border="1px solid" borderColor={`${activeColor}33`}
                borderRadius="xl" px={4} py={3} mb={4}>
                <HStack justify="space-between">
                  <Text fontSize="xs" color={mutedColor}>Potential payout</Text>
                  <Text fontSize="sm" fontWeight="900" color={activeColor}>${payout}</Text>
                </HStack>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color={mutedColor}>Profit if wins</Text>
                  <Text fontSize="xs" fontWeight="700" color={activeColor}>+${profit}</Text>
                </HStack>
              </Box>
            )}

            {/* CTA */}
            <Button w="full" size="lg" borderRadius="xl" fontWeight="800" fontSize="md"
              isDisabled={!canBet}
              bg={canBet
                ? (side === 'yes' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#ef4444,#dc2626)')
                : (colorMode === 'dark' ? '#1e293b' : '#e2e8f0')}
              color={canBet ? 'white' : mutedColor}
              _hover={{ opacity: canBet ? .9 : 1 }}
              _disabled={{ opacity: 1, cursor: 'not-allowed' }}
              transition="all .15s"
              onClick={() => canBet && setStep('confirm')}>
              {canBet
                ? `Bet ${side.toUpperCase()} · $${amt.toFixed(2)}`
                : amt <= 0 ? 'Enter an amount' : 'Insufficient balance'}
            </Button>

          </Box>
        )}
      </Box>
    </Box>
  );
}
