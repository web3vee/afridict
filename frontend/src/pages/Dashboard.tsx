import React from "react";
import {
  Box, VStack, HStack, Text, SimpleGrid, Badge, Stat,
  StatLabel, StatNumber, Button, Tabs, TabList, Tab,
  TabPanels, TabPanel, Center, Spinner, Alert, AlertIcon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user) return <Center py={20}><Spinner color="brand.500" /></Center>;

  const kycColor = { none: "gray", pending: "yellow", approved: "green", rejected: "red" }[user.kyc.status];

  return (
    <Box maxW="1000px" mx="auto" px={4} py={6}>
      <VStack spacing={6} align="stretch">
        {/* Profile Header */}
        <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
          <HStack justify="space-between" flexWrap="wrap" gap={3}>
            <VStack align="start" spacing={1}>
              <HStack>
                <Text fontSize="2xl" fontWeight="bold">{user.username}</Text>
                <Badge colorScheme={kycColor}>KYC: {user.kyc.status}</Badge>
              </HStack>
              <Text color="gray.400" fontSize="sm">{user.email} • {user.country}</Text>
              <Text fontSize="xs" color="gray.500">Referral: {user.referralCode}</Text>
            </VStack>
            <VStack align="end" spacing={1}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                ${user.balance.usdt.toFixed(2)}
              </Text>
              <Text color="gray.400" fontSize="sm">USDT Balance</Text>
              <Link to="/deposit">
                <Button size="sm">{t("payment.deposit")}</Button>
              </Link>
            </VStack>
          </HStack>
        </Box>

        {/* KYC Alert */}
        {user.kyc.status === "none" && (
          <Alert status="warning" borderRadius="xl" bg="yellow.900">
            <AlertIcon />
            Complete KYC to place bets and withdraw funds.
            <Button ml={3} size="sm" colorScheme="yellow">Submit KYC</Button>
          </Alert>
        )}
        {user.kyc.status === "pending" && (
          <Alert status="info" borderRadius="xl" bg="blue.900">
            <AlertIcon />
            Your KYC is under review. We'll notify you within 24 hours.
          </Alert>
        )}

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {[
            { label: t("dashboard.bets"), value: user.totalBets },
            { label: t("dashboard.winnings"), value: `$${user.totalWinnings.toFixed(2)}` },
            { label: "Balance (USDT)", value: `$${user.balance.usdt.toFixed(2)}` },
            { label: "KYC Status", value: user.kyc.status.toUpperCase() },
          ].map((stat) => (
            <Box key={stat.label} bg="surface.card" p={4} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
              <Stat>
                <StatLabel color="gray.400" fontSize="xs">{stat.label}</StatLabel>
                <StatNumber fontSize="xl" color="brand.500">{stat.value}</StatNumber>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        {/* Tabs */}
        <Tabs colorScheme="brand" variant="line">
          <TabList borderColor="surface.border">
            <Tab>{t("dashboard.my_positions")}</Tab>
            <Tab>Transaction History</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
                <Text color="gray.400" textAlign="center" py={8}>
                  Connect your wallet to view on-chain positions.
                </Text>
              </Box>
            </TabPanel>
            <TabPanel px={0}>
              <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
                <Text color="gray.400" textAlign="center" py={8}>
                  No transactions yet. <Link to="/deposit"><Text as="span" color="brand.500">Make your first deposit</Text></Link>
                </Text>
              </Box>
            </TabPanel>
            <TabPanel px={0}>
              <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
                <VStack align="start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text>Country: {user.country}</Text>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Currency: {user.currency}</Text>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Language: {user.language}</Text>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </HStack>
                </VStack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
