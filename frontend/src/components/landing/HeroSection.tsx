import React, { useState, useEffect, useRef } from 'react';
import {
  Box, SimpleGrid, Heading, Text, Button, HStack,
  Badge, useColorModeValue,
} from '@chakra-ui/react';
import { HERO_MARKETS } from '../../data/staticData';
import { Lock, Link2, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  mutedColor: string;
  textColor: string;
  cardBg: string;
  borderColor: string;
  subtleBorder: string;
  headingColor: string;
  onLogin: () => void;
  onBetHeroYes: () => void;
  onBetHeroNo: () => void;
}

const STATS = [
  { val: "$2.4M", label: "Volume"    },
  { val: "50",    label: "Markets"   },
  { val: "24",    label: "Countries" },
  { val: "4.2K",  label: "Users"     },
];

export default function HeroSection({
  mutedColor, textColor, cardBg, borderColor, subtleBorder, headingColor,
  onLogin, onBetHeroYes, onBetHeroNo,
}: HeroSectionProps) {
  const [heroMarketIndex, setHeroMarketIndex] = useState(0);
  const [heroVisible, setHeroVisible]         = useState(true);
  const [heroDir, setHeroDir]                 = useState<'left' | 'right'>('right');
  const heroIndexRef = useRef(heroMarketIndex);
  heroIndexRef.current = heroMarketIndex;

  const goToHero = (i: number) => {
    setHeroVisible(false);
    setHeroDir('left');
    setTimeout(() => {
      setHeroMarketIndex(i);
      setHeroDir('right');
      setHeroVisible(true);
    }, 400);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToHero((heroIndexRef.current + 1) % HERO_MARKETS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const current = HERO_MARKETS[heroMarketIndex];

  return (
    <Box
      position="relative" overflow="hidden"
      bg={useColorModeValue('white', '#07090f')}
      borderBottom="1px solid" borderColor={useColorModeValue('gray.200', '#1a2035')}
    >
      <Box maxW="1200px" mx="auto" px={{ base: 6, lg: 12 }} py={{ base: 16, lg: 24 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={16} alignItems="center">

          {/* ── Left copy ── */}
          <Box>
            <Box className="lp-r1" display="inline-flex" alignItems="center" gap={2}
              bg={useColorModeValue('green.50', 'rgba(74,222,128,.08)')}
              border="1px solid" borderColor={useColorModeValue('green.200', 'rgba(74,222,128,.2)')}
              borderRadius="full" px={4} py={1.5} mb={6}
            >
              <span className="lp-live" />
              <Text fontSize="xs" fontWeight="700" color={useColorModeValue('green.700', '#4ade80')} ml={1}>
                50 Markets Live · Polygon Network
              </Text>
            </Box>

            <Heading className="lp-r2"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} fontWeight="900"
              lineHeight="1.08" letterSpacing="-2px" mb={5}
              display="flex" alignItems="center" flexWrap="wrap" gap={2}
            >
              <img src="/map.png" alt="Africa map" style={{ height: '1em', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
              <Text as="span" style={{ background: 'linear-gradient(135deg,#ffd700,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>African</Text>
              <Text as="span" style={{ background: 'linear-gradient(135deg,#ffd700,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Polymarket</Text>
            </Heading>

            <Text className="lp-r3" fontSize={{ base: 'md', md: 'lg' }} color={mutedColor} lineHeight="1.8" mb={8} maxW="480px">
              Bet YES or NO on African elections, sports, and economics.
              Settle in USDT. Non-custodial, on-chain, transparent.
            </Text>

            <HStack className="lp-r4" spacing={3} mb={10} flexWrap="wrap">
              <Button size="lg" px={8} fontWeight="700" borderRadius="full"
                bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
                onClick={onLogin}
              >Start Predicting →</Button>
              <Button size="lg" px={8} fontWeight="600" borderRadius="full" variant="outline"
                borderColor={useColorModeValue('gray.300', '#2d3748')} color={textColor}
                _hover={{ bg: useColorModeValue('gray.50', 'rgba(255,255,255,.05)'), transform: 'translateY(-2px)' }}
                transition="all .2s"
                onClick={() => document.getElementById('all-markets')?.scrollIntoView({ behavior: 'smooth' })}
              >Browse Markets</Button>
            </HStack>

            <HStack spacing={6} flexWrap="wrap">
              {[
                { Icon: Lock,        label: 'Non-custodial'   },
                { Icon: Link2,       label: 'On Polygon'      },
                { Icon: ShieldCheck, label: 'Audited'         },
                { Icon: Zap,         label: 'Instant payouts' },
              ].map(({ Icon, label }) => (
                <HStack key={label} spacing={1.5}>
                  <Icon size={13} strokeWidth={2.2} color={mutedColor} />
                  <Text fontSize="xs" color={mutedColor} fontWeight="600">{label}</Text>
                </HStack>
              ))}
            </HStack>
          </Box>

          {/* ── Right card ── */}
          <Box display={{ base: 'none', lg: 'block' }} overflow="hidden">
            <Box
              bg={cardBg} border="1px solid" borderColor={borderColor}
              borderRadius="2xl" overflow="hidden" boxShadow="0 24px 80px rgba(0,0,0,.4)"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateX(0)' : heroDir === 'left' ? 'translateX(-80px)' : 'translateX(80px)',
                transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
              _hover={{ boxShadow: '0 32px 100px rgba(0,0,0,.55)', transform: 'translateY(-3px)', transition: 'box-shadow 0.3s ease, transform 0.3s ease' }}
            >
              {/* Card header */}
              <Box px={5} py={4} borderBottom="1px solid" borderColor={subtleBorder}>
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <span className="lp-live" />
                    <Text fontSize="xs" fontWeight="700" color={mutedColor} style={{ animation: 'fadeIn 0.4s ease' }}>LIVE MARKET</Text>
                  </HStack>
                  <Badge colorScheme="blue" fontSize="9px" style={{ animation: 'fadeIn 0.5s ease' }}>{current.category}</Badge>
                </HStack>
                <Text fontSize="sm" fontWeight="700" mt={2} color={useColorModeValue('gray.800', 'white')} lineHeight="1.4" style={{ animation: 'fadeIn 0.5s ease' }}>
                  {current.title}
                </Text>
              </Box>

              {/* Odds */}
              <Box px={5} py={4}>
                <HStack spacing={3} mb={4}>
                  <Box flex={1} bg={useColorModeValue('green.50', 'rgba(74,222,128,.08)')} border="2px solid" borderColor="#4ade80" borderRadius="xl" p={4} textAlign="center"
                    transition="all 0.2s ease" _hover={{ bg: useColorModeValue('green.100', 'rgba(74,222,128,.15)'), transform: 'scale(1.03)' }}
                    style={{ animation: 'fadeIn 0.5s ease' }}
                  >
                    <Text fontSize="xs" color="#4ade80" fontWeight="700" mb={1}>YES</Text>
                    <Text fontSize="2xl" fontWeight="900" color="#4ade80">{current.yesOdds}</Text>
                    <Text fontSize="10px" color={useColorModeValue('gray.400', '#64748b')}>{current.yesChance}% chance</Text>
                  </Box>
                  <Box flex={1} bg={useColorModeValue('red.50', 'rgba(248,113,113,.08)')} border="2px solid" borderColor="#f87171" borderRadius="xl" p={4} textAlign="center"
                    transition="all 0.2s ease" _hover={{ bg: useColorModeValue('red.100', 'rgba(248,113,113,.15)'), transform: 'scale(1.03)' }}
                    style={{ animation: 'fadeIn 0.5s ease' }}
                  >
                    <Text fontSize="xs" color="#f87171" fontWeight="700" mb={1}>NO</Text>
                    <Text fontSize="2xl" fontWeight="900" color="#f87171">{current.noOdds}</Text>
                    <Text fontSize="10px" color={useColorModeValue('gray.400', '#64748b')}>{current.noChance}% chance</Text>
                  </Box>
                </HStack>

                {/* Mini chart */}
                <Box h="60px" mb={4} style={{ animation: 'fadeIn 0.6s ease' }}>
                  <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="hFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={current.color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={current.color} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,40 C30,38 50,20 80,22 C110,24 130,35 160,28 C190,21 210,15 240,18 C270,21 285,28 300,25 L300,60 L0,60 Z" fill="url(#hFill)" />
                    <path d="M0,40 C30,38 50,20 80,22 C110,24 130,35 160,28 C190,21 210,15 240,18 C270,21 285,28 300,25" fill="none" stroke={current.color} strokeWidth="2" />
                  </svg>
                </Box>

                <HStack justify="space-between" mb={4} style={{ animation: 'fadeIn 0.6s ease' }}>
                  <Text fontSize="xs" color={useColorModeValue('gray.400', '#64748b')}>Pool: <Text as="span" fontWeight="700" color={textColor}>{current.pool} USDT</Text></Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.400', '#64748b')}>{current.predictors} predictors</Text>
                </HStack>

                <HStack spacing={2} style={{ animation: 'fadeIn 0.7s ease' }}>
                  <Button flex={1} colorScheme="green" size="sm" borderRadius="lg"
                    transition="all 0.2s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(74,222,128,.4)' }}
                    onClick={onBetHeroYes}
                  >Bet YES</Button>
                  <Button flex={1} colorScheme="red" size="sm" borderRadius="lg"
                    transition="all 0.2s ease" _hover={{ transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(248,113,113,.4)' }}
                    onClick={onBetHeroNo}
                  >Bet NO</Button>
                </HStack>

                {/* Dot nav */}
                <HStack justify="center" spacing={1.5} mt={4}>
                  {HERO_MARKETS.map((_, i) => (
                    <Box key={i}
                      w={i === heroMarketIndex ? 4 : 1.5} h={1.5} borderRadius="full"
                      bg={i === heroMarketIndex ? current.color : useColorModeValue('gray.300', '#374151')}
                      transition="all 0.3s ease" cursor="pointer"
                      _hover={{ transform: 'scale(1.4)' }}
                      onClick={() => goToHero(i)}
                    />
                  ))}
                </HStack>
              </Box>
            </Box>

            {/* Stats row */}
            <SimpleGrid columns={4} spacing={3} mt={4}>
              {STATS.map((s, i) => (
                <Box key={s.label}
                  bg={cardBg} border="1px solid" borderColor={borderColor}
                  borderRadius="xl" px={3} py={3} textAlign="center"
                  transition="all 0.2s ease"
                  _hover={{ borderColor: '#ffd700', transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,.2)' }}
                  style={{ animation: `fadeIn 0.4s ease ${i * 0.1}s both` }}
                >
                  <Text fontSize="lg" fontWeight="900" color={headingColor}>{s.val}</Text>
                  <Text fontSize="10px" color={useColorModeValue('gray.400', '#64748b')}>{s.label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
