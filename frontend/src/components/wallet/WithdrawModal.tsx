import React, { useState } from 'react';
import {
  Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Text, VStack, useColorModeValue, useToast,
} from '@chakra-ui/react';

const QUICK_USDT = [10, 25, 50, 100, 250];
const METHODS = [
  { id: 'bank',   icon: '🏦', label: 'Bank Transfer',  sub: 'Nigeria • 1–24 hrs • ~1.5% fee' },
  { id: 'zarp',   icon: '🇿🇦', label: 'ZARP Payout',    sub: 'South Africa • Instant • 0 fees' },
  { id: 'crypto', icon: '₿',   label: 'Crypto Wallet',  sub: 'Any network • Instant' },
];

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  cashBalance: number;
  onSuccess: (usdt: number) => void;
}

export default function WithdrawModal({ isOpen, onClose, cashBalance, onSuccess }: WithdrawModalProps) {
  const toast = useToast();
  const [step, setStep]       = useState<'select' | 'form' | 'processing' | 'success'>('select');
  const [method, setMethod]   = useState<string>('bank');
  const [amount, setAmount]   = useState('');
  const [dest, setDest]       = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawn, setWithdrawn] = useState(0);

  const reset = () => { setStep('select'); setAmount(''); setDest(''); setWithdrawn(0); };
  const handleClose = () => { reset(); onClose(); };

  const cardBg       = useColorModeValue('white', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const subtleBorder = useColorModeValue('#f1f5f9', '#1e293b');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');
  const headingColor = useColorModeValue('gray.800', 'white');
  const inputBg      = useColorModeValue('gray.50', '#080c14');
  const itemBg       = useColorModeValue('white', '#0a0e17');
  const previewBg    = useColorModeValue('gray.50', '#080c14');
  const prefixColor  = useColorModeValue('gray.600', '#94a3b8');

  const handleWithdraw = async () => {
    const usdt = parseFloat(amount);
    if (!usdt || usdt < 1) { toast({ title: 'Minimum withdrawal is $1 USDT', status: 'warning' }); return; }
    if (usdt > cashBalance) { toast({ title: 'Insufficient balance', status: 'error' }); return; }
    if (!dest.trim()) { toast({ title: 'Enter a destination address / account', status: 'warning' }); return; }
    setLoading(true); setStep('processing');
    await new Promise(r => setTimeout(r, 1800));
    setWithdrawn(usdt);
    onSuccess(usdt);
    setStep('success');
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor} overflow="hidden" mx={4}>
        <ModalCloseButton color={mutedColor} top={4} right={4} />

        {/* ── Success ── */}
        {step === 'success' && (
          <Box px={8} py={10} textAlign="center">
            <Box w={16} h={16} borderRadius="full" bg="rgba(96,165,250,.15)" border="2px solid #60a5fa"
              display="flex" alignItems="center" justifyContent="center" mx="auto" mb={5}>
              <Text fontSize="2xl">↑</Text>
            </Box>
            <Text fontWeight="800" fontSize="lg" color={headingColor} mb={1}>Withdrawal Initiated!</Text>
            <Text fontSize="sm" color="gray.400" mb={6}>Your funds are on their way</Text>
            <Box bg={previewBg} borderRadius="xl" p={5} mb={6} border="1px solid" borderColor={borderColor}>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="sm" color="gray.400">Amount</Text>
                <Text fontWeight="700" color={headingColor}>{withdrawn.toFixed(2)} USDT</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">Method</Text>
                <Text fontWeight="700" color={headingColor}>{METHODS.find(m => m.id === method)?.label}</Text>
              </HStack>
            </Box>
            <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
              bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
              _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
              onClick={handleClose}>Done</Button>
          </Box>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <Box px={8} py={12} textAlign="center">
            <Box position="relative" w="80px" h="80px" mx="auto" mb={6}
              display="flex" alignItems="center" justifyContent="center">
              <Box position="absolute" w="80px" h="80px" borderRadius="full" border="2px solid #60a5fa"
                style={{ animation: 'pulse-ring 1.2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
              <Text fontSize="2xl">↑</Text>
            </Box>
            <Text fontWeight="700" fontSize="md" color={headingColor} mb={1}>Processing withdrawal…</Text>
            <Text fontSize="sm" color="gray.400">Please wait</Text>
          </Box>
        )}

        {/* ── Method selector ── */}
        {step === 'select' && (
          <>
            <ModalHeader px={6} pt={6} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <VStack spacing={1} align="center">
                <Text fontWeight="800" fontSize="lg" color={headingColor}>Withdraw</Text>
                <Text fontSize="xs" color="gray.400">Available: ${cashBalance.toFixed(2)} USDT</Text>
              </VStack>
            </ModalHeader>
            <ModalBody px={4} py={4}>
              <VStack spacing={2}>
                {METHODS.map(m => (
                  <Box key={m.id} w="full" px={4} py={4} borderRadius="xl" border="2px solid"
                    borderColor={method === m.id ? '#ffd700' : borderColor}
                    bg={method === m.id ? 'rgba(255,215,0,.05)' : itemBg}
                    cursor="pointer" transition="all .2s"
                    _hover={{ borderColor: '#ffd700' }}
                    onClick={() => setMethod(m.id)}>
                    <HStack justify="space-between">
                      <HStack spacing={4}>
                        <Box w={10} h={10} borderRadius="xl" bg="rgba(255,215,0,.1)"
                          display="flex" alignItems="center" justifyContent="center" fontSize="lg">{m.icon}</Box>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="700" fontSize="sm" color={headingColor}>{m.label}</Text>
                          <Text fontSize="xs" color="gray.400">{m.sub}</Text>
                        </VStack>
                      </HStack>
                      <Box w={4} h={4} borderRadius="full" border="2px solid"
                        borderColor={method === m.id ? '#ffd700' : borderColor}
                        bg={method === m.id ? '#ffd700' : 'transparent'} />
                    </HStack>
                  </Box>
                ))}
              </VStack>
              <Button w="full" mt={4} size="lg" borderRadius="xl" fontWeight="700"
                bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
                onClick={() => setStep('form')}>Continue →</Button>
            </ModalBody>
          </>
        )}

        {/* ── Withdrawal form ── */}
        {step === 'form' && (
          <>
            <ModalHeader px={6} pt={5} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={() => setStep('select')} p={1}>‹</Button>
                <Text fontWeight="700" color={headingColor}>{METHODS.find(m => m.id === method)?.label}</Text>
              </HStack>
            </ModalHeader>
            <ModalBody px={6} py={5}>
              <VStack spacing={5}>
                {/* Amount */}
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Amount (USDT)</Text>
                  <Box position="relative">
                    <Text position="absolute" left={4} top="50%" transform="translateY(-50%)"
                      fontWeight="700" color={prefixColor} fontSize="lg" zIndex={1}>$</Text>
                    <Input pl={9} size="lg" borderRadius="xl" type="number" placeholder="0.00"
                      value={amount} onChange={e => setAmount(e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                      _focus={{ borderColor: '#ffd700', boxShadow: '0 0 0 1px #ffd700' }}
                      fontSize="lg" fontWeight="700" />
                  </Box>
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {QUICK_USDT.map(a => (
                      <Box key={a} px={3} py={1} borderRadius="full" border="1px solid"
                        borderColor={amount === String(a) ? '#ffd700' : borderColor}
                        bg={amount === String(a) ? 'rgba(255,215,0,.1)' : 'transparent'}
                        cursor="pointer" fontSize="xs" fontWeight="700"
                        color={amount === String(a) ? '#ffd700' : mutedColor}
                        onClick={() => setAmount(String(a))} transition="all .15s"
                      >${a}</Box>
                    ))}
                    <Box px={3} py={1} borderRadius="full" border="1px solid" borderColor={borderColor}
                      cursor="pointer" fontSize="xs" fontWeight="700" color={mutedColor}
                      onClick={() => setAmount(cashBalance.toFixed(2))} transition="all .15s"
                    >Max</Box>
                  </HStack>
                </Box>

                {/* Destination */}
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">
                    {method === 'bank' ? 'Bank Account Number' : method === 'zarp' ? 'SA Bank / ZARP Address' : 'Wallet Address'}
                  </Text>
                  <Input
                    placeholder={method === 'bank' ? '0123456789' : method === 'zarp' ? '0812345678 or 0x...' : '0x...'}
                    value={dest} onChange={e => setDest(e.target.value)}
                    size="md" borderRadius="xl" bg={inputBg} borderColor={borderColor}
                    _focus={{ borderColor: '#ffd700', boxShadow: '0 0 0 1px #ffd700' }} />
                </Box>

                {/* Preview */}
                {amount && parseFloat(amount) > 0 && (
                  <Box w="full" bg={previewBg} borderRadius="xl" p={4} border="1px solid" borderColor={borderColor}
                    style={{ animation: 'fadeIn 0.2s ease' }}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.400">Withdrawal amount</Text>
                      <Text fontWeight="700" color={headingColor}>{parseFloat(amount).toFixed(2)} USDT</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.400">Remaining balance</Text>
                      <Text fontWeight="700" color={headingColor}>${Math.max(0, cashBalance - parseFloat(amount)).toFixed(2)}</Text>
                    </HStack>
                  </Box>
                )}

                <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
                  bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                  isLoading={loading} loadingText="Processing…"
                  _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
                  onClick={handleWithdraw}>Withdraw →</Button>
                <Text fontSize="10px" color="gray.500" textAlign="center">
                  🔐 Withdrawals are processed securely • Funds leave your wallet on Polygon
                </Text>
              </VStack>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
