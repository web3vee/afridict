import React from 'react';
import { Badge, Box, Button, HStack, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useAdminColors } from './useAdminColors';
import { ADMIN_FLAGS } from '../../data/staticData';

export default function AdminModeration() {
  const c = useAdminColors();
  const toast = useToast();

  return (
    <Box>
      <Heading fontSize="xl" fontWeight="800" color={c.adminHeadingColor} mb={2}>Moderation</Heading>
      <Text fontSize="sm" color={c.adminSubtextColor} mb={6}>{ADMIN_FLAGS.length} flagged items require review</Text>

      <VStack spacing={4} align="stretch">
        {ADMIN_FLAGS.map(flag => (
          <Box key={flag.id} bg={c.adminCardBg} border="1px solid" borderRadius="2xl" p={6}
            borderColor={
              flag.severity === 'high'   ? 'rgba(248,113,113,0.4)' :
              flag.severity === 'medium' ? 'rgba(255,215,0,0.3)'   : c.adminBorderColor
            }
          >
            <HStack justify="space-between" mb={3}>
              <HStack spacing={3}>
                <Badge fontSize="10px" colorScheme={flag.type === 'Comment' ? 'blue' : 'orange'}>{flag.type}</Badge>
                <Badge fontSize="10px" colorScheme={flag.severity === 'high' ? 'red' : flag.severity === 'medium' ? 'yellow' : 'gray'}>
                  {flag.severity.toUpperCase()}
                </Badge>
                <Text fontSize="xs" color={c.adminSubtextColor} fontWeight="700">{flag.user}</Text>
              </HStack>
              <Text fontSize="10px" color={c.adminMutedColor}>{flag.date}</Text>
            </HStack>

            <Box bg={c.adminQuoteBg} borderRadius="lg" p={4} mb={4}>
              <Text fontSize="sm" color={c.adminSecondaryColor} fontStyle="italic">"{flag.content}"</Text>
            </Box>

            <HStack justify="space-between">
              <Text fontSize="xs" color={c.adminMutedColor}>
                Market: <Text as="span" color="#60a5fa">{flag.market}</Text>
              </Text>
              <HStack spacing={2}>
                <Button size="xs" variant="outline" borderColor={c.adminInputBorder} color={c.adminSubtextColor}
                  borderRadius="lg" fontSize="10px"
                  onClick={() => toast({ title: 'Dismissed', status: 'info', duration: 1500 })}
                >Dismiss</Button>
                <Button size="xs" variant="outline" borderColor="#ffd700" color="#ffd700"
                  borderRadius="lg" fontSize="10px"
                  onClick={() => toast({ title: `Warned ${flag.user}`, status: 'warning', duration: 1500 })}
                >Warn User</Button>
                <Button size="xs" colorScheme="red" borderRadius="lg" fontSize="10px"
                  onClick={() => toast({ title: 'Content removed', status: 'error', duration: 1500 })}
                >Remove</Button>
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
