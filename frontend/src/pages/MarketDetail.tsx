import React, { useState, useEffect } from "react";
import {
  Box, VStack, HStack, Text, Badge, Button, Input, Slider,
  SliderTrack, SliderFilledTrack, SliderThumb, NumberInput,
  NumberInputField, Tabs, TabList, Tab, TabPanels, TabPanel,
  Alert, AlertIcon, Spinner, Center, Flex, Progress, useToast,
  Stat, StatLabel, StatNumber, SimpleGrid, Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import api from "../services/api";
import { useWeb3 } from "../hooks/useWeb3";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { io } from "socket.io-client";

const USDT_DECIMALS = 6;

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const { contract, usdtContract, account, isCorrectNetwork } = useWeb3();
  const { user } = useAuth();
  const { t } = useI18n();
  const toast = useToast();

  const [betAmount, setBetAmount] = useState("10");
  const [betSide, setBetSide] = useState<"yes" | "no" | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState("0");
  const [marketData, setMarketData] = useState<any>(null);

  const { data: market, isLoading } = useQuery({
    queryKey: ["market", id],
    queryFn: () => api.get(`/markets/${id}`).then(r => r.data),
    enabled: !!id,
  });

  // Real-time updates via Socket.io
  useEffect(() => {
    if (!id) return;
    const socket = io((import.meta.env.VITE_API_URL as string)?.replace("/api", "") || "http://localhost:5000");
    socket.emit("subscribe:market", id);
    socket.on("market:bet", (data) => {
      if (data.marketId === Number(id)) {
        setMarketData((prev: any) => ({ ...prev, ...data }));
      }
    });
    return () => { socket.disconnect(); };
  }, [id]);

  // Fetch USDT balance
  useEffect(() => {
    if (usdtContract && account) {
      usdtContract.balanceOf(account).then((bal: bigint) => {
        setUsdtBalance(ethers.formatUnits(bal, USDT_DECIMALS));
      });
    }
  }, [usdtContract, account]);

  const liveMarket = { ...market, ...marketData };
  const total = (liveMarket?.yesPool || 0) + (liveMarket?.noPool || 0);
  const yesOdds = total === 0 ? 50 : Math.round((liveMarket.yesPool / total) * 100);
  const noOdds = 100 - yesOdds;

  const potentialWin = betSide
    ? parseFloat(betAmount) * (betSide === "yes" ? 100 / Math.max(yesOdds, 1) : 100 / Math.max(noOdds, 1)) * 0.98
    : 0;

  const handleBet = async () => {
    if (!contract || !usdtContract || !account) {
      toast({ title: "Connect your wallet first", status: "warning" });
      return;
    }
    if (!betSide) {
      toast({ title: "Select Yes or No", status: "warning" });
      return;
    }
    if (!isCorrectNetwork) {
      toast({ title: "Switch to Polygon network", status: "warning" });
      return;
    }
    if (user?.kyc.status !== "approved") {
      toast({ title: t("kyc.required"), description: "Complete KYC to place bets", status: "warning" });
      return;
    }

    const amount = ethers.parseUnits(betAmount, USDT_DECIMALS);

    try {
      // Step 1: Approve USDT
      setIsApproving(true);
      const contractAddr = await contract.getAddress();
      const allowance: bigint = await usdtContract.allowance(account, contractAddr);

      if (allowance < amount) {
        const approveTx = await usdtContract.approve(contractAddr, ethers.MaxUint256);
        await approveTx.wait();
        toast({ title: "USDT approved", status: "success", duration: 2000 });
      }
      setIsApproving(false);

      // Step 2: Place bet
      setIsBetting(true);
      const outcomeEnum = betSide === "yes" ? 1 : 2;
      const betTx = await contract.placeBet(id, outcomeEnum, amount);
      await betTx.wait();

      toast({ title: "Bet placed! 🎉", description: `${betAmount} USDT on ${betSide.toUpperCase()}`, status: "success" });
      setBetAmount("10");
      setBetSide(null);

      // Refresh USDT balance
      const newBal: bigint = await usdtContract.balanceOf(account);
      setUsdtBalance(ethers.formatUnits(newBal, USDT_DECIMALS));
    } catch (err: any) {
      toast({ title: "Transaction failed", description: err.reason || err.message, status: "error" });
    } finally {
      setIsApproving(false);
      setIsBetting(false);
    }
  };

  const handleClaim = async () => {
    if (!contract) return;
    try {
      const tx = await contract.claimWinnings(id);
      await tx.wait();
      toast({ title: "Winnings claimed! 🏆", status: "success" });
    } catch (err: any) {
      toast({ title: "Claim failed", description: err.reason || err.message, status: "error" });
    }
  };

  if (isLoading) return <Center py={20}><Spinner size="xl" color="brand.500" /></Center>;
  if (!market) return <Center py={20}><Text color="gray.400">Market not found</Text></Center>;

  return (
    <Box maxW="900px" mx="auto" px={4} py={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <HStack mb={3} spacing={2}>
            <Badge colorScheme="gray">{liveMarket.category}</Badge>
            <Badge colorScheme="blue">{liveMarket.region}</Badge>
            <Badge colorScheme={liveMarket.status === "open" ? "green" : "gray"}>
              {t(`market.${liveMarket.status}`)}
            </Badge>
          </HStack>
          <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" mb={4}>
            {liveMarket.description}
          </Text>

          {/* Odds */}
          <Box mb={4}>
            <HStack justify="space-between" mb={2}>
              <HStack>
                <Text color="green.400" fontWeight="bold" fontSize="xl">{t("market.yes")}</Text>
                <Text color="green.400" fontSize="xl">{yesOdds}%</Text>
              </HStack>
              <HStack>
                <Text color="red.400" fontSize="xl">{noOdds}%</Text>
                <Text color="red.400" fontWeight="bold" fontSize="xl">{t("market.no")}</Text>
              </HStack>
            </HStack>
            <Progress
              value={yesOdds}
              size="lg"
              borderRadius="full"
              bg="red.800"
              sx={{ "& > div": { background: "linear-gradient(to right, #48bb78, #38a169)" } }}
            />
          </Box>

          {/* Stats */}
          <SimpleGrid columns={3} spacing={4}>
            <Stat>
              <StatLabel color="gray.400" fontSize="xs">{t("market.volume")}</StatLabel>
              <StatNumber fontSize="md">${total.toLocaleString()}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="gray.400" fontSize="xs">{t("market.participants")}</StatLabel>
              <StatNumber fontSize="md">{liveMarket.participantCount}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="gray.400" fontSize="xs">{t("market.ends")}</StatLabel>
              <StatNumber fontSize="md">
                {new Date(liveMarket.endTime).toLocaleDateString()}
              </StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Betting Panel */}
        {liveMarket.status === "open" && (
          <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
            <Text fontSize="lg" fontWeight="bold" mb={4}>{t("market.place_bet")}</Text>

            {!account && (
              <Alert status="warning" borderRadius="lg" mb={4} bg="yellow.900">
                <AlertIcon />
                Connect your wallet to place bets
              </Alert>
            )}

            {user?.kyc.status !== "approved" && (
              <Alert status="info" borderRadius="lg" mb={4} bg="blue.900">
                <AlertIcon />
                {t("kyc.required")} — <Text as="span" color="brand.500" cursor="pointer" ml={1}>Submit KYC</Text>
              </Alert>
            )}

            {/* Yes/No selector */}
            <HStack spacing={3} mb={5}>
              <Button
                flex={1}
                size="lg"
                variant={betSide === "yes" ? "solid" : "outline"}
                colorScheme="green"
                onClick={() => setBetSide("yes")}
                borderWidth={2}
              >
                ✅ {t("market.yes")} — {yesOdds}%
              </Button>
              <Button
                flex={1}
                size="lg"
                variant={betSide === "no" ? "solid" : "outline"}
                colorScheme="red"
                onClick={() => setBetSide("no")}
                borderWidth={2}
              >
                ❌ {t("market.no")} — {noOdds}%
              </Button>
            </HStack>

            {/* Amount */}
            <VStack spacing={2} mb={4} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" color="gray.400">{t("bet.amount")}</Text>
                {account && <Text fontSize="xs" color="gray.400">Balance: {parseFloat(usdtBalance).toFixed(2)} USDT</Text>}
              </HStack>
              <HStack w="full" spacing={2}>
                <NumberInput
                  value={betAmount}
                  onChange={setBetAmount}
                  min={1}
                  max={10000}
                  flex={1}
                >
                  <NumberInputField bg="surface.bg" borderColor="surface.border" />
                </NumberInput>
                {["10", "50", "100", "500"].map((amt) => (
                  <Button key={amt} size="sm" variant="outline" borderColor="surface.border" onClick={() => setBetAmount(amt)}>
                    ${amt}
                  </Button>
                ))}
              </HStack>
            </VStack>

            {/* Potential payout */}
            {betSide && parseFloat(betAmount) > 0 && (
              <Box bg="surface.bg" p={3} borderRadius="lg" mb={4}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.400">Potential payout (incl. 2% fee)</Text>
                  <Text fontSize="lg" fontWeight="bold" color="brand.500">
                    ${potentialWin.toFixed(2)} USDT
                  </Text>
                </HStack>
              </Box>
            )}

            <Button
              w="full"
              size="lg"
              isLoading={isApproving || isBetting}
              loadingText={isApproving ? t("bet.approve_usdt") : t("bet.confirm")}
              onClick={handleBet}
              isDisabled={!account || !betSide}
            >
              {t("bet.confirm")}
            </Button>
          </Box>
        )}

        {/* Claim Winnings */}
        {liveMarket.status === "resolved" && account && (
          <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="green.800">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Market Resolved: {liveMarket.outcome?.toUpperCase()}</Text>
                <Text fontSize="sm" color="gray.400">Claim your winnings if you bet correctly</Text>
              </VStack>
              <Button colorScheme="green" onClick={handleClaim}>
                🏆 Claim Winnings
              </Button>
            </HStack>
          </Box>
        )}

        {/* Comments */}
        <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <Text fontSize="lg" fontWeight="bold" mb={4}>Discussion</Text>
          {liveMarket.comments?.length === 0 ? (
            <Text color="gray.400" fontSize="sm">No comments yet. Be the first!</Text>
          ) : (
            <VStack align="start" spacing={3}>
              {liveMarket.comments?.map((c: any, i: number) => (
                <Box key={i} bg="surface.bg" p={3} borderRadius="lg" w="full">
                  <Text fontSize="xs" color="gray.400" mb={1}>{new Date(c.createdAt).toLocaleString()}</Text>
                  <Text fontSize="sm">{c.text}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}
