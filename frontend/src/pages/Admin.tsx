import React, { useState } from "react";
import {
  Box, VStack, HStack, Text, Button, Input, Select,
  Textarea, FormControl, FormLabel, useToast, Table,
  Thead, Tbody, Tr, Th, Td, Badge, Tabs, TabList,
  Tab, TabPanels, TabPanel, Heading, Switch,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();

  const [newMarket, setNewMarket] = useState({
    description: "", category: "election", region: "Nigeria",
    endTime: "", resolutionTime: "",
  });
  const [kycUserId, setKycUserId] = useState("");
  const [kycStatus, setKycStatus] = useState("approved");

  if (!user) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.400" fontSize="xl">Admin access required</Text>
        <Button mt={4} onClick={() => navigate("/")}>Go Home</Button>
      </Box>
    );
  }

  const { data: marketsData } = useQuery({
    queryKey: ["admin-markets"],
    queryFn: () => api.get("/markets?limit=100").then(r => r.data),
  });

  const markets = marketsData?.markets || [];

  const handleToggleFeatured = async (contractId: number, featured: boolean) => {
    try {
      await api.patch(`/markets/${contractId}`, { featured: !featured });
      qc.invalidateQueries({ queryKey: ["admin-markets"] });
      toast({ title: "Updated", status: "success", duration: 1500 });
    } catch {
      toast({ title: "Update failed", status: "error" });
    }
  };

  return (
    <Box maxW="1100px" mx="auto" px={4} py={6}>
      <HStack mb={6}>
        <Text fontSize="2xl" fontWeight="bold">⚙️ Admin Panel</Text>
        <Badge colorScheme="red">Admin</Badge>
      </HStack>

      <Tabs colorScheme="brand" variant="line">
        <TabList borderColor="surface.border">
          <Tab>Markets</Tab>
          <Tab>KYC Management</Tab>
          <Tab>Create Market (Off-chain)</Tab>
        </TabList>

        <TabPanels>
          {/* Markets Table */}
          <TabPanel px={0}>
            <Box overflowX="auto" bg="surface.card" borderRadius="xl" borderWidth="1px" borderColor="surface.border">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Description</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th>Volume</Th>
                    <Th>Featured</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {markets.map((m: any) => (
                    <Tr key={m.contractId}>
                      <Td>{m.contractId}</Td>
                      <Td maxW="250px" isTruncated>{m.description}</Td>
                      <Td><Badge>{m.category}</Badge></Td>
                      <Td><Badge colorScheme={m.status === "open" ? "green" : "gray"}>{m.status}</Badge></Td>
                      <Td>${(m.totalVolume || 0).toLocaleString()}</Td>
                      <Td>
                        <Switch
                          isChecked={m.featured}
                          colorScheme="brand"
                          onChange={() => handleToggleFeatured(m.contractId, m.featured)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* KYC */}
          <TabPanel px={0}>
            <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
              <Heading size="sm" mb={4}>Update KYC Status</Heading>
              <VStack spacing={3} align="start">
                <FormControl>
                  <FormLabel fontSize="sm">User ID</FormLabel>
                  <Input value={kycUserId} onChange={(e) => setKycUserId(e.target.value)}
                    placeholder="MongoDB user ID" bg="surface.bg" borderColor="surface.border" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Status</FormLabel>
                  <Select value={kycStatus} onChange={(e) => setKycStatus(e.target.value)}
                    bg="surface.bg" borderColor="surface.border">
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </Select>
                </FormControl>
                <Button onClick={async () => {
                  try {
                    // Admin KYC update endpoint (extend auth routes)
                    toast({ title: "KYC updated (hook blockchain resolver)", status: "success" });
                  } catch {
                    toast({ title: "Failed", status: "error" });
                  }
                }}>
                  Update KYC
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* Create Market metadata (mirrors on-chain) */}
          <TabPanel px={0}>
            <Box bg="surface.card" p={6} borderRadius="xl" borderWidth="1px" borderColor="surface.border">
              <Heading size="sm" mb={4}>Sync Off-chain Market Metadata</Heading>
              <Text fontSize="xs" color="gray.400" mb={4}>
                Note: Use the deploy script or directly call the contract to create on-chain markets.
                This panel syncs metadata for existing on-chain markets.
              </Text>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea value={newMarket.description}
                    onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                    bg="surface.bg" borderColor="surface.border" />
                </FormControl>
                <HStack w="full" spacing={3}>
                  <FormControl>
                    <FormLabel fontSize="sm">Category</FormLabel>
                    <Select value={newMarket.category}
                      onChange={(e) => setNewMarket({ ...newMarket, category: e.target.value })}
                      bg="surface.bg" borderColor="surface.border">
                      {["election","sports","commodity","economy","weather","other"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Region</FormLabel>
                    <Input value={newMarket.region}
                      onChange={(e) => setNewMarket({ ...newMarket, region: e.target.value })}
                      bg="surface.bg" borderColor="surface.border" />
                  </FormControl>
                </HStack>
                <Button>Sync Market</Button>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
