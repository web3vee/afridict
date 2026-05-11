import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function TradeHistory() {
  return (
    <Box py={16} textAlign="center">
      <Text fontSize="3xl" mb={3}>🕐</Text>
      <Text fontSize="sm" color="gray.400">No activity yet.</Text>
    </Box>
  );
}
