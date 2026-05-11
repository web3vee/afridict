import React from 'react';
import {
  Box, HStack, VStack, Text, Button, Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface MentionMarket {
  id: number;
  day: number;
  month: string;
  time: string;
  volume: string;
  flag: string;
  color: string;
  title: string;
  tags: string[];
  extraCount: number;
  isNew?: boolean;
}

const MENTION_MARKETS: MentionMarket[] = [
  {
    id: 1,
    day: 2, month: 'May', time: 'Fri, 10:00 AM', volume: '$12,450 Vol.',
    flag: '🇰🇪', color: '#4ade80',
    title: 'What will President William Ruto say about the Bomas Convention Centre?',
    tags: ['Convention Centre', 'Bomas of Kenya'],
    extraCount: 8,
  },
  {
    id: 2,
    day: 5, month: 'May', time: 'Mon, 2:00 PM', volume: '$31,200 Vol.',
    flag: '🇳🇬', color: '#ffd700',
    title: 'What will President Bola Tinubu say about economic reforms / fuel subsidy?',
    tags: ['Fuel Subsidy', 'Economic Reform'],
    extraCount: 14,
  },
  {
    id: 3,
    day: 7, month: 'May', time: 'Wed, 8:00 PM', volume: '$9,870 Vol.',
    flag: '🇳🇬', color: '#f472b6',
    title: 'What will Burna Boy say in his next major interview about Afrobeats?',
    tags: ['Afrobeats', 'African Giant'],
    extraCount: 6,
    isNew: true,
  },
  {
    id: 4,
    day: 8, month: 'May', time: 'Thu, 11:00 AM', volume: '$22,100 Vol.',
    flag: '🇿🇦', color: '#60a5fa',
    title: 'What will President Cyril Ramaphosa say about Palestine / global issues?',
    tags: ['Palestine', 'Global Issues', 'ANC'],
    extraCount: 11,
  },
  {
    id: 5,
    day: 10, month: 'May', time: 'Sat, 3:00 PM', volume: '$7,640 Vol.',
    flag: '🇬🇭', color: '#34d399',
    title: 'What will John Mahama say about Nigeria-Ghana relations?',
    tags: ['Nigeria-Ghana', 'ECOWAS'],
    extraCount: 5,
    isNew: true,
  },
  {
    id: 6,
    day: 12, month: 'May', time: 'Mon, 6:00 PM', volume: '$18,930 Vol.',
    flag: '🌍', color: '#f97316',
    title: 'What will a top AFCON official say about the Senegal-Morocco hosting drama?',
    tags: ['AFCON 2025', 'Senegal', 'Morocco'],
    extraCount: 9,
  },
];

export default function MentionsPage() {
  const navigate = useNavigate();
  const { openBetYes } = useApp();

  const pageBg      = useColorModeValue('#f8fafc', '#070b14');
  const cardBg      = useColorModeValue('white',   '#111827');
  const borderColor = useColorModeValue('#e2e8f0', '#1e293b');
  const hoverBg     = useColorModeValue('gray.50', 'rgba(255,255,255,.03)');
  const headingColor= useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor  = useColorModeValue('#475569', '#94a3b8');
  const dayColor    = useColorModeValue('#0f172a', 'white');
  const tagBg       = useColorModeValue('gray.100','#1e293b');
  const tagColor    = useColorModeValue('gray.600', '#94a3b8');
  const dividerColor= useColorModeValue('#e2e8f0', '#1e293b');
  const avatarBg    = useColorModeValue('gray.100', '#1e293b');

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box maxW="1000px" mx="auto" px={{ base: 4, md: 8 }} py={10}>

        {/* Header */}
        <Box mb={8}>
          <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700"
            textTransform="uppercase" mb={2}>Live Events</Text>
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={headingColor} mb={1}>
            Mention Afridict
          </Text>
          <Text fontSize="sm" color={mutedColor}>
            Predict the words African leaders, athletes, and influencers will say in upcoming events.
          </Text>
        </Box>

        {/* Market list */}
        <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
          {MENTION_MARKETS.map((m, i) => (
            <Box key={m.id}>
              {i > 0 && <Box h="1px" bg={dividerColor} />}
              <Box
                px={{ base: 4, md: 6 }} py={5}
                _hover={{ bg: hoverBg }} transition="background .15s"
                cursor="pointer"
                onClick={() => navigate(`/mentions/${m.id}`)}
              >
                <HStack spacing={{ base: 3, md: 5 }} align="start">

                  {/* Date column */}
                  <VStack spacing={0} minW="36px" align="center" pt={1}>
                    <Text fontSize="xl" fontWeight="900" color={dayColor} lineHeight="1">{m.day}</Text>
                    <Text fontSize="10px" fontWeight="600" color={mutedColor} textTransform="uppercase">{m.month}</Text>
                  </VStack>

                  {/* Avatar */}
                  <Box
                    w="48px" h="48px" borderRadius="lg" flexShrink={0}
                    display="flex" alignItems="center" justifyContent="center"
                    fontSize="1.8rem"
                    bg={avatarBg}
                    border="2px solid" borderColor={m.color + '44'}
                  >
                    {m.flag}
                  </Box>

                  {/* Content */}
                  <Box flex={1} minW={0}>
                    <HStack mb={1.5} spacing={2} flexWrap="wrap">
                      <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="700" color={headingColor} lineHeight="1.4">
                        {m.title}
                      </Text>
                    </HStack>

                    <HStack spacing={2} mb={2} flexWrap="wrap">
                      <Text fontSize="xs" color={mutedColor}>{m.time}</Text>
                      <Text fontSize="xs" color={mutedColor}>·</Text>
                      <Text fontSize="xs" color={mutedColor}>{m.volume}</Text>
                      {m.isNew && (
                        <Badge fontSize="9px" colorScheme="yellow" variant="subtle">✦ NEW</Badge>
                      )}
                    </HStack>

                    <HStack spacing={2} flexWrap="wrap">
                      {m.tags.map(tag => (
                        <Box key={tag} px={2.5} py={0.5} borderRadius="full"
                          bg={tagBg} border="1px solid" borderColor={borderColor}>
                          <Text fontSize="11px" color={tagColor} fontWeight="500">{tag}</Text>
                        </Box>
                      ))}
                      {m.extraCount > 0 && (
                        <Box px={2.5} py={0.5} borderRadius="full"
                          bg={tagBg} border="1px solid" borderColor={borderColor}>
                          <Text fontSize="11px" color="#ffd700" fontWeight="700">+{m.extraCount}</Text>
                        </Box>
                      )}
                    </HStack>
                  </Box>

                  {/* Trade button */}
                  <Button
                    size="sm" px={5} borderRadius="lg" fontWeight="700" flexShrink={0}
                    bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                    _hover={{ opacity: .9, transform: 'translateY(-1px)' }} transition="all .2s"
                    onClick={e => { e.stopPropagation(); navigate(`/mentions/${m.id}`); }}
                  >
                    Trade
                  </Button>
                </HStack>
              </Box>
            </Box>
          ))}
        </Box>

        <Text fontSize="xs" color={mutedColor} textAlign="center" mt={6}>
          More mention markets coming soon · <Text as="span" color="#ffd700" cursor="pointer">Request an event →</Text>
        </Text>
      </Box>
    </Box>
  );
}
