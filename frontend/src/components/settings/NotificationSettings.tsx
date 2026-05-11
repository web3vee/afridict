import React from 'react';
import { Box, Heading, HStack, Switch, Text, VStack, useColorModeValue } from '@chakra-ui/react';

export default function NotificationSettings() {
  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const inputBg      = useColorModeValue('#ffffff', '#111827');
  const subtleBorder = useColorModeValue('#f1f5f9', '#1e293b');
  const rowTextColor = useColorModeValue('gray.700', '#94a3b8');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');

  return (
    <Box>
      <Heading size="lg" fontWeight="800" color={headingColor} mb={6}>Notifications Settings</Heading>

      <Box bg={inputBg} border="1px solid" borderColor={borderColor} borderRadius="xl" overflow="hidden">

        {/* Email section */}
        <Box px={5} py={4} borderBottom="1px solid" borderColor={borderColor}>
          <HStack spacing={2} mb={4}>
            <Box w={7} h={7} borderRadius="md" bg={subtleBorder}
              display="flex" alignItems="center" justifyContent="center" fontSize="sm">✉️</Box>
            <Text fontWeight="700" fontSize="sm" color={headingColor}>Email</Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color={rowTextColor}>Resolutions</Text>
            <Switch colorScheme="blue" size="md" />
          </HStack>
        </Box>

        {/* In-app section */}
        <Box px={5} py={4}>
          <HStack spacing={2} mb={4}>
            <Box w={7} h={7} borderRadius="md" bg={subtleBorder}
              display="flex" alignItems="center" justifyContent="center" fontSize="sm">🔔</Box>
            <Text fontWeight="700" fontSize="sm" color={headingColor}>In-app</Text>
          </HStack>
          <VStack spacing={4} align="stretch">
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color={rowTextColor}>Order Fills</Text>
                <Switch colorScheme="blue" size="md" defaultChecked />
              </HStack>
              <HStack spacing={2} pl={1}>
                <Box w={4} h={4} borderRadius="sm" bg="#3b82f6" border="1px solid #3b82f6"
                  display="flex" alignItems="center" justifyContent="center" cursor="pointer" flexShrink={0}>
                  <Text fontSize="9px" color="white" fontWeight="900">✓</Text>
                </Box>
                <Text fontSize="xs" color={mutedColor}>Hide small fills (&lt;1 share)</Text>
              </HStack>
            </Box>
            <HStack justify="space-between">
              <Text fontSize="sm" color={rowTextColor}>Resolutions</Text>
              <Switch colorScheme="blue" size="md" defaultChecked />
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
