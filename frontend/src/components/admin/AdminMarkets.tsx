import React, { memo, useState, useMemo } from 'react';
import {
  Box, Button, HStack, Heading, Input, SimpleGrid, Text, Textarea, VStack, Badge,
} from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';

interface Market {
  id: number;
  title: string;
  category: string;
  pool: number;
  yes: number;
  status: string;
  created: string;
}

interface AdminMarketsProps {
  adminMarkets: Market[];
  setAdminMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  adminSearch: string;
  pendingMarkets: any[];
  removePendingMarket: (id: string) => void;
  addMarket: (m: any) => void;
}

const CATEGORIES = ['Sports','Elections','Music','Economy','Crypto','Politics','Commodities','Security','Tech','Weather'];

function AdminMarkets({ adminMarkets, setAdminMarkets, adminSearch, pendingMarkets, removePendingMarket, addMarket }: AdminMarketsProps) {
  const c = useAdminColors();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Sports', endDate: '', description: '' });
  const [resolveTarget, setResolveTarget] = useState<{ market: Market; side: 'YES' | 'NO' } | null>(null);

  const visible = useMemo(() =>
    adminMarkets.filter(m => !adminSearch || m.title.toLowerCase().includes(adminSearch.toLowerCase())),
  [adminMarkets, adminSearch]);

  const handleApprove = (m: any) => {
    const newId = Math.max(...adminMarkets.map(x => x.id), 0) + 1;
    const today = new Date().toISOString().slice(0, 10);
    // Add to admin table
    setAdminMarkets(prev => [...prev, {
      id: newId, title: m.title, category: m.category,
      pool: 0, yes: 50, status: 'active', created: today,
    }]);
    // Add to live public markets (AppContext)
    addMarket({
      id: newId, title: m.title, category: m.category, country: m.country || '',
      yesOdds: 2.00, noOdds: 2.00, pool: 0,
    });
    removePendingMarket(m.id);
  };

  const handleCreate = () => {
    if (!form.title) return;
    const newId = Math.max(...adminMarkets.map(x => x.id)) + 1;
    setAdminMarkets(prev => [...prev, {
      id: newId, title: form.title, category: form.category,
      pool: 0, yes: 50, status: 'active', created: new Date().toISOString().slice(0, 10),
    }]);
    setForm({ title: '', category: 'Sports', endDate: '', description: '' });
    setCreateOpen(false);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Box>
          <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor}>Markets</Heading>
          <Text fontSize="sm" color={c.adminSubtextColor} mt={1}>{adminMarkets.length} total markets</Text>
        </Box>
        <Button size="sm" bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900" fontWeight="700"
          borderRadius="lg" px={5} _hover={{ opacity: 0.9 }} onClick={() => setCreateOpen(true)}
        >+ Create Market</Button>
      </HStack>

      {/* ── Pending Review ── */}
      {pendingMarkets.length > 0 && (
        <Box mb={8} border="1px solid" borderColor="rgba(255,215,0,.35)" borderRadius="2xl" overflow="hidden"
          bg="rgba(255,215,0,.04)"
        >
          <HStack px={6} py={3} bg="rgba(255,215,0,.08)" borderBottom="1px solid" borderColor="rgba(255,215,0,.2)">
            <Text fontSize="sm" fontWeight="800" color="#ffd700">Pending Review</Text>
            <Badge bg="#ffd700" color="gray.900" fontSize="10px" fontWeight="800" borderRadius="full" px={2}>
              {pendingMarkets.length}
            </Badge>
          </HStack>

          {pendingMarkets.map(m => {
            const formattedEnd = m.endDate
              ? new Date(m.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'No end date';
            return (
              <Box key={m.id} px={6} py={5} borderBottom="1px solid" borderColor="rgba(255,215,0,.12)"
                _last={{ borderBottom: 'none' }}
              >
                {/* Top row: meta */}
                <HStack mb={3} spacing={2} flexWrap="wrap">
                  <Badge fontSize="9px" colorScheme="yellow" borderRadius="full" px={2}>{m.category}</Badge>
                  {m.country && (
                    <Badge fontSize="9px" colorScheme="purple" borderRadius="full" px={2}>{m.country}</Badge>
                  )}
                  <Text fontSize="10px" color={c.adminMutedColor}>Submitted {m.submittedAt}</Text>
                </HStack>

                {/* Title */}
                <Text fontSize="sm" fontWeight="800" color={c.adminHeadingColor} lineHeight="1.5" mb={4}>
                  {m.title}
                </Text>

                {/* Details grid */}
                <SimpleGrid columns={3} spacing={3} mb={4}>
                  {/* Odds preview */}
                  <Box p={3} borderRadius="lg" bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}>
                    <Text fontSize="9px" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase" letterSpacing="wider" mb={2}>Starting Odds</Text>
                    <HStack spacing={2}>
                      <Box flex={1} py={1.5} borderRadius="md" textAlign="center" bg="rgba(74,222,128,.12)" border="1px solid rgba(74,222,128,.25)">
                        <Text fontSize="9px" fontWeight="700" color="#4ade80">YES</Text>
                        <Text fontSize="sm" fontWeight="900" color="#4ade80">2.00</Text>
                      </Box>
                      <Box flex={1} py={1.5} borderRadius="md" textAlign="center" bg="rgba(248,113,113,.12)" border="1px solid rgba(248,113,113,.25)">
                        <Text fontSize="9px" fontWeight="700" color="#f87171">NO</Text>
                        <Text fontSize="sm" fontWeight="900" color="#f87171">2.00</Text>
                      </Box>
                    </HStack>
                  </Box>

                  {/* End date */}
                  <Box p={3} borderRadius="lg" bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}>
                    <Text fontSize="9px" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase" letterSpacing="wider" mb={1.5}>Resolves</Text>
                    <Text fontSize="sm" fontWeight="700" color={c.adminHeadingColor}>{formattedEnd}</Text>
                  </Box>

                  {/* Source */}
                  <Box p={3} borderRadius="lg" bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}>
                    <Text fontSize="9px" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase" letterSpacing="wider" mb={1.5}>Source</Text>
                    <Text fontSize="xs" fontWeight="600" color={c.adminHeadingColor} noOfLines={2}>{m.source || '—'}</Text>
                  </Box>
                </SimpleGrid>

                {/* Criteria */}
                {m.criteria && (
                  <Box mb={4} p={3} borderRadius="lg" bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}>
                    <Text fontSize="9px" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase" letterSpacing="wider" mb={1.5}>Resolution Criteria</Text>
                    <Text fontSize="xs" color={c.adminHeadingColor} lineHeight="1.6">{m.criteria}</Text>
                  </Box>
                )}

                {/* Actions */}
                <HStack spacing={3}>
                  <Button flex={1} size="sm" bg="#4ade80" color="gray.900" fontWeight="800" borderRadius="lg"
                    _hover={{ bg: '#22c55e' }} onClick={() => handleApprove(m)}
                  >✓ Approve & Publish</Button>
                  <Button flex={1} size="sm" variant="outline" borderColor="#f87171" color="#f87171" fontWeight="800"
                    borderRadius="lg" _hover={{ bg: 'rgba(248,113,113,.1)' }} onClick={() => removePendingMarket(m.id)}
                  >✕ Reject</Button>
                </HStack>
              </Box>
            );
          })}
        </Box>
      )}

      <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl" overflow="hidden">
        {/* Table header */}
        <HStack px={6} py={3} bg={c.adminSidebarBg} borderBottom="1px solid" borderColor={c.adminBorderColor}>
          {[
            { label: 'Market',   flex: 3 },
            { label: 'Category', w: '90px' },
            { label: 'Pool',     w: '90px' },
            { label: 'YES%',     w: '60px' },
            { label: 'Status',   w: '80px' },
            { label: 'Actions',  w: '160px' },
          ].map(col => (
            <Text key={col.label} fontSize="xs" color={c.adminMutedColor} fontWeight="700"
              flex={col.flex} w={col.w} textTransform="uppercase" letterSpacing="wider"
            >{col.label}</Text>
          ))}
        </HStack>

        {visible.map(m => (
          <HStack key={m.id} px={6} py={4} borderBottom="1px solid" borderColor={c.adminRowBorder}
            _hover={{ bg: c.adminHoverBg }} align="center"
          >
            <Box flex={3} minW={0} pr={4}>
              <Text fontSize="xs" fontWeight="600" color={c.adminHeadingColor} noOfLines={2} lineHeight="1.4">{m.title}</Text>
              <Text fontSize="10px" color={c.adminMutedColor} mt={0.5}>{m.created}</Text>
            </Box>
            <Box w="90px"><Badge fontSize="9px" colorScheme="blue">{m.category}</Badge></Box>
            <Text fontSize="sm" color="#4ade80" fontWeight="700" w="90px">${m.pool.toLocaleString()}</Text>
            <Box w="60px">
              <Box h="4px" bg={c.adminBarTrackBg} borderRadius="full" mb={1}>
                <Box h="full" w={`${m.yes}%`} bg="#4ade80" borderRadius="full" />
              </Box>
              <Text fontSize="10px" color={c.adminSubtextColor}>{m.yes}%</Text>
            </Box>
            <Box w="80px">
              <Badge fontSize="9px" colorScheme={m.status === 'active' ? 'green' : m.status === 'resolved' ? 'gray' : 'yellow'}>{m.status}</Badge>
            </Box>
            <HStack w="160px" spacing={1}>
              <Button size="xs" colorScheme="green" borderRadius="md" fontSize="10px" px={2}
                isDisabled={m.status === 'resolved'}
                onClick={() => setResolveTarget({ market: m, side: 'YES' })}
              >YES</Button>
              <Button size="xs" colorScheme="red" borderRadius="md" fontSize="10px" px={2}
                isDisabled={m.status === 'resolved'}
                onClick={() => setResolveTarget({ market: m, side: 'NO' })}
              >NO</Button>
              <Button size="xs" variant="ghost" color="#f87171" borderRadius="md" fontSize="10px" px={2}
                onClick={() => setAdminMarkets(prev => prev.filter(x => x.id !== m.id))}
              >✕</Button>
            </HStack>
          </HStack>
        ))}
      </Box>

      {/* ── Resolve Confirmation Modal ── */}
      {resolveTarget && (
        <Box position="fixed" inset={0} bg="blackAlpha.800" zIndex={9999}
          display="flex" alignItems="center" justifyContent="center" px={4}
          onClick={() => setResolveTarget(null)}>
          <Box bg={c.adminCardBg} border="1px solid" borderColor={resolveTarget.side === 'YES' ? 'rgba(74,222,128,.4)' : 'rgba(248,113,113,.4)'}
            borderRadius="2xl" p={7} w="440px" onClick={e => e.stopPropagation()}
            boxShadow="0 32px 80px rgba(0,0,0,0.7)">

            {/* Icon */}
            <Box w={14} h={14} borderRadius="xl" mx="auto" mb={4}
              bg={resolveTarget.side === 'YES' ? 'rgba(74,222,128,.12)' : 'rgba(248,113,113,.12)'}
              border="1px solid" borderColor={resolveTarget.side === 'YES' ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)'}
              display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="26px">{resolveTarget.side === 'YES' ? '✅' : '❌'}</Text>
            </Box>

            <Text fontSize="lg" fontWeight="800" color={c.adminHeadingColor} textAlign="center" mb={1}>
              Resolve Market as {resolveTarget.side}?
            </Text>
            <Text fontSize="xs" color={c.adminMutedColor} textAlign="center" lineHeight="1.7" mb={5}>
              This action is permanent. The market will be marked as resolved and all traders will be settled accordingly.
            </Text>

            {/* Market title */}
            <Box bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder} borderRadius="xl" px={4} py={3} mb={6}>
              <Text fontSize="xs" fontWeight="700" color={c.adminMutedColor} textTransform="uppercase" letterSpacing="wider" mb={1}>Market</Text>
              <Text fontSize="sm" fontWeight="700" color={c.adminHeadingColor} lineHeight="1.5">
                {resolveTarget.market.title}
              </Text>
            </Box>

            {/* Outcome badge */}
            <HStack justify="space-between" mb={6} px={1}>
              <Text fontSize="xs" color={c.adminMutedColor}>Outcome</Text>
              <Box px={4} py={1} borderRadius="full" fontWeight="800" fontSize="sm"
                bg={resolveTarget.side === 'YES' ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.15)'}
                color={resolveTarget.side === 'YES' ? '#4ade80' : '#f87171'}
                border="1px solid" borderColor={resolveTarget.side === 'YES' ? 'rgba(74,222,128,.3)' : 'rgba(248,113,113,.3)'}>
                {resolveTarget.side}
              </Box>
            </HStack>

            <HStack spacing={3}>
              <Button flex={1} variant="outline" borderColor={c.adminInputBorder} color={c.adminSecondaryColor}
                borderRadius="xl" onClick={() => setResolveTarget(null)}>
                Cancel
              </Button>
              <Button flex={2} borderRadius="xl" fontWeight="800"
                bg={resolveTarget.side === 'YES' ? '#4ade80' : '#f87171'}
                color="gray.900"
                _hover={{ opacity: 0.9 }}
                onClick={() => {
                  setAdminMarkets(prev => prev.map(x =>
                    x.id === resolveTarget.market.id
                      ? { ...x, status: 'resolved', yes: resolveTarget.side === 'YES' ? 100 : 0 }
                      : x
                  ));
                  setResolveTarget(null);
                }}>
                Confirm — Resolve {resolveTarget.side}
              </Button>
            </HStack>
          </Box>
        </Box>
      )}

      {/* Create Market Modal */}
      {createOpen && (
        <Box position="fixed" inset={0} bg="blackAlpha.800" zIndex={9999}
          display="flex" alignItems="center" justifyContent="center"
          onClick={() => setCreateOpen(false)}
        >
          <Box bg={c.adminCardBg} border="1px solid" borderColor={c.adminBorderColor} borderRadius="2xl"
            p={8} w="480px" onClick={e => e.stopPropagation()} boxShadow="0 32px 80px rgba(0,0,0,0.7)"
          >
            <Text fontSize="lg" fontWeight="800" color={c.adminHeadingColor} mb={6}>Create New Market</Text>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={1.5} textTransform="uppercase" letterSpacing="wider">Market Title</Text>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Will ... happen?" bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}
                  color={c.adminHeadingColor} borderRadius="xl"
                  _placeholder={{ color: c.adminMutedColor }} _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                />
              </Box>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={1.5} textTransform="uppercase" letterSpacing="wider">Category</Text>
                  <Box as="select" value={form.category}
                    onChange={(e: any) => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #374151', borderRadius: '12px', color: '#94a3b8', fontSize: '14px', outline: 'none' }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} style={{ background: '#1e293b' }}>{cat}</option>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={1.5} textTransform="uppercase" letterSpacing="wider">End Date</Text>
                  <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}
                    color={c.adminHeadingColor} borderRadius="xl"
                    _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                  />
                </Box>
              </SimpleGrid>
              <Box>
                <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="600" mb={1.5} textTransform="uppercase" letterSpacing="wider">Description</Text>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Market resolution criteria..." bg={c.adminInputBg} border="1px solid" borderColor={c.adminInputBorder}
                  color={c.adminHeadingColor} borderRadius="xl" rows={3}
                  _placeholder={{ color: c.adminMutedColor }} _focus={{ borderColor: '#ffd700', boxShadow: 'none' }}
                />
              </Box>
              <HStack spacing={3} pt={2}>
                <Button flex={1} variant="outline" borderColor={c.adminInputBorder} color={c.adminSecondaryColor} borderRadius="xl" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button flex={1} bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900" fontWeight="700" borderRadius="xl" onClick={handleCreate}>
                  Create Market
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default memo(AdminMarkets);
