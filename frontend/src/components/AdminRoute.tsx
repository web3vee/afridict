import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Box, Text, VStack } from '@chakra-ui/react';
import { useApp } from '../context/AppContext';
import { isAdmin } from '../data/admins';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, authLoading, userEmail, displayAddress } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="#ffd700" thickness="3px" speed="0.7s" />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const email  = userEmail ?? null;
  const wallet = displayAddress ?? null;

  if (!isAdmin(email, wallet)) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#070b14">
        <VStack spacing={3}>
          <Text fontSize="3xl">🔒</Text>
          <Text fontSize="lg" fontWeight="800" color="white">Admin access only</Text>
          <Text fontSize="sm" color="gray.400">Your account is not authorised to view this page.</Text>
        </VStack>
      </Box>
    );
  }

  return children;
}
