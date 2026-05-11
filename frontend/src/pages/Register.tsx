import React, { useState } from "react";
import {
  Box, VStack, Button, Input, Select, Text, FormControl,
  FormLabel, FormErrorMessage, Heading, Link, useToast, HStack,
} from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

export default function Register() {
  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", username: "", country: "", currency: "USDT", language: "en", referralCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email required";
    if (!form.password || form.password.length < 8) e.password = "Password must be 8+ characters";
    if (!form.username || form.username.length < 3) e.username = "Username must be 3+ characters";
    if (!form.country) e.country = "Country required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form);
      toast({ title: "Welcome to AfriDict! 🌍", status: "success" });
      navigate("/");
    } catch (err: any) {
      toast({ title: err.response?.data?.error || "Registration failed", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="420px" mx="auto" px={4} py={12}>
      <VStack spacing={6}>
        <Heading size="lg" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
          Join AfriDict 🌍
        </Heading>

        <Box w="full" bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email" placeholder="you@example.com" bg="surface.bg" borderColor="surface.border" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.username}>
                <FormLabel fontSize="sm">Username</FormLabel>
                <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="afridictor" bg="surface.bg" borderColor="surface.border" />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="sm">Password</FormLabel>
                <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type="password" placeholder="8+ characters" bg="surface.bg" borderColor="surface.border" />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.country}>
                <FormLabel fontSize="sm">Country</FormLabel>
                <Select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  bg="surface.bg" borderColor="surface.border" placeholder="Select country">
                  {["Nigeria","Kenya","South Africa","Ghana","Ethiopia","Tanzania","Uganda","Senegal","Ivory Coast","Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.country}</FormErrorMessage>
              </FormControl>

              <HStack w="full" spacing={3}>
                <FormControl>
                  <FormLabel fontSize="sm">Currency</FormLabel>
                  <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    bg="surface.bg" borderColor="surface.border">
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="GHS">GHS (₵)</option>
                    <option value="USDT">USDT</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Language</FormLabel>
                  <Select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                    bg="surface.bg" borderColor="surface.border">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="sw">Kiswahili</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel fontSize="sm">Referral Code (optional)</FormLabel>
                <Input value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                  placeholder="Enter code" bg="surface.bg" borderColor="surface.border" />
              </FormControl>

              <Button type="submit" w="full" size="lg" isLoading={isLoading}>
                Create Account
              </Button>
            </VStack>
          </form>
        </Box>

        <Text color="gray.400" fontSize="sm">
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" color="brand.500">{t("auth.login")}</Link>
        </Text>
      </VStack>
    </Box>
  );
}
