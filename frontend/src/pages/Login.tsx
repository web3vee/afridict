import React, { useState } from 'react';
import {
  Box, VStack, Button, Input, Text, FormControl, FormLabel, Heading, Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '../firebase';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found':      'No account found with this email.',
  'auth/wrong-password':      'Incorrect password.',
  'auth/invalid-credential':  'Invalid email or password.',
  'auth/invalid-email':       'Please enter a valid email address.',
  'auth/too-many-requests':   'Too many attempts. Try again later.',
  'auth/user-disabled':       'This account has been suspended.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading]       = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  const cardBg    = useColorModeValue('#ffffff', '#111827');
  const border    = useColorModeValue('gray.200', '#1e293b');
  const headingC  = useColorModeValue('#0f172a',  '#f8fafc');
  const mutedC    = useColorModeValue('#64748b',  '#94a3b8');
  const inputBg   = useColorModeValue('gray.50',  '#1e293b');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(FIREBASE_ERRORS[err?.code] || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(FIREBASE_ERRORS[err?.code] || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box maxW="420px" mx="auto" px={4} py={16}>
      <VStack spacing={6}>
        <VStack spacing={1} textAlign="center">
          <Text fontSize="2xl">🌍</Text>
          <Heading size="lg" color={headingC}>Welcome Back</Heading>
          <Text fontSize="sm" color={mutedC}>Sign in to your AfriDict account</Text>
        </VStack>

        <Box w="full" bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={border}
          boxShadow="0 4px 24px rgba(0,0,0,.08)">
          <VStack spacing={4}>
            {/* Google */}
            <Button w="full" variant="outline" borderColor={border} borderRadius="xl"
              leftIcon={<Text as="span" fontSize="sm" fontWeight="800">G</Text>} fontWeight="600" fontSize="sm"
              isLoading={isGoogleLoading} onClick={handleGoogle}
              _hover={{ borderColor: '#ffd700' }} transition="all .2s">
              Continue with Google
            </Button>

            <Box w="full" display="flex" alignItems="center" gap={3}>
              <Box flex={1} h="1px" bg={border} />
              <Text fontSize="xs" color={mutedC}>or</Text>
              <Box flex={1} h="1px" bg={border} />
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">
                    Email
                  </FormLabel>
                  <Input value={email} onChange={e => setEmail(e.target.value)}
                    type="email" placeholder="you@example.com"
                    bg={inputBg} borderRadius="xl" border="1px solid" borderColor={border}
                    _focus={{ borderColor: '#ffd700', boxShadow: 'none' }} />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">
                    Password
                  </FormLabel>
                  <Input value={password} onChange={e => setPassword(e.target.value)}
                    type="password" placeholder="••••••••"
                    bg={inputBg} borderRadius="xl" border="1px solid" borderColor={border}
                    _focus={{ borderColor: '#ffd700', boxShadow: 'none' }} />
                </FormControl>

                {error && (
                  <Box w="full" bg="rgba(248,113,113,.1)" border="1px solid rgba(248,113,113,.3)"
                    borderRadius="xl" px={4} py={3}>
                    <Text fontSize="sm" color="#f87171">{error}</Text>
                  </Box>
                )}

                <Button type="submit" w="full" borderRadius="xl" fontWeight="700" size="lg"
                  bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
                  isLoading={isLoading} _hover={{ opacity: 0.9 }} transition="all .2s">
                  Sign In
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>

        <Text fontSize="sm" color={mutedC}>
          No account?{' '}
          <Link as={RouterLink} to="/register" color="#ffd700" fontWeight="700">Create one →</Link>
        </Text>
      </VStack>
    </Box>
  );
}
