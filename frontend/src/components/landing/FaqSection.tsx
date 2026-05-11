import React, { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';

const FAQS = [
  {
    q: 'Do I need a crypto wallet?',
    a: 'No. Sign up with email and deposit in NGN, KES, or ZAR via Paystack or Flutterwave. We handle the crypto conversion. A wallet is only needed for direct Polygon withdrawals.',
  },
  {
    q: 'How are markets resolved?',
    a: 'Using verified sources — official election results, sports APIs, commodity feeds, and Chainlink oracles for major events. All resolution data is posted on-chain.',
  },
  {
    q: 'What if a market is cancelled?',
    a: 'All bets are refunded in full automatically. The smart contract guarantees this — we cannot withhold funds.',
  },
  {
    q: 'What is the minimum bet?',
    a: '$0.5 USDT minimum. No maximum. You can split across multiple markets.',
  },
  {
    q: 'How do I withdraw winnings?',
    a: 'Winnings are auto-credited to your balance on resolution. Withdraw to your bank (NGN/KES/ZAR), mobile money, or directly to a Polygon USDT wallet.',
  },
];

interface FaqSectionProps {
  headingColor: string;
  borderColor: string;
}

export default function FaqSection({ headingColor, borderColor }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Box py={20} px={{ base: 6, lg: 12 }} bg={useColorModeValue('white', '#080c14')}>
      <Box maxW="760px" mx="auto">
        <VStack mb={12} spacing={2} textAlign="center">
          <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700" textTransform="uppercase">FAQ</Text>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="800" color={headingColor}>Common Questions</Heading>
        </VStack>

        <VStack spacing={3} align="stretch">
          {FAQS.map((faq, i) => {
            const open = openFaq === i;
            return (
              <Box key={i} className="lp-faq-item"
                bg={useColorModeValue('gray.50', '#0f1623')}
                border="1px solid" borderColor={open ? '#ffd700' : borderColor}
                borderRadius="xl" overflow="hidden" transition="border-color .2s"
              >
                <HStack px={6} py={4} cursor="pointer" justify="space-between"
                  onClick={() => setOpenFaq(open ? null : i)}
                  _hover={{ bg: useColorModeValue('gray.100', 'rgba(255,255,255,.02)') }}
                >
                  <Text fontWeight="600" fontSize="sm" color={useColorModeValue('gray.800', 'white')}>{faq.q}</Text>
                  <Text color="#ffd700" fontWeight="800" fontSize="lg" flexShrink={0} ml={4} lineHeight="1">{open ? '−' : '+'}</Text>
                </HStack>
                {open && (
                  <Box px={6} pb={5} borderTop="1px solid" borderColor={borderColor}>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', '#94a3b8')} lineHeight="1.8" pt={4}>{faq.a}</Text>
                  </Box>
                )}
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
}
