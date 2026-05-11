import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Box } from '@chakra-ui/react';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="#ffd700" thickness="3px" speed="0.7s" />
      </Box>
    );
  }

  return isLoggedIn
    ? children
    : <Navigate to="/" state={{ from: location }} replace />;
}
