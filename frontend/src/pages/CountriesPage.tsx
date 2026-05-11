import React, { useState } from 'react';
import {
  Box, Heading, HStack, Input, SimpleGrid, Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MARKETS } from '../data/staticData';

const AFRICAN_COUNTRIES = [
  { name: 'Nigeria',      color: '#008751', dir: 'v' as const, stripes: ['#008751','#FFFFFF','#008751'],           keywords: ['nigeria','nigerian','naira','lagos','abuja','maiduguri','dangote','delta state','tinubu','davido','peter obi','fuel subsidy'] },
  { name: 'South Africa', color: '#007A4D', dir: 'h' as const, stripes: ['#D21034','#FFFFFF','#007A4D','#000000','#002395'], keywords: ['south africa','south african','anc','rand','johannesburg','ramaphosa','load-shedding','tyla'] },
  { name: 'Kenya',        color: '#BB0000', dir: 'h' as const, stripes: ['#000000','#BB0000','#006600'],           keywords: ['kenya','kenyan','kes','nairobi','shilling','ruto','somalia'] },
  { name: 'Ghana',        color: '#D4A017', dir: 'h' as const, stripes: ['#CE1126','#FCD116','#006B3F'],           keywords: ['ghana','ghanaian','cedi','accra','mahama','waec'] },
  { name: 'Senegal',      color: '#00853F', dir: 'v' as const, stripes: ['#00853F','#FDEF42','#E31B23'],           keywords: ['senegal','senegalese','dakar','sonko','ousmane'] },
  { name: 'Egypt',        color: '#CE1126', dir: 'h' as const, stripes: ['#CE1126','#FFFFFF','#000000'],           keywords: ['egypt','egyptian','cairo','sisi','nile'] },
  { name: 'Ethiopia',     color: '#078930', dir: 'h' as const, stripes: ['#078930','#FCDD09','#DA121A'],           keywords: ['ethiopia','ethiopian','addis','tigray','abiy','amhara','oromo','nile dam'] },
  { name: 'Morocco',      color: '#C1272D', dir: 'h' as const, stripes: ['#C1272D','#C1272D','#C1272D'],           keywords: ['morocco','moroccan','rabat','casablanca','atlas lions','marrakech'] },
  { name: 'DRC',          color: '#007FFF', dir: 'h' as const, stripes: ['#007FFF','#CE1021','#F7D518'],           keywords: ['congo','drc','kinshasa','lingala','m23','tshisekedi','cobalt','eastern congo','coltan'] },
  { name: 'Tanzania',     color: '#1EB53A', dir: 'h' as const, stripes: ['#1EB53A','#FCD116','#000000','#00A3DD'], keywords: ['tanzania','tanzanian','dar es salaam','samia','suluhu'] },
  { name: 'Uganda',       color: '#B8860B', dir: 'h' as const, stripes: ['#000000','#FCDC04','#CE1126'],           keywords: ['uganda','ugandan','kampala','museveni','bobi wine','kingfisher','tilenga'] },
  { name: 'Ivory Coast',  color: '#F77F00', dir: 'v' as const, stripes: ['#F77F00','#FFFFFF','#009A44'],           keywords: ['ivory coast',"côte d'ivoire",'abidjan','ouattara'] },
  { name: 'Cameroon',     color: '#007A5E', dir: 'v' as const, stripes: ['#007A5E','#CE1126','#FCD116'],           keywords: ['cameroon','cameroonian','yaounde',"eto'o",'anglophone','samuel eto'] },
  { name: 'Zimbabwe',     color: '#228B22', dir: 'h' as const, stripes: ['#006400','#FFD200','#D21034','#000000'], keywords: ['zimbabwe','zimbabwean','harare','mnangagwa'] },
  { name: 'Zambia',       color: '#EF7D00', dir: 'v' as const, stripes: ['#198A00','#CE1126','#000000','#EF7D00'], keywords: ['zambia','zambian','lusaka','hichilema','copper'] },
  { name: 'Sudan',        color: '#D21034', dir: 'h' as const, stripes: ['#D21034','#FFFFFF','#000000'],           keywords: ['sudan','sudanese','khartoum','rsf','saf'] },
  { name: 'Burkina Faso', color: '#EF2B2D', dir: 'h' as const, stripes: ['#EF2B2D','#009A00'],                    keywords: ['burkina faso','burkinabe','ouagadougou','traor','ibrahim traoré'] },
  { name: 'Malawi',       color: '#CE1126', dir: 'h' as const, stripes: ['#000000','#CE1126','#339E35'],           keywords: ['malawi','malawian','lilongwe','chakwera'] },
  { name: 'Algeria',      color: '#006233', dir: 'v' as const, stripes: ['#006233','#FFFFFF'],                    keywords: ['algeria','algerian','algiers','tebboune'] },
  { name: 'Tunisia',      color: '#E70013', dir: 'v' as const, stripes: ['#E70013','#FFFFFF','#E70013'],           keywords: ['tunisia','tunisian','tunis','kais saied','saied'] },
  { name: 'Rwanda',       color: '#20603D', dir: 'h' as const, stripes: ['#20603D','#FAD201','#00A1DE'],           keywords: ['rwanda','rwandan','kigali','kagame'] },
  { name: 'Angola',       color: '#CC0000', dir: 'h' as const, stripes: ['#CC0000','#000000'],                    keywords: ['angola','angolan','luanda','louren','kwanza'] },
  { name: 'Mozambique',   color: '#009A44', dir: 'h' as const, stripes: ['#009A44','#FFFFFF','#000000','#FCDD09'], keywords: ['mozambique','mozambican','maputo','cabo delgado','lng'] },
  { name: 'Comoros',      color: '#3A75C4', dir: 'h' as const, stripes: ['#3A75C4','#009A00','#FFFFFF','#D21034'], keywords: ['comoros','comorian','moroni'] },
];

