import React, { useState } from 'react';
import { Box, Button, HStack, Heading, Input, SimpleGrid, Switch, Text, VStack } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';

export default function AdminSettings() {
  const [saved, setSaved] = React.useState(false);
  const c = useAdminColors();
  const [platformFee, setPlatformFee] = useState('2');
  const [minBet, setMinBet] = useState('0.5');
  const [autoResolve, setAutoResolve] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <Box>
      <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor} mb={6}>Settings</Heading>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Platform Settings */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={5} fontSize="sm">Platform Settings</Text>
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wider">Platform Fee (%)</Text>
              <HStack>
                <Input value={platformFee} onChange={e => setPlatformFee(e.target.value)}
                  bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}
                  color={c.adminHeadingColor} borderRadius="xl"
                  _focus={{ borderColor: '#ffd700', boxShadow: 'none' }} w="100px"
                />
                <Text fontSize="sm" color={c.adminSubtextColor}>% of winnings</Text>
              </HStack>
            </Box>
            <Box>
              <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wider">Minimum Bet (USDT)</Text>
              <Input value={minBet} onChange={e => setMinBet(e.target.value)}
                bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}
                color={c.adminHeadingColor} borderRadius="xl"
                _focus={{ borderColor: '#ffd700', boxShadow: 'none' }} w="100px"
              />
            </Box>
            <HStack justify="space-between" py={3} borderTop="1px solid" borderColor={c.adminBorderColor}>
              <Box>
                <Text fontSize="sm" fontWeight="600" color={c.adminHeadingColor}>Auto-resolve Markets</Text>
                <Text fontSize="xs" color={c.adminSubtextColor}>Resolve via Chainlink oracle</Text>
              </Box>
              <Switch isChecked={autoResolve} onChange={() => setAutoResolve(v => !v)} colorScheme="yellow" />
            </HStack>
            <HStack justify="space-between" py={3} borderTop="1px solid" borderColor={c.adminBorderColor}>
              <Box>
                <Text fontSize="sm" fontWeight="600" color={maintenance ? '#f87171' : c.adminHeadingColor}>Maintenance Mode</Text>
                <Text fontSize="xs" color={c.adminSubtextColor}>Disable all trading</Text>
              </Box>
              <Switch isChecked={maintenance} onChange={() => setMaintenance(v => !v)} colorScheme="red" />
            </HStack>
          </VStack>
        </Box>

        {/* Oracle & Network */}
        <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" p={6}>
          <Text fontWeight="700" color={c.adminHeadingColor} mb={5} fontSize="sm">Oracle &amp; Network</Text>
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wider">Oracle Provider</Text>
              <Box as="select"
                style={{ width: '100%', padding: '10px 14px', background: '#1e293b', border: '1px solid #374151', borderRadius: '12px', color: '#94a3b8', fontSize: '14px', outline: 'none' }}
              >
                <option style={{ background: '#1e293b' }}>Chainlink (Primary)</option>
                <option style={{ background: '#1e293b' }}>UMA Protocol</option>
                <option style={{ background: '#1e293b' }}>Manual Resolution</option>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wider">Network</Text>
              <Box bg={c.adminInputBg} borderRadius="xl" px={4} py={3}>
                <HStack>
                  <Box w={2} h={2} borderRadius="full" bg="#4ade80" style={{ animation: 'lp-pulse 1.6s infinite' }} />
                  <Text fontSize="sm" color={c.adminSecondaryColor}>Polygon Mainnet (Chain ID: 137)</Text>
                </HStack>
              </Box>
            </Box>
            <Box>
              <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={2} textTransform="uppercase" letterSpacing="wider">Contract Address</Text>
              <Box bg={c.adminInputBg} borderRadius="xl" px={4} py={3}>
                <Text fontSize="11px" color={c.adminSubtextColor} fontFamily="mono">0x742d...8af3 · Verified ✓</Text>
              </Box>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box mt={6} display="flex" justifyContent="flex-end">
        <Button bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900" fontWeight="700" borderRadius="xl" px={8}
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
        >{saved ? '✓ Saved' : 'Save Changes'}</Button>
      </Box>
    </Box>
  );
}
