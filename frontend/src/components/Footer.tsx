import React from 'react';
import {
  Box, Button, HStack, Menu, MenuButton, MenuList, MenuItem,
  SimpleGrid, Text, VStack, useColorMode, useColorModeValue,
} from '@chakra-ui/react';
const LOGO2 = '/mylogo2.png';
import { LANGUAGES } from '../data/staticData';
import { useApp } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';

const SOCIAL_ICONS = [
  { label: 'Facebook',  path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Twitter',   path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
  { label: 'Instagram', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
  { label: 'LinkedIn',  path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { label: 'YouTube',   path: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
];

export default function Footer() {
  const { language, setLanguage, isLoggedIn, setHowItWorksStep } = useApp();
  const { colorMode, toggleColorMode } = useColorMode();

  const navBg          = useColorModeValue('#ffffff',    '#0f172a');
  const borderMd       = useColorModeValue('#cbd5e1',    '#334155');
  const subtleBg       = useColorModeValue('#f1f5f9',    '#1e293b');
  const mutedColor     = useColorModeValue('#475569',    '#94a3b8');
  const textColor      = useColorModeValue('#1e293b',    '#e2e8f0');
  const linkHeading    = useColorModeValue('gray.800',   'white');
  const linkColor      = useColorModeValue('gray.500',   '#94a3b8');
  const socialBorder   = useColorModeValue('gray.300',   '#374151');
  const langActiveBg   = useColorModeValue('gray.100',   '#1f2937');
  const langBtnColor   = useColorModeValue('gray.600',   '#94a3b8');

  return (
    <Box bg={navBg} borderTop="1px solid" borderColor={borderMd}>
      <Box maxW="1200px" mx="auto" px={8} py={12}>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10} mb={10}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="700" fontSize="sm" mb={1} color={linkHeading}>Support Center</Text>
            {['Help Center', 'FAQ', 'Contact Us', 'Terms of Use', 'Privacy Policy', 'Sitemap'].map(l => (
              <Text key={l} fontSize="sm" color={linkColor} cursor="pointer" _hover={{ color: '#ffd700' }}>{l}</Text>
            ))}
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontWeight="700" fontSize="sm" mb={1} color={linkHeading}>Afridict</Text>
            {['Latest Markets', 'How to start', 'About Us', 'Careers', 'Brand Assets', 'Merchandise']
              .filter(l => l !== 'How to start' || !isLoggedIn)
              .map(l => (
                <Text key={l} fontSize="sm" color={linkColor} cursor="pointer" _hover={{ color: '#ffd700' }}
                  onClick={l === 'How to start' ? () => setHowItWorksStep(1) : undefined}>{l}</Text>
              ))}
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontWeight="700" fontSize="sm" mb={1} color={linkHeading}>Community</Text>
            {['Leaderboard', 'Blog', 'Message Boards', 'Refer a Friend', 'Ambassador Program'].map(l => (
              <Text key={l} fontSize="sm" color={linkColor} cursor="pointer" _hover={{ color: '#ffd700' }}>{l}</Text>
            ))}
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontWeight="700" fontSize="sm" mb={1} color={linkHeading}>Tools</Text>
            {['API Docs', 'Embed Markets', 'Market Creator', 'Polygon Explorer', 'Accuracy Stats', 'Photo Tools'].map(l => (
              <Text key={l} fontSize="sm" color={linkColor} cursor="pointer" _hover={{ color: '#ffd700' }}>{l}</Text>
            ))}
          </VStack>
        </SimpleGrid>
      </Box>

      <Box borderTop="1px solid" borderColor={borderMd} py={4}>
        <Box maxW="1200px" mx="auto" px={8} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={3}>
          <HStack spacing={3}>
            {SOCIAL_ICONS.map(s => (
              <Box key={s.label} w={8} h={8} borderRadius="full" border="1px solid" borderColor={socialBorder}
                display="flex" alignItems="center" justifyContent="center" cursor="pointer"
                _hover={{ borderColor: '#ffd700', color: '#ffd700' }} transition="all .2s" color={mutedColor}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.path} />
                </svg>
              </Box>
            ))}
          </HStack>

          <HStack spacing={2}>
            <img src={LOGO2} alt="Afridict" style={{ width: 18, height: 18, objectFit: 'contain', filter: colorMode === 'dark' ? 'invert(1)' : undefined }} />
            <Text fontSize="sm" color={mutedColor}>© 2026 Afridict. All rights reserved.</Text>
          </HStack>

          <Menu>
            <MenuButton as={Button} size="sm" variant="outline"
              borderColor={socialBorder} color={langBtnColor}
              borderRadius="md" fontWeight="600" fontSize="xs"
              _hover={{ borderColor: '#ffd700' }}
              rightIcon={<Text fontSize="10px">▾</Text>}>
              {language.flag} {language.label}
            </MenuButton>
            <MenuList bg={navBg} borderColor={borderMd} minW="160px" zIndex={999}>
              {LANGUAGES.map(l => (
                <MenuItem key={l.code}
                  bg={language.code === l.code ? langActiveBg : 'transparent'}
                  _hover={{ bg: subtleBg }} onClick={() => setLanguage(l)} fontSize="sm">
                  <HStack spacing={2} w="full" justify="space-between">
                    <HStack spacing={2}><Text>{l.flag}</Text><Text>{l.label}</Text></HStack>
                    {language.code === l.code && <Text color="#4ade80" fontSize="xs">●</Text>}
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Button size="sm" variant="outline"
            borderColor={socialBorder} color={textColor}
            leftIcon={colorMode === 'dark' ? <Moon size={13} strokeWidth={2} /> : <Sun size={13} strokeWidth={2} />}
            onClick={toggleColorMode} borderRadius="md" fontWeight="600" fontSize="xs"
            _hover={{ borderColor: '#ffd700' }}>
            {colorMode === 'dark' ? 'Dark' : 'Light'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
