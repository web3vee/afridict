import React, { useState } from "react";
import {
  Box, VStack, HStack, Button, Input, Select, Text,
  FormControl, FormLabel, Alert, AlertIcon, Tabs,
  TabList, Tab, TabPanels, TabPanel, useToast, Heading,
  NumberInput, NumberInputField, Badge,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import api from "../services/api";

const EXCHANGE_RATES: Record<string, number> = {
  NGN: 1600, KES: 130, ZAR: 18, GHS: 15,
};

export default function Deposit() {
  const { user } = useAuth();
  const { t } = useI18n();
  const toast = useToast();
  const [amount, setAmount] = useState("5000");
  const [currency, setCurrency] = useState("NGN");
  const [isLoading, setIsLoading] = useState(false);

  const usdtEquiv = (parseFloat(amount) / (EXCHANGE_RATES[currency] || 1)).toFixed(2);

  const handleFlutterwave = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/payments/flutterwave/initiate", {
        amount: parseFloat(amount),
        currency,
      });
      window.location.href = res.data.paymentLink;
    } catch (err: any) {
      toast({ title: err.response?.data?.error || "Payment initiation failed", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaystack = async () => {
    setIsLoading(true);
    try {
      const amountKobo = Math.round(parseFloat(amount) * 100);
      const res = await api.post("/payments/paystack/initiate", { amount: amountKobo });
      window.location.href = res.data.authorizationUrl;
    } catch (err: any) {
      toast({ title: err.response?.data?.error || "Payment failed", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Box maxW="500px" mx="auto" px={4} py={8}>
      <VStack spacing={6}>
        <Heading size="lg">{t("payment.deposit")}</Heading>

        <Box w="full" bg="surface.card" p={5} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <HStack justify="space-between">
            <Text color="gray.400">Current Balance</Text>
            <HStack>
              <Text fontSize="xl" fontWeight="bold" color="brand.500">${user.balance.usdt.toFixed(2)}</Text>
              <Badge colorScheme="green">USDT</Badge>
            </HStack>
          </HStack>
        </Box>

        {user.kyc.status !== "approved" && (
          <Alert status="warning" borderRadius="xl" bg="yellow.900">
            <AlertIcon />
            KYC required for deposits over $100. Submit KYC for full access.
          </Alert>
        )}

        <Box w="full" bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <VStack spacing={4}>
            <HStack w="full" spacing={3}>
              <FormControl>
                <FormLabel fontSize="sm">Amount</FormLabel>
                <NumberInput value={amount} onChange={setAmount} min={100}>
                  <NumberInputField bg="surface.bg" borderColor="surface.border" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Currency</FormLabel>
                <Select value={currency} onChange={(e) => setCurrency(e.target.value)}
                  bg="surface.bg" borderColor="surface.border">
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="GHS">GHS (₵)</option>
                </Select>
              </FormControl>
            </HStack>

            <Box w="full" bg="surface.bg" p={3} borderRadius="lg">
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">You'll receive</Text>
                <Text fontSize="lg" fontWeight="bold" color="brand.500">≈ ${usdtEquiv} USDT</Text>
              </HStack>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Rate: 1 USDT ≈ {EXCHANGE_RATES[currency]} {currency} (indicative)
              </Text>
            </Box>

            <Tabs w="full" colorScheme="brand" variant="enclosed">
              <TabList>
                <Tab fontSize="sm">Flutterwave</Tab>
                <Tab fontSize="sm">Paystack (NGN)</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pb={0}>
                  <VStack spacing={3}>
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                      Supports NGN, KES, ZAR, GHS — Card, Bank, Mobile Money
                    </Text>
                    <Button w="full" size="lg" isLoading={isLoading} onClick={handleFlutterwave}
                      bg="#f5a623" color="white" _hover={{ bg: "#e09210" }}>
                      {t("payment.flutterwave")}
                    </Button>
                  </VStack>
                </TabPanel>
                <TabPanel px={0} pb={0}>
                  <VStack spacing={3}>
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                      NGN only — Card, Bank Transfer, USSD
                    </Text>
                    <Button w="full" size="lg" isLoading={isLoading} onClick={handlePaystack}
                      bg="#0ba4db" color="white" _hover={{ bg: "#0993c5" }}>
                      {t("payment.paystack")}
                    </Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>

        <Text fontSize="xs" color="gray.500" textAlign="center">
          Minimum deposit: ₦500 / KSh 200 / R50 • Funds credited within 5 minutes
        </Text>
      </VStack>
    </Box>
  );
}
