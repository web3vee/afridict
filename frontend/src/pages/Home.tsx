import React, { useState } from "react";
import {
  Box, VStack, HStack, Text, Input, Select, SimpleGrid,
  Badge, Button, Stat, StatLabel, StatNumber, Flex,
  InputGroup, InputLeftElement, Spinner, Center,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useI18n } from "../i18n/I18nProvider";
import MarketCard from "../components/market/MarketCard";

export default function Home() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");

  const { data: marketsData, isLoading } = useQuery({
    queryKey: ["markets", search, category, region],
    queryFn: () => api.get("/markets", { params: { search, category, region, status: "open" } }).then(r => r.data),
    staleTime: 15000,
  });

  const { data: statsData } = useQuery({
    queryKey: ["market-stats"],
    queryFn: () => api.get("/markets/categories/summary").then(r => r.data),
  });

  const markets = marketsData?.markets || [];
  const stats = statsData || [];

  return (
    <Box maxW="1200px" mx="auto" px={4} py={6}>
      {/* Hero */}
      <VStack spacing={2} mb={8} textAlign="center">
        <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          🌍 Predict African Events.{" "}
          <Text as="span" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
            Win Real USDT.
          </Text>
        </Text>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          Elections • Sports • Commodities • Economy — built for Africa, by Africa
        </Text>
      </VStack>

      {/* Stats Bar */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
        {[
          { label: "Active Markets", value: markets.length },
          { label: "Total Volume", value: `$${stats.reduce((a: number, s: any) => a + (s.totalVolume || 0), 0).toLocaleString()}` },
          { label: "Categories", value: stats.length },
          { label: "Countries", value: "10+" },
        ].map((stat) => (
          <Box key={stat.label} bg="surface.card" p={4} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
            <Stat>
              <StatLabel color="gray.400" fontSize="xs">{stat.label}</StatLabel>
              <StatNumber color="brand.500" fontSize="xl">{stat.value}</StatNumber>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      {/* Category pills */}
      <HStack spacing={2} mb={6} overflowX="auto" pb={2}>
        {["", "election", "sports", "commodity", "economy", "weather"].map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? "solid" : "outline"}
            borderColor="surface.border"
            onClick={() => setCategory(cat)}
            flexShrink={0}
          >
            {cat ? t(`category.${cat}`) : "All"}
          </Button>
        ))}
      </HStack>

      {/* Filters */}
      <HStack spacing={3} mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Text color="gray.400">🔍</Text>
          </InputLeftElement>
          <Input
            placeholder="Search markets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="surface.card"
            borderColor="surface.border"
          />
        </InputGroup>
        <Select
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          bg="surface.card"
          borderColor="surface.border"
          w="180px"
        >
          <option value="Nigeria">Nigeria</option>
          <option value="Kenya">Kenya</option>
          <option value="South Africa">South Africa</option>
          <option value="Ghana">Ghana</option>
          <option value="West Africa">West Africa</option>
          <option value="East Africa">East Africa</option>
        </Select>
      </HStack>

      {/* Markets Grid */}
      {isLoading ? (
        <Center py={20}><Spinner size="xl" color="brand.500" /></Center>
      ) : markets.length === 0 ? (
        <Center py={20}>
          <VStack>
            <Text fontSize="4xl">🌍</Text>
            <Text color="gray.400">No markets found. Try a different filter.</Text>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
          {markets.map((market: any) => (
            <MarketCard key={market.contractId} market={market} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
