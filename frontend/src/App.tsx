import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, Text, Button, VStack, HStack, SimpleGrid, Card, CardHeader, CardBody, CardFooter, Badge, Input, useToast, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useI18n } from './i18n/I18nProvider';

const App = () => {
  const { t } = useI18n();
  const [account] = useState("0xf39F...2266");
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [betAmount, setBetAmount] = useState("");
  const [betSide, setBetSide] = useState<"yes" | "no" | null>(null);
  const toast = useToast();

  const markets = [
    { id: 1, title: "Will Nigeria qualify for 2026 World Cup?", yesOdds: 1.85, noOdds: 2.05, pool: 18450, category: "Sports" },
    { id: 2, title: "Will Senegal win AFCON 2025?", yesOdds: 2.30, noOdds: 1.65, pool: 14200, category: "Sports" },
    { id: 3, title: "Will Cocoa price exceed $4000/ton by Dec?", yesOdds: 1.70, noOdds: 2.20, pool: 9800, category: "Commodities" },
    { id: 4, title: "Will KES depreciate more than 5% this month?", yesOdds: 1.95, noOdds: 1.80, pool: 7650, category: "Economy" },
    { id: 5, title: "Will ANC win South African election?", yesOdds: 2.10, noOdds: 1.75, pool: 11300, category: "Elections" },
    { id: 6, title: "Will CAF overturn the AFCON 2025 winner again before April?", yesOdds: 2.10, noOdds: 1.70, pool: 12400, category: "Sports" },
    { id: 7, title: "Will Morocco officially host AFCON 2025 after the Senegal controversy?", yesOdds: 1.65, noOdds: 2.25, pool: 15800, category: "Sports" },
    { id: 8, title: "Will Senegal win their AFCON title back through CAS arbitration by June?", yesOdds: 2.80, noOdds: 1.45, pool: 9200, category: "Sports" },
    { id: 9, title: "Will Boko Haram/ISWAP carry out another major bombing in Maiduguri before May?", yesOdds: 1.95, noOdds: 1.80, pool: 6800, category: "Security" },
    { id: 10, title: "Will Dangote Refinery export over 20 cargoes of fuel across Africa by end of April?", yesOdds: 1.55, noOdds: 2.40, pool: 11300, category: "Economy" },
  ];

  const getTestUSDT = () => {
    setUsdtBalance(usdtBalance + 1000);
    toast({ title: "✅ 1000 Test USDT added!", status: "success", duration: 2000 });
  };

  const placeBet = () => {
    if (!betSide || !betAmount || parseFloat(betAmount) > usdtBalance) {
      toast({ title: "❌ Please enter a valid amount", status: "error" });
      return;
    }
    setUsdtBalance(usdtBalance - parseFloat(betAmount));
    toast({ title: `✅ Bet placed on ${betSide.toUpperCase()}!`, description: selectedMarket.title, status: "success" });
    setSelectedMarket(null);
    setBetAmount("");
    setBetSide(null);
  };

  return (
    <ChakraProvider>
      <Box bg="#0a0e17" color="white" minH="100vh">

        {/* HEADER */}
        <Box bg="#111827" px={8} py={4} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #374151">
          <HStack spacing={3}>
            <img 
              src={require('./assets/logo.png')} 
              alt="Afridict" 
              style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
            />
            <Heading size="2xl" color="white" letterSpacing="tight">Afridict</Heading>
          </HStack>

          <HStack spacing={4}>
            {/* Floating Menu Button */}
            <Menu>
              <MenuButton 
                as={Button} 
                variant="ghost" 
                color="white" 
                fontSize="3xl" 
                p={2} 
                lineHeight="1"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                ☰
              </MenuButton>
              <MenuList 
                bg="#111827" 
                borderColor="#374151" 
                boxShadow="xl" 
                zIndex={9999}
                py={2}
              >
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">🏠 Home</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">🔎 Browse All Markets</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">🔥 Trending</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">📊 My Portfolio</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">📜 My Bets</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">💰 Deposit / Withdraw</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">🏆 Leaderboard</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">📂 Categories</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">ℹ️ How It Works</MenuItem>
                <MenuItem _hover={{ bg: "#1a2138" }} fontSize="lg">⚙️ Settings</MenuItem>
                <MenuItem color="red.400" _hover={{ bg: "#1a2138" }} fontSize="lg">🚪 Logout</MenuItem>
              </MenuList>
            </Menu>

            <Button colorScheme="gray" variant="ghost" size="lg" fontWeight="medium">
              Login
            </Button>
            <Button colorScheme="green" size="lg" fontWeight="semibold">
              Sign Up
            </Button>
          </HStack>
        </Box>

        {/* REST OF THE APP */}
        <Box p={8}>
          <Box textAlign="center" mb={12}>
            <Badge colorScheme="green" fontSize="lg">✅ CONNECTED: {account}</Badge>
          </Box>

          <HStack justify="center" mb={12} spacing={8}>
            <Text fontSize="3xl" fontWeight="bold">Balance: <span style={{color:"#4ade80"}}>{usdtBalance} USDT</span></Text>
            <Button colorScheme="green" size="lg" onClick={getTestUSDT} _hover={{ transform: "scale(1.05)" }}>
              💰 Get 1000 Test USDT (Free Faucet)
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {markets.map(m => (
              <Card key={m.id} bg="#111827" borderWidth="3px" borderColor="#374151" _hover={{ borderColor: "#ffd700", transform: "translateY(-8px)" }} transition="all 0.3s">
                <CardHeader>
                  <Badge colorScheme="blue">{m.category}</Badge>
                  <Heading size="md" mt={3} color="white" lineHeight="1.3">{m.title}</Heading>
                </CardHeader>
                <CardBody>
                  <HStack justify="space-between" mt={4}>
                    <VStack>
                      <Text fontSize="xl" fontWeight="bold" color="#4ade80">YES @ {m.yesOdds}</Text>
                      <Button colorScheme="green" size="md" w="full" onClick={() => { setSelectedMarket(m); setBetSide("yes"); }}>Bet YES</Button>
                    </VStack>
                    <VStack>
                      <Text fontSize="xl" fontWeight="bold" color="#f87171">NO @ {m.noOdds}</Text>
                      <Button colorScheme="red" size="md" w="full" onClick={() => { setSelectedMarket(m); setBetSide("no"); }}>Bet NO</Button>
                    </VStack>
                  </HStack>
                </CardBody>
                <CardFooter>
                  <Text color="#94a3b8">Pool: {m.pool.toLocaleString()} USDT</Text>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Betting Modal */}
        {selectedMarket && (
          <Box position="fixed" inset={0} bg="blackAlpha.800" zIndex={9999} display="flex" alignItems="center" justifyContent="center">
            <Box bg="#111827" p={10} borderRadius="2xl" maxW="420px" w="full" boxShadow="2xl">
              <Heading size="lg" mb={6}>{selectedMarket.title}</Heading>
              <Text mb={6} fontSize="lg">You are betting <strong>{betSide?.toUpperCase()}</strong></Text>
              <Input placeholder="Amount in USDT" type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} size="lg" mb={8} />
              <HStack spacing={4}>
                <Button colorScheme="red" size="lg" onClick={() => setSelectedMarket(null)} w="full">Cancel</Button>
                <Button colorScheme="green" size="lg" onClick={placeBet} isDisabled={!betAmount} w="full">Confirm Bet</Button>
              </HStack>
            </Box>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default App;