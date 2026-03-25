import React from "react";
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <Center minH="60vh">
      <VStack spacing={3}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text color="gray.400" fontSize="sm">{text}</Text>
      </VStack>
    </Center>
  );
}
