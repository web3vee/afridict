import React from "react";
import { Box, HStack, Text, VStack, Divider, Link } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="surface.card" borderTop="1px" borderColor="surface.border" mt={16} py={8} px={4}>
      <Box maxW="1200px" mx="auto">
        <VStack spacing={4}>
          <HStack spacing={2}>
            <Text fontSize="xl">🌍</Text>
            <Text fontWeight="bold" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
              AfriDict
            </Text>
          </HStack>
          <Text color="gray.400" fontSize="sm" textAlign="center">
            Africa's first decentralized prediction market. Built on Polygon.
          </Text>
          <HStack spacing={6} flexWrap="wrap" justify="center">
            {["Terms", "Privacy", "Docs", "Twitter", "Telegram"].map((item) => (
              <Link key={item} fontSize="sm" color="gray.400" _hover={{ color: "brand.500" }}>
                {item}
              </Link>
            ))}
          </HStack>
          <Divider borderColor="surface.border" />
          <Text color="gray.600" fontSize="xs" textAlign="center">
            © 2026 AfriDict. Deployed on Polygon Mainnet. Always bet responsibly.
            Not available in restricted jurisdictions.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
