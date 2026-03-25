import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Spinner, Center, Button, useToast } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [usdtCredited, setUsdtCredited] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const verify = async () => {
      // Flutterwave: ?transaction_id=xxx&status=successful
      // Paystack: ?reference=xxx&trxref=xxx
      const txId = searchParams.get("transaction_id");
      const reference = searchParams.get("reference");
      const flwStatus = searchParams.get("status");

      try {
        if (txId && flwStatus === "successful") {
          const res = await api.post("/payments/flutterwave/verify", { transaction_id: txId });
          setUsdtCredited(res.data.usdtCredited);
          setStatus("success");
          await refreshUser();
        } else if (reference) {
          const res = await api.post("/payments/paystack/verify", { reference });
          setUsdtCredited(res.data.usdtCredited);
          setStatus("success");
          await refreshUser();
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };
    verify();
  }, [searchParams, refreshUser]);

  return (
    <Center minH="60vh">
      <Box bg="surface.card" p={8} borderRadius="xl" borderWidth="1px" borderColor="surface.border" textAlign="center" maxW="400px" w="full">
        {status === "loading" && (
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" />
            <Text>Verifying payment...</Text>
          </VStack>
        )}
        {status === "success" && (
          <VStack spacing={4}>
            <Text fontSize="5xl">✅</Text>
            <Text fontSize="xl" fontWeight="bold" color="green.400">Payment Successful!</Text>
            <Text color="gray.400">{usdtCredited.toFixed(2)} USDT has been credited to your account</Text>
            <Button onClick={() => navigate("/")}>Start Predicting 🌍</Button>
          </VStack>
        )}
        {status === "failed" && (
          <VStack spacing={4}>
            <Text fontSize="5xl">❌</Text>
            <Text fontSize="xl" fontWeight="bold" color="red.400">Payment Failed</Text>
            <Text color="gray.400">Something went wrong. Please try again.</Text>
            <Button onClick={() => navigate("/deposit")}>Try Again</Button>
          </VStack>
        )}
      </Box>
    </Center>
  );
}
