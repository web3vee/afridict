import React from "react";
import {
  Box, VStack, HStack, Text, Badge, Progress, Button, Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

const CATEGORY_EMOJI: Record<string, string> = {
  election: "🗳️",
  sports: "⚽",
  commodity: "📦",
  economy: "💹",
  weather: "🌦️",
  other: "❓",
};

const STATUS_COLOR: Record<string, string> = {
  open: "green",
  closed: "yellow",
  resolved: "blue",
  disputed: "red",
  cancelled: "gray",
};

interface MarketCardProps {
  market: {
    contractId: number;
    description: string;
    category: string;
    region: string;
    status: string;
    yesPool: number;
    noPool: number;
    yesOdds: number;
    noOdds: number;
    totalVolume: number;
    participantCount: number;
    endTime: string;
    featured?: boolean;
  };
}

export default function MarketCard({ market }: MarketCardProps) {
  const { t } = useI18n();
  const total = market.yesPool + market.noPool;
  const yesOdds = total === 0 ? 50 : Math.round((market.yesPool / total) * 100);
  const noOdds = 100 - yesOdds;

  const daysLeft = Math.max(0, Math.ceil((new Date(market.endTime).getTime() - Date.now()) / 86400000));

  return (
    <Link to={`/market/${market.contractId}`}>
      <Box
        bg="surface.card"
        border="1px"
        borderColor={market.featured ? "brand.500" : "surface.border"}
        borderRadius="xl"
        p={4}
        _hover={{ borderColor: "brand.500", transform: "translateY(-2px)", transition: "all 0.2s" }}
        cursor="pointer"
        h="full"
      >
        <VStack align="start" spacing={3} h="full">
          {/* Header */}
          <HStack justify="space-between" w="full">
            <HStack spacing={1}>
              <Text fontSize="lg">{CATEGORY_EMOJI[market.category] || "❓"}</Text>
              <Badge colorScheme="gray" fontSize="xs">{market.category}</Badge>
            </HStack>
            <HStack spacing={1}>
              {market.featured && <Badge colorScheme="yellow" fontSize="xs">⭐ Featured</Badge>}
              <Badge colorScheme={STATUS_COLOR[market.status]} fontSize="xs">{t(`market.${market.status}`)}</Badge>
            </HStack>
          </HStack>

          {/* Description */}
          <Text fontSize="sm" fontWeight="medium" noOfLines={3} flex={1}>
            {market.description}
          </Text>

          {/* Region */}
          <Text fontSize="xs" color="gray.400">📍 {market.region}</Text>

          {/* Odds bar */}
          <Box w="full">
            <HStack justify="space-between" mb={1}>
              <HStack spacing={1}>
                <Text fontSize="xs" color="green.400" fontWeight="bold">{t("market.yes")}</Text>
                <Text fontSize="xs" color="green.400">{yesOdds}%</Text>
              </HStack>
              <HStack spacing={1}>
                <Text fontSize="xs" color="red.400">{noOdds}%</Text>
                <Text fontSize="xs" color="red.400" fontWeight="bold">{t("market.no")}</Text>
              </HStack>
            </HStack>
            <Progress
              value={yesOdds}
              size="sm"
              borderRadius="full"
              bg="red.800"
              sx={{ "& > div": { background: "linear-gradient(to right, #48bb78, #38a169)" } }}
            />
          </Box>

          {/* Footer stats */}
          <HStack justify="space-between" w="full">
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="gray.400">{t("market.volume")}</Text>
              <Text fontSize="sm" fontWeight="bold">${(market.totalVolume || 0).toLocaleString()}</Text>
            </VStack>
            <VStack spacing={0} align="center">
              <Text fontSize="xs" color="gray.400">{t("market.participants")}</Text>
              <Text fontSize="sm" fontWeight="bold">{market.participantCount}</Text>
            </VStack>
            <VStack spacing={0} align="end">
              <Text fontSize="xs" color="gray.400">{t("market.ends")}</Text>
              <Text fontSize="sm" fontWeight="bold" color={daysLeft < 2 ? "red.400" : "gray.100"}>
                {daysLeft === 0 ? "Today" : `${daysLeft}d`}
              </Text>
            </VStack>
          </HStack>

          {/* CTA */}
          {market.status === "open" && (
            <Button size="sm" w="full" variant="outline" borderColor="brand.500" color="brand.500">
              {t("market.place_bet")} →
            </Button>
          )}
        </VStack>
      </Box>
    </Link>
  );
}
