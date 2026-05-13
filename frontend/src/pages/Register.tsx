import React, { useState } from 'react';
import {
  Box, VStack, Button, Input, Select, Text, FormControl,
  FormLabel, Heading, Link, HStack, useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '../firebase';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email':        'Please enter a valid email address.',
  'auth/weak-password':        'Password must be at least 6 characters.',
  'auth/too-many-requests':    'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [isLoading,  setIsLoading]  = useState(false);
  const [isGoogle,   setIsGoogle]   = useState(false);
  const [error,      setError]      = useState('');
  const [form, setForm] = useState({
    email: '', password: '', username: '', country: '',
    currency: 'USDT', language: 'en', referralCode: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const cardBg   = useColorModeValue('#ffffff', '#111827');
  const border   = useColorModeValue('gray.200', '#1e293b');
  const headingC = useColorModeValue('#0f172a',  '#f8fafc');
  const mutedC   = useColorModeValue('#64748b',  '#94a3b8');
  const inputBg  = useColorModeValue('gray.50',  '#1e293b');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email)                        e.email    = 'Email required';
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters';
    if (!form.username || form.username.length < 3) e.username = 'Min 3 characters';
    if (!form.country)                      e.country  = 'Country required';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setError('');
    setIsLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      setError(FIREBASE_ERRORS[err?.code] || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsGoogle(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(FIREBASE_ERRORS[err?.code] || 'Google sign-in failed.');
    } finally {
      setIsGoogle(false);
    }
  };

  const field = (key: string) => ({
    bg: inputBg, borderRadius: 'xl', border: '1px solid',
    borderColor: fieldErrors[key] ? '#f87171' : border,
    _focus: { borderColor: '#ffd700', boxShadow: 'none' },
  });

  return (
    <Box maxW="480px" mx="auto" px={4} py={12}>
      <VStack spacing={6}>
        <VStack spacing={1} textAlign="center">
          <Text fontSize="2xl">🌍</Text>
          <Heading size="lg" color={headingC}>Join AfriDict</Heading>
          <Text fontSize="sm" color={mutedC}>Africa's premier prediction market</Text>
        </VStack>

        <Box w="full" bg={cardBg} p={6} borderRadius="2xl" border="1px solid" borderColor={border}
          boxShadow="0 4px 24px rgba(0,0,0,.08)">
          <VStack spacing={4}>
            <Button w="full" variant="outline" borderColor={border} borderRadius="xl"
              leftIcon={<Text as="span" fontSize="sm" fontWeight="800">G</Text>} fontWeight="600" fontSize="sm"
              isLoading={isGoogle} onClick={handleGoogle}
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
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Email</FormLabel>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    type="email" placeholder="you@example.com" {...field('email')} />
                  {fieldErrors.email && <Text fontSize="xs" color="#f87171" mt={1}>{fieldErrors.email}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Username</FormLabel>
                  <Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                    placeholder="afripredictor" {...field('username')} />
                  {fieldErrors.username && <Text fontSize="xs" color="#f87171" mt={1}>{fieldErrors.username}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Password</FormLabel>
                  <Input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    type="password" placeholder="8+ characters" {...field('password')} />
                  {fieldErrors.password && <Text fontSize="xs" color="#f87171" mt={1}>{fieldErrors.password}</Text>}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Country</FormLabel>
                  <Select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder="Select your country" {...field('country')}>
                    {['Nigeria','Kenya','South Africa','Ghana','Ethiopia','Tanzania','Uganda','Senegal','Ivory Coast','Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                  {fieldErrors.country && <Text fontSize="xs" color="#f87171" mt={1}>{fieldErrors.country}</Text>}
                </FormControl>

                <HStack w="full" spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Currency</FormLabel>
                    <Select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} {...field('currency')}>
                      <option value="NGN">NGN (₦)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="ZAR">ZAR (R)</option>
                      <option value="GHS">GHS (₵)</option>
                      <option value="USDT">USDT</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Language</FormLabel>
                    <Select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} {...field('language')}>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="sw">Kiswahili</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="600" color={mutedC} textTransform="uppercase" letterSpacing="wider">Referral Code <Text as="span" fontWeight="400">(optional)</Text></FormLabel>
                  <Input value={form.referralCode} onChange={e => setForm({ ...form, referralCode: e.target.value })}
                    placeholder="Enter code if you have one" {...field('referralCode')} />
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
                  Create Account
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>

        <Text fontSize="sm" color={mutedC}>
          Already have an account?{' '}
          <Link as={RouterLink} to="/login" color="#ffd700" fontWeight="700">Sign in →</Link>
        </Text>
      </VStack>
    </Box>
  );
}
