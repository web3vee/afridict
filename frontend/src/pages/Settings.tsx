import React, { useState } from 'react';
import {
  Box, Button, Heading, HStack, Input, Text, VStack,
  useColorModeValue, useToast,
} from '@chakra-ui/react';
import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import { User, CreditCard, TrendingUp, Bell, Plug, Code2, KeyRound } from 'lucide-react';

const SIDE_ITEMS = [
  { id: 'profile',       Icon: User,       label: 'Profile'          },
  { id: 'account',       Icon: CreditCard, label: 'Account'          },
  { id: 'trading',       Icon: TrendingUp, label: 'Trading'          },
  { id: 'notifications', Icon: Bell,       label: 'Notifications'    },
  { id: 'apikeys',       Icon: Plug,       label: 'Relayer API Keys' },
  { id: 'builder',       Icon: Code2,      label: 'Builder Codes'    },
  { id: 'privatekey',    Icon: KeyRound,   label: 'Private Key'      },
];

const COMING_SOON = ['trading', 'apikeys'];

interface SettingsProps {
  displayName: string | null;
  displayAddress: string | null;
  displayPhoto: string | null;
  account: string | null;
  userEmail: string | null;
}

export default function Settings({
  displayName, displayAddress, displayPhoto, account, userEmail,
}: SettingsProps) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  const borderColor  = useColorModeValue('#e2e8f0',  '#1e293b');
  const headingColor = useColorModeValue('#0f172a',  '#f8fafc');
  const mutedColor   = useColorModeValue('#475569',  '#94a3b8');
  const subtleBorder = useColorModeValue('#f1f5f9',  '#1e293b');
  const inputBg      = useColorModeValue('#ffffff',  '#111827');
  const redBg        = useColorModeValue('#fef2f2',  'rgba(248,113,113,0.08)');
  const redBorder    = useColorModeValue('#fecaca',  'rgba(248,113,113,0.3)');
  const redText      = useColorModeValue('#dc2626',  '#f87171');
  const redIcon      = useColorModeValue('#ef4444',  '#f87171');
  const stepTextColor = useColorModeValue('gray.700', '#94a3b8');

  const activeLabel = SIDE_ITEMS.find(s => s.id === activeTab)?.label ?? '';

  return (
    <Box display="flex" maxW="900px" mx="auto" w="full" px={6} py={8} gap={8}>

      {/* Sub-sidebar */}
      <Box w="200px" flexShrink={0}>
        <VStack spacing={1} align="stretch">
          {SIDE_ITEMS.map(item => (
            <Box key={item.id} px={3} py={2.5} borderRadius="lg" cursor="pointer"
              bg={activeTab === item.id ? subtleBorder : 'transparent'}
              color={activeTab === item.id ? headingColor : mutedColor}
              fontWeight={activeTab === item.id ? '700' : '500'}
              fontSize="sm" display="flex" alignItems="center" gap={3}
              _hover={{ bg: subtleBorder, color: headingColor }} transition="all .15s"
              onClick={() => setActiveTab(item.id)}>
              <item.Icon size={14} strokeWidth={2.2} style={{ opacity: activeTab === item.id ? 1 : 0.6 }} />
              {item.label}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Content */}
      <Box flex={1}>

        {activeTab === 'profile' && (
          <ProfileSettings
            displayName={displayName}
            displayAddress={displayAddress}
            displayPhoto={displayPhoto}
            account={account}
            userEmail={userEmail}
          />
        )}

        {activeTab === 'account' && <AccountSettings />}

        {activeTab === 'notifications' && <NotificationSettings />}

        {activeTab === 'builder' && (
          <Box>
            <Heading size="lg" fontWeight="800" color={headingColor} mb={2}>Builder Settings</Heading>
            <Text fontSize="sm" color={mutedColor} mb={0.5}>You don't have a builder profile yet.</Text>
            <Text fontSize="sm" color={mutedColor} mb={6}>Create one to get started with building on Afridict.</Text>
            <Box>
              <Text fontSize="sm" fontWeight="600" color={headingColor} mb={2}>Builder Name</Text>
              <Input placeholder="Enter your builder name"
                bg={inputBg} border="1px solid" borderColor="#6366f1" borderRadius="lg"
                fontSize="sm" color={headingColor} _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: '#6366f1', boxShadow: '0 0 0 1px #6366f1' }} mb={5} />
              <Button bg="linear-gradient(135deg,#818cf8,#6366f1)" color="white"
                fontWeight="700" borderRadius="lg" px={6}
                _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                onClick={() => toast({ title: '✅ Builder profile created!', status: 'success', duration: 2000 })}
              >Create Builder Profile</Button>
            </Box>
          </Box>
        )}

        {activeTab === 'privatekey' && (
          <Box>
            <Heading size="lg" fontWeight="800" color={headingColor} mb={3}>Private Key</Heading>
            <Text fontSize="sm" color={mutedColor} mb={6} lineHeight="1.7">
              Exporting your private key gives you direct control and security over your funds.
              This is applicable if you've signed up via email.
            </Text>
            <Box bg={redBg} border="1px solid" borderColor={redBorder} borderRadius="xl" px={4} py={3} mb={6}>
              <HStack spacing={2}>
                <Text fontSize="sm" color={redIcon}>ⓘ</Text>
                <Text fontSize="sm" color={redText} fontWeight="500">
                  DO NOT share your private key with anyone. We will never ask for your private key.
                </Text>
              </HStack>
            </Box>
            <Box bg={inputBg} border="1px solid" borderColor={borderColor} borderRadius="xl" p={5} mb={6}>
              <Text fontWeight="700" color={headingColor} fontSize="sm" mb={4}>Basic Steps</Text>
              <VStack spacing={0} align="stretch">
                {[
                  'Start the process below and sign into Magic.Link',
                  'Export your private key and securely store the private key displayed.',
                  'Log out of Magic.Link',
                ].map((step, i) => (
                  <HStack key={i} spacing={4} py={3}
                    borderBottom={i < 2 ? '1px solid' : 'none'} borderColor={borderColor} align="flex-start">
                    <Box w={6} h={6} borderRadius="full" bg={subtleBorder}
                      display="flex" alignItems="center" justifyContent="center" flexShrink={0} mt={0.5}>
                      <Text fontSize="xs" fontWeight="800" color={mutedColor}>{i + 1}</Text>
                    </Box>
                    <Text fontSize="sm" color={stepTextColor}>{step}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            <Button bg="red.500" color="white" fontWeight="700" borderRadius="lg" px={6}
              _hover={{ bg: 'red.600', transform: 'translateY(-1px)' }} transition="all .2s"
              onClick={() => toast({ title: '🔐 Export initiated — check your email for Magic.Link.', status: 'info', duration: 4000 })}
            >Start Export</Button>
          </Box>
        )}

        {COMING_SOON.includes(activeTab) && (
          <Box>
            <Heading size="lg" fontWeight="800" color={headingColor} mb={6}>{activeLabel}</Heading>
            <Box py={16} textAlign="center" bg={inputBg} border="1px solid"
              borderColor={borderColor} borderRadius="2xl">
              <Text fontSize="3xl" mb={3}>🔧</Text>
              <Text fontSize="sm" color="gray.400">Coming soon.</Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
