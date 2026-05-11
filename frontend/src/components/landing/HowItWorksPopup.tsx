import React from 'react';
import { Box, Button, Heading, HStack, Text, VStack, useColorModeValue } from '@chakra-ui/react';

interface HowItWorksPopupProps {
  step: number;
  onNext: () => void;
  onClose: () => void;
  onLogin: () => void;
}

export default function HowItWorksPopup({ step, onNext, onClose, onLogin }: HowItWorksPopupProps) {
  const headingColor = useColorModeValue('gray.800', 'white');
  const bodyColor    = useColorModeValue('gray.500', '#94a3b8');

  if (step === 0) return null;

  return (
    <Box position="fixed" inset={0} bg="blackAlpha.700" zIndex={9998}
      display="flex" alignItems="center" justifyContent="center"
      onClick={onClose}
    >
      <Box
        bg={useColorModeValue('white', '#1a1400')}
        border="1px solid" borderColor={useColorModeValue('#ffd700', '#ffd70040')}
        borderRadius="2xl" w="420px" overflow="hidden"
        boxShadow="0 32px 80px rgba(255,215,0,.15), 0 16px 60px rgba(0,0,0,.6)"
        onClick={e => e.stopPropagation()}
      >
        {/* Illustration */}
        <Box px={6} pt={4} pb={2}>
          {step === 1 && (
            <Box bg={useColorModeValue('#fffbeb', '#2a1f00')} borderRadius="xl" p={6} textAlign="center">
              <Box display="inline-flex" bg="white" borderRadius="xl" p={4} boxShadow="0 8px 24px rgba(0,0,0,.15)" mb={2}>
                <VStack spacing={3} w="200px">
                  <Text fontSize="sm" fontWeight="700" color="gray.800" textAlign="center">
                    Will Nigeria qualify for the 2026 World Cup?
                  </Text>
                  <HStack w="full" justify="center" spacing={1}>
                    <Box flex={1} h={1} bg="#4ade80" borderRadius="full" />
                    <Text fontSize="xs" fontWeight="800" color="gray.500">50%</Text>
                    <Box flex={1} h={1} bg="gray.200" borderRadius="full" />
                  </HStack>
                  <HStack w="full" spacing={2}>
                    <Button flex={1} size="sm" bg="#4ade80" color="gray.900" fontWeight="700" borderRadius="lg">Yes</Button>
                    <Button flex={1} size="sm" bg="gray.300" color="gray.700" fontWeight="700" borderRadius="lg">No</Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          )}
          {step === 2 && (
            <Box bg={useColorModeValue('gray.50', '#0f1623')} borderRadius="xl" p={6}
              display="flex" justifyContent="center" position="relative" minH="140px"
            >
              <Box position="absolute" top={8} left="50%" transform="translateX(-20%) rotate(6deg)"
                bg="white" borderRadius="xl" p={4} boxShadow="0 8px 24px rgba(0,0,0,.15)" w="160px"
              >
                <Text fontSize="xs" color="gray.400" mb={1}>$100</Text>
                <Text fontSize="sm" fontWeight="700" color="#4ade80">To Win $133</Text>
                <Box mt={2} h={7} bg="#f87171" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="xs" color="white" fontWeight="700">Buy No</Text>
                </Box>
              </Box>
              <Box position="relative" zIndex={1} bg="white" borderRadius="xl" p={4}
                boxShadow="0 12px 32px rgba(0,0,0,.2)" w="160px" transform="translateX(-10%)"
              >
                <Text fontSize="2xl" fontWeight="900" color="gray.800" mb={0}>$100</Text>
                <Text fontSize="sm" fontWeight="700" color="#4ade80" mb={3}>To Win $400</Text>
                <Box h={7} bg="#4ade80" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="xs" color="gray.900" fontWeight="700">Buy Yes</Text>
                </Box>
              </Box>
            </Box>
          )}
          {step === 3 && (
            <Box bg={useColorModeValue('#fffbeb', '#2a1f00')} borderRadius="xl" p={6}
              textAlign="center" position="relative" overflow="hidden"
            >
              {['#ffd700','#4ade80','#60a5fa','#f87171','#a78bfa'].map((c, i) => (
                <Box key={i} position="absolute" w={2} h={2} borderRadius="sm" bg={c}
                  style={{ top: `${15 + i * 12}%`, left: `${10 + i * 18}%`, transform: `rotate(${i * 30}deg)` }}
                />
              ))}
              {['#4ade80','#ffd700','#f87171','#60a5fa'].map((c, i) => (
                <Box key={i} position="absolute" w={1.5} h={1.5} borderRadius="sm" bg={c}
                  style={{ top: `${20 + i * 15}%`, right: `${8 + i * 15}%`, transform: `rotate(${i * 45}deg)` }}
                />
              ))}
              <Box display="inline-block" bg="white" borderRadius="xl" p={4}
                boxShadow="0 8px 24px rgba(0,0,0,.15)" w="200px"
              >
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="xs" color="gray.500">Will Nigeria qualify?</Text>
                  <Text fontSize="lg" color="#4ade80">↗</Text>
                </HStack>
                <Box borderTop="1px dashed" borderColor="gray.200" pt={3}>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="xs" color="gray.400">Odds</Text>
                    <Box w={12} h={2} bg="gray.100" borderRadius="full" />
                  </HStack>
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="xs" color="gray.400">Amount</Text>
                    <Box w={10} h={2} bg="gray.100" borderRadius="full" />
                  </HStack>
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="xs" color="gray.400">To Win</Text>
                    <Text fontSize="xl" fontWeight="900" color="#4ade80">$250</Text>
                  </HStack>
                  <Box h={8} bg="#60a5fa" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="sm" color="white" fontWeight="700">Cash Out</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Text */}
        <Box px={7} pt={3} pb={2}>
          {step === 1 && <>
            <Heading size="md" mb={2} color={headingColor}>1. Pick a Market</Heading>
            <Text fontSize="sm" color={bodyColor} lineHeight="1.7">
              Browse African events and pick YES or NO. Odds shift in real time as other predictors join.
            </Text>
          </>}
          {step === 2 && <>
            <Heading size="md" mb={2} color={headingColor}>2. Place a Trade</Heading>
            <Text fontSize="sm" color={bodyColor} lineHeight="1.7">
              Deposit in NGN, KES, or ZAR via Paystack or Flutterwave — then you're ready to bet in USDT.
            </Text>
          </>}
          {step === 3 && <>
            <Heading size="md" mb={2} color={headingColor}>3. Redeem Winnings</Heading>
            <Text fontSize="sm" color={bodyColor} lineHeight="1.7">
              When the market resolves, winnings are paid to your wallet automatically. No forms, no delays.
            </Text>
          </>}
        </Box>

        {/* Next / Get Started button */}
        <Box px={7} pb={7} pt={4}>
          <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
            bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
            _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
            onClick={step < 3 ? onNext : onLogin}
          >{step < 3 ? 'Next →' : 'Get Started →'}</Button>
        </Box>
      </Box>
    </Box>
  );
}
