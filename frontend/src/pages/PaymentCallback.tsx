import React, { useEffect, useState } from "react";
import { Box, VStack, Text, Center, Button } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

export default function PaymentCallback() {
  const [searchParams]              = useSearchParams();
  const [status, setStatus]         = useState<"loading" | "success" | "failed">("loading");
  const [usdtCredited, setUsdtCredited] = useState(0);
  const navigate                    = useNavigate();
  const { setBalance }              = useApp();

  useEffect(() => {
    const verify = async () => {
      // Flutterwave redirects: ?transaction_id=xxx&status=successful
      // Paystack redirects:    ?reference=xxx&trxref=xxx
      const txId      = searchParams.get("transaction_id");
      const reference = searchParams.get("reference");
      const flwStatus = searchParams.get("status");

      try {
        if (txId && flwStatus === "successful") {
          const res = await api.post("/payments/flutterwave/verify", { transaction_id: txId });
          setUsdtCredited(res.data.usdtCredited);
          setBalance(res.data.newBalance ?? 0);
          setStatus("success");
        } else if (reference) {
          const res = await api.post("/payments/paystack/verify", { reference });
          setUsdtCredited(res.data.usdtCredited);
          setBalance(res.data.newBalance ?? 0);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };
    verify();
  }, []); // eslint-disable-line

  return (
    <Center minH="80vh">
      <Box
        bg="white" _dark={{ bg: "#111827" }}
        px={8} py={10} borderRadius="2xl"
        border="1px solid" borderColor="gray.200" _dark_borderColor="#1e293b"
        textAlign="center" maxW="400px" w="full" mx={4}
        boxShadow="0 16px 48px rgba(0,0,0,.12)"
      >
        {status === "loading" && (
          <VStack spacing={5}>
            <Box position="relative" w="72px" h="72px" mx="auto">
              <Box position="absolute" inset={0} borderRadius="full"
                border="2px solid #ffd700" opacity={0.3}
                style={{ animation: 'pulse-ring 1.2s ease infinite' }} />
              <Box position="absolute" inset={0} borderRadius="full"
                display="flex" alignItems="center" justifyContent="center">
                <svg width="28" height="28" viewBox="0 0 28 28" style={{ animation: 'spin 0.9s linear infinite' }}>
                  <circle cx="14" cy="14" r="11" fill="none" stroke="#1e293b" strokeWidth="3" />
                  <path d="M14 3 A11 11 0 0 1 25 14" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </Box>
            </Box>
            <Text fontWeight="700" color="gray.800" _dark={{ color: "white" }}>Verifying payment…</Text>
            <Text fontSize="sm" color="gray.400">Do not close this window</Text>
          </VStack>
        )}

        {status === "success" && (
          <VStack spacing={5}>
            <Box w={16} h={16} borderRadius="full"
              bg="rgba(74,222,128,.12)" border="2px solid #4ade80"
              display="flex" alignItems="center" justifyContent="center" mx="auto">
              <Text fontSize="2xl">✅</Text>
            </Box>
            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="800" color="gray.800" _dark={{ color: "white" }}>
                Payment Successful!
              </Text>
              <Text fontSize="sm" color="gray.400">Your balance has been credited</Text>
            </VStack>
            <Box w="full" bg="gray.50" _dark={{ bg: "#1e293b" }} borderRadius="xl"
              border="1px solid" borderColor="gray.200" _dark_borderColor="#374151" p={4}>
              <Text fontSize="2xl" fontWeight="900" color="#4ade80" textAlign="center">
                +{usdtCredited.toFixed(2)} USDT
              </Text>
            </Box>
            <Button w="full" size="lg" borderRadius="xl" fontWeight="700"
              bg="linear-gradient(135deg,#ffd700,#f59e0b)" color="gray.900"
              _hover={{ opacity: .9, transform: 'translateY(-2px)' }} transition="all .2s"
              onClick={() => navigate("/")}>
              Start Predicting 🌍
            </Button>
          </VStack>
        )}

        {status === "failed" && (
          <VStack spacing={5}>
            <Box w={16} h={16} borderRadius="full"
              bg="rgba(239,68,68,.1)" border="2px solid #f87171"
              display="flex" alignItems="center" justifyContent="center" mx="auto">
              <Text fontSize="2xl">❌</Text>
            </Box>
            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="800" color="gray.800" _dark={{ color: "white" }}>
                Payment Failed
              </Text>
              <Text fontSize="sm" color="gray.400" maxW="260px" lineHeight="1.6">
                Something went wrong or the payment was cancelled.
              </Text>
            </VStack>
            <Button w="full" size="lg" borderRadius="xl" fontWeight="700" variant="outline"
              borderColor="gray.300" _dark={{ borderColor: "#374151" }}
              _hover={{ borderColor: "#ffd700", color: "#ffd700" }} transition="all .2s"
              onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </VStack>
        )}
      </Box>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: .5; }
          50%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.9); opacity: .5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </Center>
  );
}
