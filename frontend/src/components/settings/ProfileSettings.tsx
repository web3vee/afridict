import React, { useState } from 'react';
import {
  Box, Button, Heading, HStack, Input, Text, Textarea, VStack,
  useColorModeValue, useToast,
} from '@chakra-ui/react';

interface ProfileSettingsProps {
  displayName: string | null;
  displayAddress: string | null;
  displayPhoto: string | null;
  account: string | null;
  userEmail: string | null;
}

export default function ProfileSettings({
  displayName, displayAddress, displayPhoto, account, userEmail,
}: ProfileSettingsProps) {
  const toast = useToast();
  const [bio, setBio]               = useState('');
  const [xConnected, setXConnected] = useState(false);

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const inputBg      = useColorModeValue('#ffffff', '#111827');
  const inputBorder  = useColorModeValue('#cbd5e1', '#334155');
  const mutedColor   = useColorModeValue('#475569', '#94a3b8');
  const subtleBorder = useColorModeValue('#f1f5f9', '#1e293b');

  const avatarLetter = (displayName || displayAddress || 'U')[0].toUpperCase();

  return (
    <Box>
      <Heading size="lg" fontWeight="800" color={headingColor} mb={6}>Profile Settings</Heading>

      {/* Avatar */}
      <Box mb={6}>
        {displayPhoto
          ? <img src={displayPhoto} alt="av" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #1e293b' }} />
          : <Box w={16} h={16} borderRadius="full" bg="linear-gradient(135deg,#38bdf8,#4ade80)"
              display="flex" alignItems="center" justifyContent="center" cursor="pointer"
              _hover={{ opacity: 0.85 }} title="Change avatar">
              <Text fontSize="2xl" fontWeight="900" color="white">{avatarLetter}</Text>
            </Box>
        }
      </Box>

      <VStack spacing={5} align="stretch">
        {/* Username */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Username</Text>
          <Input defaultValue={displayAddress || displayName || ''} placeholder="Enter username"
            bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="lg"
            fontSize="sm" color={headingColor} _placeholder={{ color: 'gray.400' }}
            _focus={{ borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' }} />
        </Box>

        {/* Email */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Email</Text>
          <Input defaultValue={userEmail || ''} placeholder="your@email.com"
            bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="lg"
            fontSize="sm" color={headingColor} _placeholder={{ color: 'gray.400' }}
            _focus={{ borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' }} />
        </Box>

        {/* Address (read-only) */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Address</Text>
          <HStack bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="lg" px={4} py={2.5}>
            <Text fontSize="sm" color={mutedColor} flex={1} fontFamily="mono" isTruncated>{account || '—'}</Text>
            <Box cursor="pointer" fontSize="sm" color="gray.400" _hover={{ color: headingColor }}
              onClick={() => account && navigator.clipboard.writeText(account).then(() =>
                toast({ title: 'Address copied!', status: 'success', duration: 1500 })
              )}>⧉</Box>
          </HStack>
          <Text fontSize="xs" color="gray.400" mt={1.5}>Do not send funds to this address. This address is for API use only.</Text>
        </Box>

        {/* Bio */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Bio</Text>
          <Textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)}
            bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="lg"
            fontSize="sm" color={headingColor} _placeholder={{ color: 'gray.400' }}
            _focus={{ borderColor: '#3b82f6', boxShadow: '0 0 0 1px #3b82f6' }}
            rows={4} resize="none" />
        </Box>

        {/* Social connections */}
        <Box>
          <Text fontSize="sm" fontWeight="600" color={headingColor} mb={3}>Social Connections</Text>
          <Button size="sm" borderRadius="lg" fontWeight="700" fontSize="sm"
            bg={xConnected ? 'linear-gradient(135deg,#1d9bf0,#0e7fd8)' : subtleBorder}
            color={xConnected ? 'white' : headingColor}
            border="1px solid" borderColor={xConnected ? '#1d9bf0' : inputBorder}
            leftIcon={<Text fontWeight="900" fontSize="xs">✕</Text>}
            _hover={{ opacity: .85 }}
            onClick={() => setXConnected(v => !v)}
          >{xConnected ? 'X Connected ✓' : 'Connect X'}</Button>
        </Box>

        {/* Save */}
        <Box>
          <Button bg="linear-gradient(135deg,#6366f1,#4f46e5)" color="white"
            fontWeight="700" borderRadius="lg" px={8}
            _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
            onClick={() => toast({ title: '✅ Profile saved!', status: 'success', duration: 2000 })}
          >Save changes</Button>
        </Box>
      </VStack>
    </Box>
  );
}
