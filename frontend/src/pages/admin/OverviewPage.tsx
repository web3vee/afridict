import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import AdminOverview from '../../components/admin/AdminOverview';
import type { AdminOutletContext } from '../../layouts/AdminLayout';

export default function OverviewPage() {
  const { adminMarkets, pendingMarkets } = useOutletContext<AdminOutletContext>();
  const navigate = useNavigate();
  return (
    <>
      {pendingMarkets.length > 0 && (
        <Box mb={6} p={4} borderRadius="xl"
          bg="rgba(255,215,0,.08)" border="1px solid rgba(255,215,0,.35)"
          display="flex" alignItems="center" justifyContent="space-between" gap={4}
        >
          <HStack spacing={3}>
            <Text fontSize="lg">🕐</Text>
            <Box>
              <Text fontSize="sm" fontWeight="800" color="#ffd700">
                {pendingMarkets.length} market{pendingMarkets.length > 1 ? 's' : ''} waiting for review
              </Text>
              <Text fontSize="xs" color="gray.400" mt={0.5}>
                Submitted by users — approve or reject from the Markets page
              </Text>
            </Box>
          </HStack>
          <Button size="sm" bg="#ffd700" color="gray.900" fontWeight="800" borderRadius="lg"
            _hover={{ bg: '#f5c800' }} flexShrink={0}
            onClick={() => navigate('/admin/markets')}
          >
            Review Now →
          </Button>
        </Box>
      )}
      <AdminOverview
        adminMarkets={adminMarkets}
        onViewTransactions={() => navigate('/admin/transactions')}
        onViewMarkets={() => navigate('/admin/markets')}
      />
    </>
  );
}
