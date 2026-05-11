import React from 'react';
import { Box, Button, Heading, HStack, Switch, Text, useColorModeValue, useToast } from '@chakra-ui/react';

export default function AccountSettings() {
  const toast = useToast();

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const inputBg      = useColorModeValue('#ffffff', '#111827');
  const redBg        = useColorModeValue('#fef2f2', 'rgba(248,113,113,0.08)');
  const redBorder    = useColorModeValue('#fecaca', 'rgba(248,113,113,0.3)');
  const redText      = useColorModeValue('#dc2626', '#f87171');
  const redIcon      = useColorModeValue('#ef4444', '#f87171');

  return (
    <Box>
      <Heading size="lg" fontWeight="800" color={headingColor} mb={6}>Account Settings</Heading>

      {/* 2FA */}
      <Text fontWeight="700" color={headingColor} fontSize="md" mb={3}>Two-Factor Authentication</Text>
      <Box bg={inputBg} border="1px solid" borderColor={borderColor} borderRadius="xl" p={5} mb={8}>
        <HStack justify="space-between">
          <Box>
            <Text fontSize="sm" fontWeight="700" color={headingColor} mb={0.5}>Enable 2FA</Text>
            <Text fontSize="xs" color="gray.400">Add an extra layer of security using an authenticator app</Text>
          </Box>
          <Switch colorScheme="blue" size="md" />
        </HStack>
      </Box>

      {/* Delete Account */}
      <Text fontWeight="700" color={headingColor} fontSize="md" mb={3}>Delete Account</Text>
      <Box bg={redBg} border="1px solid" borderColor={redBorder} borderRadius="xl" p={4} mb={4}>
        <HStack spacing={2}>
          <Text fontSize="sm" color={redIcon}>ⓘ</Text>
          <Text fontSize="sm" color={redText} fontWeight="500">
            Permanently delete your account. This action cannot be undone.
          </Text>
        </HStack>
      </Box>
      <Button bg="red.500" color="white" fontWeight="700" borderRadius="lg" px={6}
        _hover={{ bg: 'red.600', transform: 'translateY(-1px)' }} transition="all .2s"
        onClick={() => toast({ title: '⚠️ Account deletion requires confirmation — contact support.', status: 'warning', duration: 4000 })}
      >Delete Account</Button>
    </Box>
  );
}
