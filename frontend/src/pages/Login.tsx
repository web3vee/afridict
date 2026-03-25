import React, { useState } from "react";
import {
  Box, VStack, Button, Input, Text, FormControl,
  FormLabel, Heading, Link, useToast,
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

export default function Login() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      toast({ title: err.response?.data?.error || "Login failed", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="400px" mx="auto" px={4} py={12}>
      <VStack spacing={6}>
        <Heading size="lg" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
          Welcome Back 🌍
        </Heading>

        <Box w="full" bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" placeholder="you@example.com" bg="surface.bg" borderColor="surface.border" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Password</FormLabel>
                <Input value={password} onChange={(e) => setPassword(e.target.value)}
                  type="password" placeholder="Your password" bg="surface.bg" borderColor="surface.border" />
              </FormControl>
              <Button type="submit" w="full" size="lg" isLoading={isLoading}>{t("auth.login")}</Button>
            </VStack>
          </form>
        </Box>

        <Text color="gray.400" fontSize="sm">
          No account?{" "}
          <Link as={RouterLink} to="/register" color="brand.500">{t("auth.register")}</Link>
        </Text>
      </VStack>
    </Box>
  );
}
