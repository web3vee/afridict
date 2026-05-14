import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalBody,
  Box, Button, HStack, VStack, Text, Textarea, Input, Select,
  Badge, useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';

interface CreateMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'Elections', 'Politics', 'Sports', 'Music', 'Crypto',
  'Economy', 'Finance', 'Tech', 'Security', 'Commodities', 'Weather',
];

const AFRICAN_COUNTRIES = [
  { name: 'Pan-Africa',         flag: '🌍' },
  { name: 'Nigeria',            flag: '🇳🇬' },
  { name: 'South Africa',       flag: '🇿🇦' },
  { name: 'Kenya',              flag: '🇰🇪' },
  { name: 'Ghana',              flag: '🇬🇭' },
  { name: 'Ethiopia',           flag: '🇪🇹' },
  { name: 'Egypt',              flag: '🇪🇬' },
  { name: 'Tanzania',           flag: '🇹🇿' },
  { name: 'Uganda',             flag: '🇺🇬' },
  { name: 'Senegal',            flag: '🇸🇳' },
  { name: 'Morocco',            flag: '🇲🇦' },
  { name: 'Ivory Coast',        flag: '🇨🇮' },
  { name: 'Cameroon',           flag: '🇨🇲' },
  { name: 'Angola',             flag: '🇦🇴' },
  { name: 'Algeria',            flag: '🇩🇿' },
  { name: 'Mozambique',         flag: '🇲🇿' },
  { name: 'Madagascar',         flag: '🇲🇬' },
  { name: 'Zambia',             flag: '🇿🇲' },
  { name: 'Zimbabwe',           flag: '🇿🇼' },
  { name: 'Rwanda',             flag: '🇷🇼' },
  { name: 'Tunisia',            flag: '🇹🇳' },
  { name: 'Somalia',            flag: '🇸🇴' },
  { name: 'Mali',               flag: '🇲🇱' },
  { name: 'Burkina Faso',       flag: '🇧🇫' },
  { name: 'Niger',              flag: '🇳🇪' },
  { name: 'Sudan',              flag: '🇸🇩' },
  { name: 'DR Congo',           flag: '🇨🇩' },
  { name: 'Gabon',              flag: '🇬🇦' },
  { name: 'Botswana',           flag: '🇧🇼' },
  { name: 'Namibia',            flag: '🇳🇦' },
];

const CATEGORY_EMOJI: Record<string, string> = {
  Elections: '🗳️', Politics: '🏛️', Sports: '⚽', Music: '🎵',
  Crypto: '₿', Economy: '💹', Finance: '💰', Tech: '💻',
  Security: '🔒', Commodities: '📦', Weather: '☁️',
};

type Step = 1 | 2 | 3;

