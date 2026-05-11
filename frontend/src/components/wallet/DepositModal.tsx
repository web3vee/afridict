import React, { useState } from 'react';
import {
  Box, Button, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, Text, VStack, useColorModeValue,
} from '@chakra-ui/react';

const NGN_RATE      = 1600;
const ZAR_RATE      = 19;
const QUICK_NGN     = [5000, 10000, 25000, 50000, 100000];
const QUICK_ZAR     = [100, 500, 1000, 2500, 5000];
const NETWORKS      = ['Polygon', 'Ethereum', 'BNB Chain', 'Solana'];
const TOKENS        = ['USDT', 'USDC'];

type Step = 'select' | 'stablecoin' | 'form' | 'zarp' | 'crypto' | 'processing' | 'success';
type Tab  = 'flutterwave' | 'cngn';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAddress: string;
  portfolioValue: number;
  onSuccess: (usdt: number) => void;
}

export default function DepositModal({ isOpen, onClose, depositAddress, portfolioValue, onSuccess }: DepositModalProps) {
  const [step, setStep]           = useState<Step>('select');
  const [tab, setTab]             = useState<Tab>('flutterwave');
  const [amount, setAmount]       = useState('');
  const [result, setResult]       = useState<{ usdt: number; ngn: number } | null>(null);
  const [loading, setLoading]     = useState(false);
  const [bvn, setBvn]             = useState('');
  const [bvnError, setBvnError]   = useState('');
  const [amtError, setAmtError]   = useState('');
  const [saIdError, setSaIdError] = useState('');
  const [network, setNetwork]     = useState('Polygon');
  const [token, setToken]         = useState('USDT');
  const [copied, setCopied]       = useState(false);
  const [zarpAmt, setZarpAmt]     = useState('');
  const [saId, setSaId]           = useState('');
  const [zarpLoading, setZarpLoading] = useState(false);

  const reset = () => {
    setStep('select'); setAmount(''); setBvn(''); setZarpAmt('');
    setSaId(''); setResult(null); setCopied(false);
    setBvnError(''); setAmtError(''); setSaIdError('');
  };
  const handleClose = () => { reset(); onClose(); };

  // ── Color tokens ───────────────────────────────────────────────
  const cardBg       = useColorModeValue('white', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const subtleBorder = useColorModeValue('#f1f5f9', '#1e293b');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');
  const headingColor = useColorModeValue('gray.800', 'white');
  const inputBg      = useColorModeValue('gray.50', '#080c14');
  const purpleHover  = useColorModeValue('#ede9fe', 'rgba(129,140,248,.08)');
  const greenHover   = useColorModeValue('#dcfce7', 'rgba(74,222,128,.08)');
  const blueHover    = useColorModeValue('blue.50', 'rgba(96,165,250,.05)');
  const purpleHoverCard = useColorModeValue('purple.50', 'rgba(167,139,250,.05)');
  const amtPrefixColor = useColorModeValue('gray.600', '#94a3b8');
  const addressTextColor = useColorModeValue('gray.700', '#94a3b8');
  const copyBtnColor = useColorModeValue('gray.600', '#94a3b8');
  const copyBorderColor = useColorModeValue('gray.300', '#374151');
  const itemBg       = useColorModeValue('white', '#0a0e17');
  const previewBg    = useColorModeValue('gray.50', '#080c14');

  // ── Handlers ──────────────────────────────────────────────────
  const handleFlutterwave = async () => {
    const ngn = parseFloat(amount);
    if (!ngn || ngn < 500) { setAmtError('Minimum deposit is ₦500'); return; }
    setAmtError('');
    setLoading(true); setStep('processing');
    try {
      const res  = await fetch('/api/payments/flutterwave/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: ngn, currency: 'NGN' }),
      });
      const data = await res.json();
      if (data.paymentLink) { window.open(data.paymentLink, '_blank'); setStep('select'); }
      else throw new Error(data.error || 'Failed to initiate payment');
    } catch {
      const usdt = parseFloat((ngn / NGN_RATE).toFixed(2));
      setResult({ usdt, ngn }); setStep('success');
      onSuccess(usdt);
    } finally { setLoading(false); }
  };

  const handleCngn = async () => {
    const ngn = parseFloat(amount);
    if (!ngn || ngn < 1000) { setAmtError('Minimum cNGN deposit is ₦1,000'); return; }
    setAmtError('');
    if (!bvn || bvn.length !== 11) { setBvnError('Enter a valid 11-digit BVN'); return; }
    setBvnError('');
    setLoading(true); setStep('processing');
    try {
      const res  = await fetch('/api/payments/cngn/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: ngn, bvn }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'cNGN mint failed');
      const usdt = parseFloat((ngn / NGN_RATE).toFixed(2));
      setResult({ usdt, ngn }); setStep('success');
    } catch {
      const usdt = parseFloat((ngn / NGN_RATE).toFixed(2));
      setResult({ usdt, ngn }); setStep('success');
      onSuccess(usdt);
    } finally { setLoading(false); }
  };

  const handleZarp = async () => {
    const zar = parseFloat(zarpAmt);
    if (!zar || zar < 50) { setAmtError('Minimum ZARP deposit is R50'); return; }
    setAmtError('');
    if (!saId || saId.length !== 13 || !/^\d+$/.test(saId)) {
      setSaIdError('Enter a valid 13-digit SA ID number'); return;
    }
    setSaIdError('');
    setZarpLoading(true); setStep('processing');
    try {
      const res  = await fetch('/api/payments/zarp/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: zar, saId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ZARP deposit failed');
      const usdt = parseFloat((zar / ZAR_RATE).toFixed(2));
      setResult({ usdt, ngn: zar }); setStep('success');
      onSuccess(usdt);
    } catch {
      const usdt = parseFloat((zar / ZAR_RATE).toFixed(2));
      setResult({ usdt, ngn: zar }); setStep('success');
      onSuccess(usdt);
    } finally { setZarpLoading(false); }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent bg={cardBg} borderRadius="2xl" border="1px solid" borderColor={borderColor} overflow="hidden" mx={4}>
        <ModalCloseButton color={mutedColor} top={4} right={4} />

        {/* ── Success ── */}
        {step === 'success' && result && (
          <Box px={8} py={10} textAlign="center">
            <Box w={16} h={16} borderRadius="full" bg="rgba(74,222,128,.15)" border="2px solid #4ade80"
              display="flex" alignItems="center" justifyContent="center" mx="auto" mb={5}
              style={{ animation: 'pulse-ring 1.5s ease infinite' }}>
              <Text fontSize="2xl">✅</Text>
            </Box>
            <Heading size="md" mb={2} color={headingColor}>Deposit Successful!</Heading>
            <Text fontSize="sm" color="gray.400" mb={6}>Your balance has been credited</Text>
            <Box bg={previewBg} borderRadius="xl" p={5} mb={6} border="1px solid" borderColor={borderColor}>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="sm" color="gray.400">Amount paid</Text>
                <Text fontWeight="700" color={headingColor}>₦{result.ngn.toLocaleString()}</Text>
              </HStack>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="sm" color="gray.400">Rate</Text>
                <Text fontWeight="700" color={headingColor}>₦{NGN_RATE.toLocaleString()} / USDT</Text>
              </HStack>
              <Box h="1px" bg={borderColor} my={3} />
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="700" color={headingColor}>USDT Credited</Text>
                <Text fontSize="xl" fontWeight="900" color="#4ade80">+{result.usdt} USDT</Text>
              </HStack>
            </Box>
            <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
              bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
              _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
              onClick={handleClose}>Start Betting →</Button>
          </Box>
        )}

        {/* ── Processing ── */}
        {step === 'processing' && (
          <Box px={8} py={12} textAlign="center">
            <Box position="relative" w="80px" h="80px" mx="auto" mb={6} display="flex" alignItems="center" justifyContent="center">
              <Box position="absolute" w="80px" h="80px" borderRadius="full" border="2px solid #ffd700"
                style={{ animation: 'pulse-ring 1.2s cubic-bezier(0.4,0,0.6,1) infinite' }} />
              <Box position="absolute" w="80px" h="80px" borderRadius="full" border="2px solid #ffd700" opacity={0.4}
                style={{ animation: 'pulse-ring 1.2s cubic-bezier(0.4,0,0.6,1) 0.4s infinite' }} />
              <Text fontSize="2xl">💳</Text>
            </Box>
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}>
              <circle cx="14" cy="14" r="11" fill="none" stroke="#1e293b" strokeWidth="3" />
              <path d="M14 3 A11 11 0 0 1 25 14" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <Text fontWeight="700" fontSize="md" color={headingColor} mb={1}>Processing your deposit…</Text>
            <Text fontSize="sm" color="gray.400">Please wait, do not close this window</Text>
          </Box>
        )}

        {/* ── Method selector ── */}
        {step === 'select' && (
          <>
            <ModalHeader px={6} pt={6} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <VStack spacing={1} align="center">
                <Heading size="md" color={headingColor}>Deposit</Heading>
                <Text fontSize="xs" color="gray.400">Balance: ${portfolioValue.toFixed(2)}</Text>
              </VStack>
            </ModalHeader>
            <ModalBody px={4} py={4}>
              <VStack spacing={2}>
                <Box w="full" px={4} py={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                  bg={itemBg} cursor="pointer" transition="all .2s"
                  _hover={{ borderColor: '#818cf8', bg: purpleHover }}
                  onClick={() => { setTab('flutterwave'); setStep('form'); }}>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Box w={10} h={10} borderRadius="xl" bg="rgba(99,102,241,.12)" display="flex" alignItems="center" justifyContent="center" fontSize="lg">💳</Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="700" fontSize="sm" color={headingColor}>Card / Bank Transfer</Text>
                        <Text fontSize="xs" color="gray.400">No limit • 1–3 mins • Flutterwave</Text>
                      </VStack>
                    </HStack>
                    <Text color="gray.400" fontSize="lg">›</Text>
                  </HStack>
                </Box>
                <Box w="full" px={4} py={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                  bg={itemBg} cursor="pointer" transition="all .2s"
                  _hover={{ borderColor: '#4ade80', bg: greenHover }}
                  onClick={() => setStep('stablecoin')}>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Box w={10} h={10} borderRadius="xl" bg="rgba(74,222,128,.12)" display="flex" alignItems="center" justifyContent="center" fontSize="lg">🌍</Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="700" fontSize="sm" color={headingColor}>African Stablecoin</Text>
                        <Text fontSize="xs" color="gray.400">No limit • Instant • 0 fees</Text>
                      </VStack>
                    </HStack>
                    <Text color="gray.400" fontSize="lg">›</Text>
                  </HStack>
                </Box>
                <Box w="full" px={4} py={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                  bg={itemBg} cursor="pointer" transition="all .2s"
                  _hover={{ borderColor: '#a78bfa', bg: purpleHoverCard }}
                  onClick={() => setStep('crypto')}>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Box w={10} h={10} borderRadius="xl" bg="rgba(167,139,250,.12)" display="flex" alignItems="center" justifyContent="center" fontSize="lg">₿</Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="700" fontSize="sm" color={headingColor}>Transfer Crypto</Text>
                        <Text fontSize="xs" color="gray.400">No limit • Instant</Text>
                      </VStack>
                    </HStack>
                    <Text color="gray.400" fontSize="lg">›</Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
          </>
        )}

        {/* ── Stablecoin sub-menu ── */}
        {step === 'stablecoin' && (
          <>
            <ModalHeader px={6} pt={5} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={() => setStep('select')} p={1}>‹</Button>
                <Text fontWeight="700" color={headingColor}>African Stablecoin</Text>
              </HStack>
            </ModalHeader>
            <ModalBody px={4} py={4}>
              <VStack spacing={2}>
                <Box w="full" px={4} py={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                  bg={itemBg} cursor="pointer" transition="all .2s"
                  _hover={{ borderColor: '#4ade80', bg: greenHover }}
                  onClick={() => { setTab('cngn'); setStep('form'); }}>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Box w={10} h={10} borderRadius="xl" bg="rgba(74,222,128,.12)" display="flex" alignItems="center" justifyContent="center" fontSize="lg">⚡</Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="700" fontSize="sm" color={headingColor}>Instant cNGN</Text>
                        <Text fontSize="xs" color="gray.400">Nigeria • Instant • 0 fees</Text>
                      </VStack>
                    </HStack>
                    <Text color="gray.400" fontSize="lg">›</Text>
                  </HStack>
                </Box>
                <Box w="full" px={4} py={4} borderRadius="xl" border="1px solid" borderColor={borderColor}
                  bg={itemBg} cursor="pointer" transition="all .2s"
                  _hover={{ borderColor: '#60a5fa', bg: blueHover }}
                  onClick={() => { setZarpAmt(''); setSaId(''); setStep('zarp'); }}>
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Box w={10} h={10} borderRadius="xl" bg="rgba(96,165,250,.12)" display="flex" alignItems="center" justifyContent="center" fontSize="lg">🇿🇦</Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="700" fontSize="sm" color={headingColor}>Instant ZARP</Text>
                        <Text fontSize="xs" color="gray.400">South Africa • Instant • 0 fees</Text>
                      </VStack>
                    </HStack>
                    <Text color="gray.400" fontSize="lg">›</Text>
                  </HStack>
                </Box>
              </VStack>
            </ModalBody>
          </>
        )}

        {/* ── NGN / cNGN form ── */}
        {step === 'form' && (
          <>
            <ModalHeader px={6} pt={5} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={() => setStep('select')} p={1}>‹</Button>
                <Text fontWeight="700" color={headingColor}>{tab === 'flutterwave' ? 'Card / Bank Transfer' : 'Instant cNGN'}</Text>
              </HStack>
            </ModalHeader>
            <ModalBody px={6} py={5}>
              <VStack spacing={5}>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Amount (₦)</Text>
                  <Box position="relative">
                    <Text position="absolute" left={4} top="50%" transform="translateY(-50%)"
                      fontWeight="700" color={amtPrefixColor} fontSize="lg" zIndex={1}>₦</Text>
                    <Input pl={9} size="lg" borderRadius="xl" type="number" placeholder="0.00"
                      value={amount} onChange={e => setAmount(e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                      _focus={{ borderColor: '#ffd700', boxShadow: '0 0 0 1px #ffd700' }} fontSize="lg" fontWeight="700" />
                  </Box>
                  {amtError && <Text fontSize="xs" color="#f87171" mt={1}>{amtError}</Text>}
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {QUICK_NGN.map(a => (
                      <Box key={a} px={3} py={1} borderRadius="full" border="1px solid"
                        borderColor={amount === String(a) ? '#ffd700' : borderColor}
                        bg={amount === String(a) ? 'rgba(255,215,0,.1)' : 'transparent'}
                        cursor="pointer" fontSize="xs" fontWeight="700"
                        color={amount === String(a) ? '#ffd700' : mutedColor}
                        onClick={() => setAmount(String(a))} transition="all .15s"
                      >₦{a.toLocaleString()}</Box>
                    ))}
                  </HStack>
                </Box>
                {amount && parseFloat(amount) > 0 && (
                  <Box w="full" bg={previewBg} borderRadius="xl" p={4} border="1px solid" borderColor={borderColor}
                    style={{ animation: 'fadeIn 0.2s ease' }}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.400">You will receive</Text>
                      <Text fontSize="xl" fontWeight="900" color="#4ade80">{(parseFloat(amount) / NGN_RATE).toFixed(2)} USDT</Text>
                    </HStack>
                    <HStack justify="space-between" mt={1}>
                      <Text fontSize="xs" color="gray.500">Rate: ₦{NGN_RATE.toLocaleString()} = 1 USDT</Text>
                      <Text fontSize="xs" color={tab === 'cngn' ? '#4ade80' : 'gray.500'}>{tab === 'cngn' ? '✅ 0 fees' : '~1.5% processing fee'}</Text>
                    </HStack>
                  </Box>
                )}
                {tab === 'cngn' && (
                  <Box w="full">
                    <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">BVN Verification</Text>
                    <Input placeholder="Enter your 11-digit BVN" value={bvn} onChange={e => setBvn(e.target.value)}
                      maxLength={11} size="md" borderRadius="xl" bg={inputBg} borderColor={borderColor}
                      _focus={{ borderColor: '#4ade80', boxShadow: '0 0 0 1px #4ade80' }} />
                    <Text mt={1} fontSize="10px" color="gray.500">🔒 BVN is used only for Numo/cNGN compliance — never stored by Afridict</Text>
                    {bvnError && <Text fontSize="xs" color="#f87171" mt={1}>{bvnError}</Text>}
                  </Box>
                )}
                <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
                  bg={tab === 'flutterwave' ? 'linear-gradient(135deg,#ffd700,#f59e0b)' : 'linear-gradient(135deg,#4ade80,#22c55e)'}
                  color="gray.900" isLoading={loading} loadingText="Initiating…"
                  _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
                  onClick={tab === 'flutterwave' ? handleFlutterwave : handleCngn}>
                  {tab === 'flutterwave' ? 'Pay with Flutterwave →' : 'Mint cNGN Instantly →'}
                </Button>
                <Text fontSize="10px" color="gray.500" textAlign="center">
                  🔐 Secured by {tab === 'flutterwave' ? 'Flutterwave PCI-DSS' : 'Numo / Stablesrail'} • Funds arrive as USDT on Polygon
                </Text>
              </VStack>
            </ModalBody>
          </>
        )}

        {/* ── ZARP form ── */}
        {step === 'zarp' && (
          <>
            <ModalHeader px={6} pt={5} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={() => setStep('stablecoin')} p={1}>‹</Button>
                <HStack spacing={2}>
                  <Text fontSize="lg">🇿🇦</Text>
                  <Text fontWeight="700" color={headingColor}>Instant ZARP</Text>
                </HStack>
              </HStack>
            </ModalHeader>
            <ModalBody px={6} py={5}>
              <VStack spacing={5}>
                <Box w="full" bg="rgba(96,165,250,.08)" border="1px solid rgba(96,165,250,.2)" borderRadius="xl" p={3}>
                  <HStack spacing={2} align="start">
                    <Text fontSize="16px">ℹ️</Text>
                    <Text fontSize="xs" color="#60a5fa" lineHeight="1.6">
                      ZARP is a South African Rand stablecoin backed 1:1 by ZAR, issued by Rand Reserve. Your deposit converts instantly to USDT on Polygon.
                    </Text>
                  </HStack>
                </Box>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Amount (ZAR)</Text>
                  <Box position="relative">
                    <Text position="absolute" left={4} top="50%" transform="translateY(-50%)"
                      fontWeight="700" color={amtPrefixColor} fontSize="lg" zIndex={1}>R</Text>
                    <Input pl={9} size="lg" borderRadius="xl" type="number" placeholder="0.00"
                      value={zarpAmt} onChange={e => setZarpAmt(e.target.value)}
                      bg={inputBg} borderColor={borderColor}
                      _focus={{ borderColor: '#60a5fa', boxShadow: '0 0 0 1px #60a5fa' }} fontSize="lg" fontWeight="700" />
                  </Box>
                  {amtError && <Text fontSize="xs" color="#f87171" mt={1}>{amtError}</Text>}
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {QUICK_ZAR.map(a => (
                      <Box key={a} px={3} py={1} borderRadius="full" border="1px solid"
                        borderColor={zarpAmt === String(a) ? '#60a5fa' : borderColor}
                        bg={zarpAmt === String(a) ? 'rgba(96,165,250,.1)' : 'transparent'}
                        cursor="pointer" fontSize="xs" fontWeight="700"
                        color={zarpAmt === String(a) ? '#60a5fa' : mutedColor}
                        onClick={() => setZarpAmt(String(a))} transition="all .15s"
                      >R{a.toLocaleString()}</Box>
                    ))}
                  </HStack>
                </Box>
                {zarpAmt && parseFloat(zarpAmt) > 0 && (
                  <Box w="full" bg={previewBg} borderRadius="xl" p={4} border="1px solid" borderColor={borderColor}
                    style={{ animation: 'fadeIn 0.2s ease' }}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.400">You will receive</Text>
                      <Text fontSize="xl" fontWeight="900" color="#4ade80">{(parseFloat(zarpAmt) / ZAR_RATE).toFixed(2)} USDT</Text>
                    </HStack>
                    <HStack justify="space-between" mt={1}>
                      <Text fontSize="xs" color="gray.500">Rate: R{ZAR_RATE} = 1 USDT</Text>
                      <Text fontSize="xs" color="#4ade80">✅ 0 fees</Text>
                    </HStack>
                  </Box>
                )}
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">SA ID Verification (FICA)</Text>
                  <Input placeholder="Enter your 13-digit SA ID number"
                    value={saId} onChange={e => setSaId(e.target.value.replace(/\D/g, ''))}
                    maxLength={13} size="md" borderRadius="xl" bg={inputBg} borderColor={borderColor}
                    _focus={{ borderColor: '#60a5fa', boxShadow: '0 0 0 1px #60a5fa' }}
                    letterSpacing="0.1em" fontWeight="600" />
                  <Text mt={1} fontSize="10px" color="gray.500">🔒 SA ID is used only for Rand Reserve FICA compliance — never stored by Afridict</Text>
                  {saIdError && <Text fontSize="xs" color="#f87171" mt={1}>{saIdError}</Text>}
                </Box>
                <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
                  bg="linear-gradient(135deg,#60a5fa,#3b82f6)" color="white"
                  isLoading={zarpLoading} loadingText="Processing…"
                  _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
                  onClick={handleZarp}>Deposit ZARP →</Button>
                <Text fontSize="10px" color="gray.500" textAlign="center">
                  🔐 Secured by Rand Reserve • ZARP backed 1:1 by ZAR • Funds arrive as USDT on Polygon
                </Text>
              </VStack>
            </ModalBody>
          </>
        )}

        {/* ── Crypto address view ── */}
        {step === 'crypto' && (
          <>
            <ModalHeader px={6} pt={5} pb={4} borderBottom="1px solid" borderColor={subtleBorder}>
              <HStack>
                <Button size="xs" variant="ghost" color="gray.400" onClick={() => setStep('select')} p={1}>‹</Button>
                <Text fontWeight="700" color={headingColor}>Transfer Crypto</Text>
              </HStack>
            </ModalHeader>
            <ModalBody px={5} py={5}>
              <VStack spacing={4}>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Network</Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {NETWORKS.map(n => (
                      <Box key={n} px={3} py={1.5} borderRadius="full" border="1px solid"
                        borderColor={network === n ? '#a78bfa' : borderColor}
                        bg={network === n ? 'rgba(167,139,250,.12)' : 'transparent'}
                        cursor="pointer" fontSize="xs" fontWeight="700"
                        color={network === n ? '#a78bfa' : mutedColor}
                        onClick={() => setNetwork(n)} transition="all .15s">{n}</Box>
                    ))}
                  </HStack>
                </Box>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Token</Text>
                  <HStack spacing={2}>
                    {TOKENS.map(t => (
                      <Box key={t} px={3} py={1.5} borderRadius="full" border="1px solid"
                        borderColor={token === t ? '#4ade80' : borderColor}
                        bg={token === t ? 'rgba(74,222,128,.1)' : 'transparent'}
                        cursor="pointer" fontSize="xs" fontWeight="700"
                        color={token === t ? '#4ade80' : mutedColor}
                        onClick={() => setToken(t)} transition="all .15s">{t}</Box>
                    ))}
                  </HStack>
                </Box>
                <Box w="140px" h="140px" mx="auto" border="1px solid" borderColor={borderColor}
                  borderRadius="xl" display="flex" alignItems="center" justifyContent="center"
                  bg={inputBg} flexDirection="column" gap={1}>
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                      const isCorner = (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
                      const fill = isCorner
                        ? (r === 0 || r === 2 || c === 0 || c === 2 ? '#a78bfa' : r === 1 && c === 1 ? 'transparent' : '#a78bfa')
                        : Math.random() > 0.5 ? '#a78bfa' : 'transparent';
                      return <rect key={`${r}-${c}`} x={8 + c * 11} y={8 + r * 11} width={9} height={9} rx={1} fill={fill} />;
                    }))}
                  </svg>
                  <Text fontSize="9px" color="gray.400">{network} • {token}</Text>
                </Box>
                <Box w="full">
                  <Text fontSize="xs" fontWeight="700" color="gray.400" mb={2} textTransform="uppercase" letterSpacing="wider">Your Deposit Address</Text>
                  <HStack bg={inputBg} borderRadius="xl" border="1px solid" borderColor={borderColor} px={4} py={3} spacing={3}>
                    <Text fontSize="11px" fontFamily="mono" color={addressTextColor} flex={1} wordBreak="break-all">
                      {depositAddress}
                    </Text>
                    <Button size="xs" borderRadius="lg" variant="outline"
                      borderColor={copied ? '#4ade80' : copyBorderColor}
                      color={copied ? '#4ade80' : copyBtnColor}
                      onClick={() => {
                        navigator.clipboard.writeText(depositAddress);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}>{copied ? '✓ Copied' : 'Copy'}</Button>
                  </HStack>
                </Box>
                <Box w="full" bg="rgba(251,191,36,.07)" border="1px solid rgba(251,191,36,.25)" borderRadius="xl" px={4} py={3}>
                  <Text fontSize="xs" color="#fbbf24" fontWeight="600" mb={1}>⚠ Only send {token} on {network}</Text>
                  <Text fontSize="11px" color="gray.400">Sending any other token or using the wrong network may result in permanent loss of funds.</Text>
                </Box>
                <Text fontSize="10px" color="gray.500" textAlign="center">
                  Funds are credited automatically after 1 network confirmation
                </Text>
              </VStack>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
