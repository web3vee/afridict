import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Heading, HStack, SimpleGrid, Text, Button,
  VStack, useColorModeValue,
} from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { MARKETS } from '../data/staticData';
import { useApp } from '../context/AppContext';
import MarketCard from '../components/market/MarketCard';

const COUNTRY_META: Record<string, { stripes: string[]; dir: 'h' | 'v'; color: string; keywords: string[] }> = {
  'Nigeria':      { color: '#008751', dir: 'v', stripes: ['#008751','#FFFFFF','#008751'],           keywords: ['nigeria','nigerian','naira','lagos','abuja','maiduguri','dangote','delta state','tinubu','davido','peter obi','fuel subsidy'] },
  'South Africa': { color: '#007A4D', dir: 'h', stripes: ['#D21034','#FFFFFF','#007A4D','#000000','#002395'], keywords: ['south africa','south african','anc','rand','johannesburg','ramaphosa','load-shedding','tyla'] },
  'Kenya':        { color: '#BB0000', dir: 'h', stripes: ['#000000','#BB0000','#006600'],           keywords: ['kenya','kenyan','kes','nairobi','shilling','ruto','somalia'] },
  'Ghana':        { color: '#D4A017', dir: 'h', stripes: ['#CE1126','#FCD116','#006B3F'],           keywords: ['ghana','ghanaian','cedi','accra','mahama','waec'] },
  'Senegal':      { color: '#00853F', dir: 'v', stripes: ['#00853F','#FDEF42','#E31B23'],           keywords: ['senegal','senegalese','dakar','sonko','ousmane'] },
  'Egypt':        { color: '#CE1126', dir: 'h', stripes: ['#CE1126','#FFFFFF','#000000'],           keywords: ['egypt','egyptian','cairo','sisi','nile'] },
  'Ethiopia':     { color: '#078930', dir: 'h', stripes: ['#078930','#FCDD09','#DA121A'],           keywords: ['ethiopia','ethiopian','addis','tigray','abiy','amhara','oromo','nile dam'] },
  'Morocco':      { color: '#C1272D', dir: 'h', stripes: ['#C1272D','#C1272D','#C1272D'],           keywords: ['morocco','moroccan','rabat','casablanca','atlas lions','marrakech'] },
  'DRC':          { color: '#007FFF', dir: 'h', stripes: ['#007FFF','#CE1021','#F7D518'],           keywords: ['congo','drc','kinshasa','lingala','m23','tshisekedi','cobalt','eastern congo','coltan'] },
  'Tanzania':     { color: '#1EB53A', dir: 'h', stripes: ['#1EB53A','#FCD116','#000000','#00A3DD'], keywords: ['tanzania','tanzanian','dar es salaam','samia','suluhu'] },
  'Uganda':       { color: '#FCDC04', dir: 'h', stripes: ['#000000','#FCDC04','#CE1126'],           keywords: ['uganda','ugandan','kampala','museveni','bobi wine','kingfisher','tilenga'] },
  'Ivory Coast':  { color: '#F77F00', dir: 'v', stripes: ['#F77F00','#FFFFFF','#009A44'],           keywords: ['ivory coast',"côte d'ivoire",'abidjan','ouattara'] },
  'Cameroon':     { color: '#007A5E', dir: 'v', stripes: ['#007A5E','#CE1126','#FCD116'],           keywords: ['cameroon','cameroonian','yaounde',"eto'o",'anglophone','samuel eto'] },
  'Zimbabwe':     { color: '#228B22', dir: 'h', stripes: ['#006400','#FFD200','#D21034','#000000'], keywords: ['zimbabwe','zimbabwean','harare','mnangagwa'] },
  'Zambia':       { color: '#EF7D00', dir: 'v', stripes: ['#198A00','#CE1126','#000000','#EF7D00'], keywords: ['zambia','zambian','lusaka','hichilema','copper'] },
  'Sudan':        { color: '#D21034', dir: 'h', stripes: ['#D21034','#FFFFFF','#000000'],           keywords: ['sudan','sudanese','khartoum','rsf','saf'] },
  'Burkina Faso': { color: '#EF2B2D', dir: 'h', stripes: ['#EF2B2D','#009A00'],                    keywords: ['burkina faso','burkinabe','ouagadougou','traor','ibrahim traoré'] },
  'Malawi':       { color: '#CE1126', dir: 'h', stripes: ['#000000','#CE1126','#339E35'],           keywords: ['malawi','malawian','lilongwe','chakwera'] },
  'Algeria':      { color: '#006233', dir: 'v', stripes: ['#006233','#FFFFFF'],                    keywords: ['algeria','algerian','algiers','tebboune'] },
  'Tunisia':      { color: '#E70013', dir: 'v', stripes: ['#E70013','#FFFFFF','#E70013'],           keywords: ['tunisia','tunisian','tunis','kais saied','saied'] },
  'Rwanda':       { color: '#20603D', dir: 'h', stripes: ['#20603D','#FAD201','#00A1DE'],           keywords: ['rwanda','rwandan','kigali','kagame'] },
  'Angola':       { color: '#CC0000', dir: 'h', stripes: ['#CC0000','#000000'],                    keywords: ['angola','angolan','luanda','louren','kwanza'] },
  'Mozambique':   { color: '#009A44', dir: 'h', stripes: ['#009A44','#FFFFFF','#000000','#FCDD09'], keywords: ['mozambique','mozambican','maputo','cabo delgado','lng'] },
  'Comoros':      { color: '#3A75C4', dir: 'h', stripes: ['#3A75C4','#009A00','#FFFFFF','#D21034'], keywords: ['comoros','comorian','moroni'] },
};