export default function CreateMarketModal({ isOpen, onClose }: CreateMarketModalProps) {
  const { submitMarketForReview } = useApp();
  const [step, setStep]                   = useState<Step>(1);
  const [submitted, setSubmitted]         = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);

  // Step 1 fields
  const [title, setTitle]                 = useState('');
  const [category, setCategory]           = useState('');
  const [country, setCountry]             = useState('');
  const [endDate, setEndDate]             = useState('');

  // Step 2 fields
  const [criteria, setCriteria]           = useState('');
  const [source, setSource]               = useState('');

  // colors
  const modalBg      = useColorModeValue('white', '#0f1623');
  const borderColor  = useColorModeValue('gray.200', '#1e293b');
  const headingClr   = useColorModeValue('gray.900', 'white');
  const mutedClr     = useColorModeValue('gray.500', '#94a3b8');
  const inputBg      = useColorModeValue('gray.50', '#1e293b');
  const inputBorder  = useColorModeValue('gray.200', '#2d3748');
  const labelClr     = useColorModeValue('gray.700', 'gray.300');
  const previewBg    = useColorModeValue('gray.50', '#1a2536');
  const previewBorder = useColorModeValue('gray.200', '#2d3748');
  const disabledBg   = useColorModeValue('gray.100', '#1e293b');
  const disabledClr  = useColorModeValue('gray.400', 'gray.600');
  const dotInactiveBg = useColorModeValue('gray.200', '#2d3748');

  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    setTitle('');
    setCategory('');
    setCountry('');
    setEndDate('');
    setCriteria('');
    setSource('');
    onClose();
  };

  const canStep1 = title.trim().length > 0 && category !== '' && country !== '' && endDate !== '';
  const canStep2 = criteria.trim().length > 0 && source.trim().length > 0;

  // Step indicator dots
  const StepDots = () => (
    <HStack spacing={2} justify="center" mb={6}>
      {([1, 2, 3] as Step[]).map(s => (
        <Box
          key={s}
          w={s === step ? '24px' : '8px'}
          h="8px"
          borderRadius="full"
          bg={s === step ? '#ffd700' : s < step ? '#ffd70066' : dotInactiveBg}
          transition="all .25s"
        />
      ))}
    </HStack>
  );

  // ── Preview card ──
  const PreviewCard = () => {
    const catEmoji = CATEGORY_EMOJI[category] ?? '📊';
    const formattedDate = endDate
      ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'No date set';

    return (
      <Box
        p={4} borderRadius="xl" border="1px solid" borderColor={previewBorder}
        bg={previewBg} mb={5}
      >
        {/* Category badge */}
        <HStack mb={3} spacing={2}>
          <Box
            w={8} h={8} borderRadius="lg" bg={inputBg} flexShrink={0}
            display="flex" alignItems="center" justifyContent="center" fontSize="1rem"
          >
            {catEmoji}
          </Box>
          <Badge
            fontSize="9px" fontWeight="800" px={2} py={0.5} borderRadius="full"
            bg="rgba(255,215,0,.15)" color="#ffd700" border="1px solid rgba(255,215,0,.3)"
          >
            {category || 'Category'}
          </Badge>
        </HStack>

        {/* Title */}
        <Text fontSize="sm" fontWeight="700" color={headingClr} lineHeight="1.5" mb={3}>
          {title || 'Your market title will appear here'}
        </Text>

        {/* Odds row */}
        <HStack mb={3} spacing={2}>
          <Box
            flex={1} py={2} borderRadius="lg" textAlign="center"
            bg="rgba(74,222,128,.12)" border="1px solid rgba(74,222,128,.2)"
          >
            <Text fontSize="10px" fontWeight="700" color="#4ade80" mb={0.5}>YES</Text>
            <Text fontSize="md" fontWeight="900" color="#4ade80">2.00</Text>
          </Box>
          <Box
            flex={1} py={2} borderRadius="lg" textAlign="center"
            bg="rgba(248,113,113,.12)" border="1px solid rgba(248,113,113,.2)"
          >
            <Text fontSize="10px" fontWeight="700" color="#f87171" mb={0.5}>NO</Text>
            <Text fontSize="md" fontWeight="900" color="#f87171">2.00</Text>
          </Box>
        </HStack>

        {/* Meta row */}
        <HStack justify="space-between" flexWrap="wrap" gap={1}>
          {country && (
            <Text fontSize="10px" color={mutedClr}>
              {AFRICAN_COUNTRIES.find(c => c.name === country)?.flag} <Text as="span" fontWeight="700" color={headingClr}>{country}</Text>
            </Text>
          )}
          <Text fontSize="10px" color={mutedClr}>Pool: <Text as="span" fontWeight="700" color={headingClr}>$0</Text></Text>
          <Text fontSize="10px" color={mutedClr}>Ends: <Text as="span" fontWeight="700" color={headingClr}>{formattedDate}</Text></Text>
        </HStack>

        {/* Resolution source */}
        {source && (
          <Box mt={3} pt={3} borderTop="1px solid" borderColor={previewBorder}>
            <Text fontSize="10px" color={mutedClr}>Source: <Text as="span" fontWeight="600" color={mutedClr}>{source}</Text></Text>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent
        bg={modalBg} border="1px solid" borderColor={borderColor}
        borderRadius="2xl" overflow="hidden"
        boxShadow="0 24px 80px rgba(0,0,0,.5)"
      >
        <ModalBody px={6} py={6}>

          {/* ── SUCCESS SCREEN ── */}
          {submitted ? (
            <VStack spacing={5} py={8} align="center">
              <Box
                w={16} h={16} borderRadius="full"
                bg="rgba(255,215,0,.12)" border="2px solid #ffd700"
                display="flex" alignItems="center" justifyContent="center"
              >
                <CheckCircle size={32} color="#ffd700" strokeWidth={2} />
              </Box>
              <VStack spacing={2} textAlign="center">
                <Text fontSize="xl" fontWeight="800" color={headingClr}>Market Submitted!</Text>
                <Text fontSize="sm" color={mutedClr} maxW="280px" lineHeight="1.6">
                  Our team will review and publish within 24 hours.
                </Text>
              </VStack>
              <Button
                mt={2} w="full" borderRadius="xl" fontWeight="800" size="md"
                bg="#ffd700" color="#0f1623"
                _hover={{ bg: '#f5c800', transform: 'translateY(-1px)' }}
                transition="all .2s"
                onClick={handleClose}
              >
                Close
              </Button>
            </VStack>
          ) : (
            <>
              {/* Header */}
              <HStack justify="space-between" mb={1}>
                <Text fontSize="lg" fontWeight="800" color={headingClr}>
                  {step === 1 ? 'Create a Market' : step === 2 ? 'Resolution' : 'Preview'}
                </Text>
                <Text fontSize="xs" color={mutedClr} fontWeight="600">Step {step} of 3</Text>
              </HStack>

              <StepDots />

              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <VStack spacing={5} align="stretch">
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Market Title</Text>
                    <Textarea
                      placeholder="Will Nigeria qualify for 2026 World Cup?"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      rows={3}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={headingClr}
                      _placeholder={{ color: mutedClr }}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                      resize="none"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Category</Text>
                    <Select
                      placeholder="Select a category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={category ? headingClr : mutedClr}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_EMOJI[cat]} {cat}</option>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Country / Region</Text>
                    <Select
                      placeholder="Select a country"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={country ? headingClr : mutedClr}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                    >
                      {AFRICAN_COUNTRIES.map(c => (
                        <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                      ))}
                    </Select>
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Resolution / End Date</Text>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={endDate ? headingClr : mutedClr}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                    />
                  </Box>

                  <Button
                    mt={2} w="full" borderRadius="xl" fontWeight="800" size="md"
                    bg="#ffd700" color="#0f1623"
                    _hover={{ bg: '#f5c800', transform: 'translateY(-1px)' }}
                    _disabled={{ bg: disabledBg, color: disabledClr, cursor: 'not-allowed', transform: 'none' }}
                    transition="all .2s"
                    isDisabled={!canStep1}
                    onClick={() => setStep(2)}
                  >
                    Next →
                  </Button>
                </VStack>
              )}

              {/* ── STEP 2: Resolution ── */}
              {step === 2 && (
                <VStack spacing={5} align="stretch">
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Resolution Criteria</Text>
                    <Textarea
                      placeholder="How will this market resolve?"
                      value={criteria}
                      onChange={e => setCriteria(e.target.value)}
                      rows={4}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={headingClr}
                      _placeholder={{ color: mutedClr }}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                      resize="none"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={1.5}>Resolution Source</Text>
                    <Input
                      placeholder="e.g. BBC Africa, Reuters, official govt announcement"
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      fontSize="sm"
                      color={headingClr}
                      _placeholder={{ color: mutedClr }}
                      _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                    />
                  </Box>

                  {/* Outcome type */}
                  <Box>
                    <Text fontSize="xs" fontWeight="700" color={labelClr} mb={2}>Outcome Type</Text>
                    <HStack spacing={3}>
                      {/* Binary — selected */}
                      <Box
                        flex={1} p={3} borderRadius="xl" cursor="pointer" textAlign="center"
                        bg="rgba(255,215,0,.12)"
                        border="2px solid #ffd700"
                      >
                        <Text fontSize="sm" fontWeight="800" color="#ffd700">Binary</Text>
                        <Text fontSize="10px" color={mutedClr} mt={0.5}>YES / NO</Text>
                      </Box>

                      {/* Multi-outcome — disabled */}
                      <Box
                        flex={1} p={3} borderRadius="xl" textAlign="center"
                        bg={disabledBg}
                        border="2px solid transparent"
                        opacity={0.5}
                        cursor="not-allowed"
                        position="relative"
                      >
                        <Text fontSize="sm" fontWeight="800" color={disabledClr}>Multi-outcome</Text>
                        <Text fontSize="10px" color={disabledClr} mt={0.5}>Coming soon</Text>
                      </Box>
                    </HStack>
                  </Box>

                  <HStack spacing={3} mt={2}>
                    <Button
                      flex={1} borderRadius="xl" fontWeight="800" size="md" variant="outline"
                      borderColor={borderColor} color={headingClr}
                      _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
                      transition="all .2s"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </Button>
                    <Button
                      flex={2} borderRadius="xl" fontWeight="800" size="md"
                      bg="#ffd700" color="#0f1623"
                      _hover={{ bg: '#f5c800', transform: 'translateY(-1px)' }}
                      _disabled={{ bg: disabledBg, color: disabledClr, cursor: 'not-allowed', transform: 'none' }}
                      transition="all .2s"
                      isDisabled={!canStep2}
                      onClick={() => setStep(3)}
                    >
                      Preview →
                    </Button>
                  </HStack>
                </VStack>
              )}

              {/* ── STEP 3: Preview ── */}
              {step === 3 && (
                <VStack spacing={0} align="stretch">
                  <Text fontSize="xs" fontWeight="700" color={mutedClr} textTransform="uppercase"
                    letterSpacing="widest" mb={4}>
                    Market Preview
                  </Text>

                  <PreviewCard />

                  {/* Resolution details */}
                  <Box
                    mb={5} p={3} borderRadius="xl" bg={inputBg}
                    border="1px solid" borderColor={inputBorder}
                  >
                    <Text fontSize="10px" fontWeight="800" color={mutedClr} textTransform="uppercase"
                      letterSpacing="wider" mb={1.5}>
                      Resolution Criteria
                    </Text>
                    <Text fontSize="xs" color={headingClr} lineHeight="1.6">
                      {criteria}
                    </Text>
                  </Box>

                  <HStack spacing={3}>
                    <Button
                      flex={1} borderRadius="xl" fontWeight="800" size="md" variant="outline"
                      borderColor={borderColor} color={headingClr}
                      _hover={{ borderColor: '#ffd700', color: '#ffd700' }}
                      transition="all .2s"
                      onClick={() => setStep(2)}
                    >
                      ← Back
                    </Button>
                    <Button
                      flex={2} borderRadius="xl" fontWeight="800" size="md"
                      bg="#ffd700" color="#0f1623"
                      _hover={{ bg: '#f5c800', transform: 'translateY(-1px)' }}
                      transition="all .2s"
                      isLoading={submitting} loadingText="Submitting…"
                      onClick={async () => {
                        setSubmitError(null);
                        setSubmitting(true);
                        let dbId: number | undefined;
                        try {
                          const res = await api.post('/markets', {
                            title,
                            category,
                            region: country,
                            endTime: endDate,
                            tags: [criteria, source].filter(Boolean),
                          });
                          dbId = res.data?.id;
                        } catch {
                          // Backend offline — fall through to local state only
                        } finally {
                          setSubmitting(false);
                        }
                        submitMarketForReview({ title, category, country, endDate, criteria, source, _dbId: dbId });
                        setSubmitted(true);
                      }}
                    >
                      Submit for Review
                    </Button>
                  </HStack>
                </VStack>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