function getCount(country: typeof AFRICAN_COUNTRIES[0]) {
  return MARKETS.filter(m =>
    country.keywords.some(kw => m.title.toLowerCase().includes(kw))
  ).length;
}

function getVolume(country: typeof AFRICAN_COUNTRIES[0]) {
  const total = MARKETS.filter(m =>
    country.keywords.some(kw => m.title.toLowerCase().includes(kw))
  ).reduce((sum, m) => sum + (m.pool || 0), 0);
  if (total >= 1000000) return `$${(total / 1000000).toFixed(1)}M`;
  if (total >= 1000)    return `$${(total / 1000).toFixed(1)}K`;
  return total > 0 ? `$${total}` : null;
}

function FlagBadge({ stripes, dir, color, size = 44 }: { stripes: string[]; dir: 'h' | 'v'; color: string; size?: number }) {
  return (
    <Box w={`${size}px`} h={`${size}px`} borderRadius="10px" overflow="hidden" flexShrink={0}
      display="flex" flexDirection={dir === 'h' ? 'column' : 'row'}
      style={{ boxShadow: `0 4px 14px ${color}55` }}>
      {stripes.map((s, i) => <Box key={i} flex={1} style={{ background: s }} />)}
    </Box>
  );
}

export default function CountriesPage() {
  const [query, setQuery] = useState('');
  const navigate          = useNavigate();

  const headingColor = useColorModeValue('#0f172a', '#f8fafc');
  const mutedColor   = useColorModeValue('#64748b', '#94a3b8');
  const cardBg       = useColorModeValue('#ffffff', '#111827');
  const borderColor  = useColorModeValue('#e2e8f0', '#1e293b');
  const searchBg     = useColorModeValue('gray.100', '#1f2937');

  const filtered = AFRICAN_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box maxW="1100px" mx="auto" px={6} py={8}>

      <Box mb={8}>
        <Text fontSize="xs" fontWeight="700" letterSpacing="widest" color="#ffd700"
          textTransform="uppercase" mb={1}>Browse by Location</Text>
        <Heading fontSize="2xl" fontWeight="800" color={headingColor}>
          African Countries
        </Heading>
        <Text fontSize="sm" color={mutedColor} mt={1}>
          {AFRICAN_COUNTRIES.length} countries · prediction markets across Africa
        </Text>
      </Box>

      <HStack mb={6} bg={searchBg} borderRadius="full" px={4} py={2}
        border="1px solid" borderColor={borderColor} maxW="360px">
        <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
        <Input variant="unstyled" placeholder="Search country..." fontSize="sm"
          color={headingColor} _placeholder={{ color: mutedColor }}
          value={query} onChange={e => setQuery(e.target.value)} />
      </HStack>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={3}>
        {filtered.map(c => {
          const count  = getCount(c);
          const volume = getVolume(c);
          return (
            <Box key={c.name} position="relative" overflow="hidden"
              bg={cardBg} border="1px solid" borderColor={borderColor}
              borderRadius="xl" p={4} cursor="pointer" textAlign="center"
              _hover={{ borderColor: c.color, transform: 'translateY(-2px)', boxShadow: `0 4px 20px ${c.color}22` }}
              transition="all .18s"
              onClick={() => navigate(`/countries/${encodeURIComponent(c.name)}`)}>

              <Box position="absolute" top={0} left={0} right={0} h="3px"
                style={{ background: c.color }} />

              <Box display="flex" justifyContent="center" mb={2} mt={1}>
                <FlagBadge stripes={c.stripes} dir={c.dir} color={c.color} size={44} />
              </Box>

              <Text fontSize="xs" fontWeight="700" color={headingColor} lineHeight="1.2">
                {c.name}
              </Text>
              {count > 0 ? (
                <>
                  <Text fontSize="10px" fontWeight="700" mt={0.5} style={{ color: c.color }}>
                    {count} market{count !== 1 ? 's' : ''}
                  </Text>
                  {volume && (
                    <Text fontSize="9px" color={mutedColor} mt={0.5} fontWeight="600">
                      {volume} vol.
                    </Text>
                  )}
                </>
              ) : (
                <Text fontSize="10px" color={mutedColor} mt={0.5}>no markets yet</Text>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