function FlagBadge({ stripes, dir, color, size = 52 }: { stripes: string[]; dir: 'h' | 'v'; color: string; size?: number }) {
  return (
    <Box w={`${size}px`} h={`${size}px`} borderRadius="12px" overflow="hidden" flexShrink={0}
      display="flex" flexDirection={dir === 'h' ? 'column' : 'row'}
      style={{ boxShadow: `0 6px 20px ${color}55` }}>
      {stripes.map((s, i) => <Box key={i} flex={1} style={{ background: s }} />)}
    </Box>
  );
}

export default function CountryDetailPage() {
  const { name } = useParams<{ name: string }>();
  const navigate  = useNavigate();
  const countryName = decodeURIComponent(name || '');
  const meta     = COUNTRY_META[countryName];

  const { openMarketDetail, openBetYes, openBetNo, openEmbed } = useApp();

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b', '#94a3b8');
  const cardBg       = useColorModeValue('#ffffff', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');

  if (!meta) {
    return (
      <Box maxW="1100px" mx="auto" px={6} py={8}>
        <Button variant="ghost" leftIcon={<ArrowLeft size={15} />} onClick={() => navigate('/countries')} mb={6}>
          Back to Countries
        </Button>
        <Text color={mutedColor}>Country not found.</Text>
      </Box>
    );
  }

  const markets = MARKETS.filter(m =>
    meta.keywords.some(kw => m.title.toLowerCase().includes(kw))
  );

  const totalVolume = markets.reduce((s, m) => s + (m.pool || 0), 0);

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>

      {/* Back */}
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} strokeWidth={2.2} />}
        color={mutedColor} _hover={{ color: headingColor }} mb={6} px={0}
        onClick={() => navigate('/countries')}>
        All Countries
      </Button>

      {/* Hero header */}
      <Box mb={8} p={6} borderRadius="2xl" border="1px solid"
        borderColor={borderColor} bg={cardBg} position="relative" overflow="hidden">

        {/* Colour top bar */}
        <Box position="absolute" top={0} left={0} right={0} h="4px"
          style={{ background: meta.color }} />

        {/* Faint flag glow */}
        <Box position="absolute" top={0} right={0} w="200px" h="200px"
          style={{ background: `radial-gradient(circle at 100% 0%, ${meta.color}18 0%, transparent 70%)` }}
          pointerEvents="none" />

        <HStack spacing={5} align="center">
          <FlagBadge stripes={meta.stripes} dir={meta.dir} color={meta.color} size={64} />
          <Box flex={1}>
            <Heading fontSize="3xl" fontWeight="900" color={headingColor}>{countryName}</Heading>
            <HStack mt={2} spacing={4}>
              <Box px={3} py={1} borderRadius="full"
                style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}44` }}>
                <Text fontSize="12px" fontWeight="700" style={{ color: meta.color }}>
                  {markets.length} market{markets.length !== 1 ? 's' : ''}
                </Text>
              </Box>
              <Text fontSize="sm" color={mutedColor}>
                ${(totalVolume / 1000).toFixed(1)}K total volume
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Box>

      {/* Markets grid */}
      {markets.length === 0 ? (
        <Box bg={cardBg} border="1px solid" borderColor={borderColor}
          borderRadius="2xl" p={16}>
          <VStack spacing={3}>
            <FlagBadge stripes={meta.stripes} dir={meta.dir} color={meta.color} size={56} />
            <Text fontWeight="700" color={headingColor}>No markets yet for {countryName}</Text>
            <Text fontSize="sm" color={mutedColor} textAlign="center" maxW="300px">
              Markets for this country will appear here once they're created.
            </Text>
          </VStack>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {markets.map(m => (
            <MarketCard
              key={m.id}
              market={m}
              onClick={() => openMarketDetail(m)}
              onBetYes={() => openBetYes(m)}
              onBetNo={() => openBetNo(m)}
              onEmbed={() => openEmbed(m)}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
