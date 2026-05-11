import React, { useState } from "react";
import {
  Box, Text, HStack, VStack, Button, Input, InputGroup,
  InputLeftElement, Divider,
} from "@chakra-ui/react";
import AppChart from "../shared/AppChart";

function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297 + 233280) * 43758.5453;
  return x - Math.floor(x);
}

function genCardChartData(chance: number, seed: number, timeFrame: string): { time: string; value: number }[] {
  const configs: Record<string, { n: number; label: (i: number, total: number) => string }> = {
    '1D':  { n: 30, label: (i, n) => i % 8  === 0 ? `${String(Math.round((i/n)*24)).padStart(2,'0')}:00` : '' },
    '1W':  { n: 42, label: (i, n) => { const d=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; return i%6===0?(d[Math.floor((i/n)*7)]||''):''; }},
    '1M':  { n: 60, label: (i, n) => i % 15 === 0 ? `Wk${Math.max(1,Math.ceil((i/n)*4))}` : '' },
    'ALL': { n: 80, label: (i, n) => { const ms=['Aug','Sep','Oct','Nov','Dec','Jan']; return i%16===0?(ms[Math.floor((i/n)*ms.length)]||''):''; }},
  };
  const cfg = configs[timeFrame] || configs['1D'];
  const pts: { time: string; value: number }[] = [];
  let cur = Math.max(30, chance - 20);
  for (let i = 0; i <= cfg.n; i++) {
    const progress = i / cfg.n;
    const noise = (seededRand(seed, i) - 0.5) * (10 - progress * 5);
    cur = Math.max(5, Math.min(97, cur + (chance - cur) * 0.12 + noise));
    pts.push({ time: cfg.label(i, cfg.n), value: +cur.toFixed(1) });
  }
  pts[pts.length - 1].value = chance;
  return pts;
}

interface DetailedMarketCardProps {
  market: {
    contractId?: number;
    id?: number;
    description?: string;
    title?: string;
    category: string;
    status?: string;
    yesPool?: number;
    noPool?: number;
    yesOdds?: number;
    noOdds?: number;
    totalVolume?: number;
    pool?: number;
    participantCount?: number;
    predictors?: string;
    endTime?: string;
    isLive?: boolean;
  };
  onClose?: () => void;
  onBet?: (side: "yes" | "no", amount: number) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Elections:"🗳️", elections:"🗳️",
  Sports:"⚽",     sports:"⚽",
  Music:"🎵",      music:"🎵",
  Crypto:"₿",      crypto:"₿",
  Economy:"💹",    economy:"💹",
  Commodities:"📦",commodity:"📦",
  Security:"🔒",   security:"🔒",
  Politics:"🏛️",  politics:"🏛️",
  Tech:"💻",       tech:"💻",
  Weather:"☁️",    weather:"☁️",
};


export default function DetailedMarketCard({ market, onClose, onBet }: DetailedMarketCardProps) {
  const [side, setSide]       = useState<"yes"|"no"|null>(null);
  const [amount, setAmount]   = useState("");
  const [tf, setTf]           = useState("1D");

  const title = market.description || market.title || "";

  const total = (market.yesPool ?? 0) + (market.noPool ?? 0);
  const yesChance = total > 0
    ? Math.round((market.yesPool! / total) * 100)
    : market.yesOdds
    ? Math.round((1 / market.yesOdds) / ((1 / market.yesOdds) + (1 / (market.noOdds ?? 2))) * 100)
    : 50;
  const noChance = 100 - yesChance;

  const volume = market.totalVolume ?? market.pool ?? 0;
  const volumeLabel = volume >= 1000000
    ? `$${(volume / 1000000).toFixed(2)}M`
    : volume >= 1000
    ? `$${(volume / 1000).toFixed(1)}K`
    : `$${volume.toLocaleString()}`;

  const daysLeft = market.endTime
    ? Math.max(0, Math.ceil((new Date(market.endTime).getTime() - Date.now()) / 86400000))
    : null;

  const endDate = market.endTime
    ? new Date(market.endTime).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
    : "—";

  const potentialWin = amount && side
    ? (parseFloat(amount) * (side === "yes" ? (100 / yesChance) : (100 / noChance))).toFixed(2)
    : null;

  const chartSeed = (market.contractId ?? market.id ?? 1) * 997 & 0xffffff;
  const chartData = genCardChartData(yesChance, chartSeed, tf);
  const chartMin  = Math.max(0,   Math.floor(Math.min(...chartData.map(d => d.value)) / 5) * 5);
  const chartMax  = Math.min(100, Math.ceil( Math.max(...chartData.map(d => d.value)) / 5) * 5);

  return (
    <Box
      position="fixed" inset={0} zIndex={1000} bg="rgba(0,0,0,0.75)"
      display="flex" alignItems="center" justifyContent="center"
      onClick={onClose}
      style={{backdropFilter:"blur(4px)"}}
    >
      <Box
        onClick={e => e.stopPropagation()}
        bg="#0F1117" w="full" maxW="900px" mx={4}
        borderRadius="24px" overflow="hidden"
        boxShadow="0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)"
        maxH="92vh" overflowY="auto"
      >
        {/* HEADER */}
        <Box bg="#1C1F26" px={7} py={5} borderBottom="1px solid rgba(255,255,255,0.06)">
          <HStack justify="space-between" align="flex-start">
            <HStack spacing={3} flex={1}>
              <Text fontSize="22px">{CATEGORY_EMOJI[market.category] ?? "❓"}</Text>
              <VStack align="start" spacing={1} flex={1}>
                <HStack spacing={2}>
                  {(market.isLive ?? market.status === "open") && (
                    <HStack spacing={1} bg="rgba(34,211,238,0.12)" borderRadius="full" px={2} py="2px">
                      <Box w="6px" h="6px" borderRadius="full" bg="#22D3EE"
                        style={{boxShadow:"0 0 6px #22D3EE", animation:"livePulse 1.5s infinite"}}
                      />
                      <Text fontSize="10px" fontWeight="700" color="#22D3EE">LIVE</Text>
                    </HStack>
                  )}
                  <Box bg="rgba(22,82,240,0.18)" border="1px solid rgba(22,82,240,0.4)"
                    borderRadius="full" px={2} py="1px"
                  >
                    <Text fontSize="10px" fontWeight="700" color="#1652F0">on Base</Text>
                  </Box>
                  <Text fontSize="11px" color="#64748B" fontWeight="600">{market.category}</Text>
                </HStack>
                <Text fontSize="17px" fontWeight="700" color="#F8F9FA" lineHeight="1.4">
                  {title}
                </Text>
              </VStack>
            </HStack>
            <Button
              onClick={onClose} variant="ghost" size="sm" color="#64748B"
              _hover={{color:"#F8F9FA", bg:"rgba(255,255,255,0.08)"}}
              borderRadius="full" fontSize="18px" minW="36px" h="36px" p={0}
            >✕</Button>
          </HStack>
        </Box>

        {/* BODY */}
        <Box display="flex" flexDirection={{base:"column", md:"row"}}>

          {/* LEFT — Chart + stats */}
          <Box flex={1} p={7}>

            {/* LIVE CHANCES */}
            <HStack spacing={6} mb={6}>
              <VStack spacing={0} align="start">
                <Text fontSize="36px" fontWeight="900" color="#10B981" lineHeight="1">{yesChance}%</Text>
                <Text fontSize="12px" color="#A1A7B3" fontWeight="600">YES chance</Text>
              </VStack>
              <Box flex={1} h="8px" borderRadius="full" bg="#252A33" overflow="hidden">
                <Box h="full" borderRadius="full"
                  style={{
                    width:`${yesChance}%`,
                    background:"linear-gradient(90deg,#10B981,#059669)",
                    transition:"width 0.6s ease",
                  }}
                />
              </Box>
              <VStack spacing={0} align="end">
                <Text fontSize="36px" fontWeight="900" color="#EF4444" lineHeight="1">{noChance}%</Text>
                <Text fontSize="12px" color="#A1A7B3" fontWeight="600">NO chance</Text>
              </VStack>
            </HStack>

            {/* CHART */}
            <Box bg="#252A33" borderRadius="16px" p={4} mb={6}>
              <HStack justify="space-between" mb={3}>
                <Text fontSize="12px" fontWeight="600" color="#A1A7B3">Price history</Text>
                <HStack spacing={3}>
                  {["1D","1W","1M","ALL"].map(t => (
                    <Text key={t} fontSize="11px" fontWeight="600"
                      color={t === tf ? "#3b82f6" : "#64748B"}
                      cursor="pointer" _hover={{color:"#F8F9FA"}}
                      onClick={() => setTf(t)}
                    >{t}</Text>
                  ))}
                </HStack>
              </HStack>
              <Box h="120px">
                <AppChart
                  data={chartData}
                  color="#3b82f6"
                  height={120}
                  yFormatter={(v: number) => `${v}%`}
                  yDomain={[chartMin, chartMax]}
                  tooltipLabel="YES chance"
                />
              </Box>
            </Box>

            {/* STATS ROW */}
            <Box bg="#1C1F26" border="1px solid rgba(255,255,255,0.06)" borderRadius="16px" p={4}>
              <HStack justify="space-between" divider={<Box w="1px" h="40px" bg="rgba(255,255,255,0.06)"/>}>
                <VStack spacing={0} align="center" flex={1}>
                  <Text fontSize="16px" fontWeight="800" color="#F8F9FA">{volumeLabel}</Text>
                  <Text fontSize="11px" color="#A1A7B3">Volume</Text>
                </VStack>
                <VStack spacing={0} align="center" flex={1}>
                  <Text fontSize="16px" fontWeight="800" color="#F8F9FA">{endDate}</Text>
                  <Text fontSize="11px" color="#A1A7B3">End Date</Text>
                </VStack>
                <VStack spacing={0} align="center" flex={1}>
                  <Text fontSize="16px" fontWeight="800"
                    color={daysLeft !== null && daysLeft <= 1 ? "#EF4444" : "#F8F9FA"}
                  >{daysLeft !== null ? `${daysLeft}d` : "—"}</Text>
                  <Text fontSize="11px" color="#A1A7B3">Days Left</Text>
                </VStack>
                <VStack spacing={0} align="center" flex={1}>
                  <Text fontSize="16px" fontWeight="800" color="#F8F9FA">
                    {market.participantCount ?? market.predictors ?? "—"}
                  </Text>
                  <Text fontSize="11px" color="#A1A7B3">Traders</Text>
                </VStack>
              </HStack>
            </Box>
          </Box>

          {/* RIGHT — Trading panel */}
          <Box
            w={{base:"full", md:"280px"}} flexShrink={0}
            bg="#1C1F26" borderLeft="1px solid rgba(255,255,255,0.06)"
            p={6} display="flex" flexDirection="column" gap={4}
          >
            <Text fontSize="14px" fontWeight="700" color="#F8F9FA">Place a Trade</Text>

            {/* YES / NO */}
            <VStack spacing={2}>
              <Button
                w="full" h="52px" borderRadius="12px" fontSize="15px" fontWeight="700"
                color="white" border="2px solid"
                bg={side === "yes" ? "#10B981" : "transparent"}
                borderColor={side === "yes" ? "#10B981" : "rgba(16,185,129,0.3)"}
                _hover={{bg:"#10B981", borderColor:"#10B981", transform:"translateY(-1px)"}}
                transition="all 0.15s"
                onClick={() => setSide("yes")}
              >
                <HStack justify="space-between" w="full" px={2}>
                  <Text>Yes</Text>
                  <Text fontSize="13px" opacity={0.85}>{yesChance}%</Text>
                </HStack>
              </Button>
              <Button
                w="full" h="52px" borderRadius="12px" fontSize="15px" fontWeight="700"
                color="white" border="2px solid"
                bg={side === "no" ? "#EF4444" : "transparent"}
                borderColor={side === "no" ? "#EF4444" : "rgba(239,68,68,0.3)"}
                _hover={{bg:"#EF4444", borderColor:"#EF4444", transform:"translateY(-1px)"}}
                transition="all 0.15s"
                onClick={() => setSide("no")}
              >
                <HStack justify="space-between" w="full" px={2}>
                  <Text>No</Text>
                  <Text fontSize="13px" opacity={0.85}>{noChance}%</Text>
                </HStack>
              </Button>
            </VStack>

            <Divider borderColor="rgba(255,255,255,0.06)"/>

            {/* AMOUNT INPUT */}
            <VStack spacing={2} align="start">
              <Text fontSize="12px" color="#A1A7B3" fontWeight="600">Amount (USDT)</Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none" h="44px">
                  <Text fontSize="14px" color="#64748B">$</Text>
                </InputLeftElement>
                <Input
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g,""))}
                  placeholder="0.00"
                  h="44px" borderRadius="10px"
                  bg="#252A33" border="1px solid rgba(255,255,255,0.08)"
                  color="#F8F9FA" fontSize="15px" fontWeight="600"
                  _placeholder={{color:"#64748B"}}
                  _focus={{borderColor:"#1652F0", boxShadow:"0 0 0 3px rgba(22,82,240,0.2)", outline:"none"}}
                />
              </InputGroup>
              {/* Quick amounts */}
              <HStack spacing={2}>
                {["10","50","100","500"].map(v => (
                  <Button key={v} size="xs" h="26px" px={2} borderRadius="6px"
                    bg={amount === v ? "#1652F0" : "#252A33"}
                    color={amount === v ? "white" : "#A1A7B3"}
                    border="1px solid"
                    borderColor={amount === v ? "#1652F0" : "rgba(255,255,255,0.08)"}
                    _hover={{bg:"#1652F0", color:"white", borderColor:"#1652F0"}}
                    fontSize="11px" fontWeight="600" transition="all 0.12s"
                    onClick={() => setAmount(v)}
                  >${v}</Button>
                ))}
              </HStack>
            </VStack>

            {/* POTENTIAL WIN */}
            {potentialWin && side && (
              <Box bg="#252A33" borderRadius="10px" p={3}>
                <HStack justify="space-between">
                  <Text fontSize="12px" color="#A1A7B3">Potential win</Text>
                  <Text fontSize="14px" fontWeight="800"
                    color={side === "yes" ? "#10B981" : "#EF4444"}
                  >${potentialWin}</Text>
                </HStack>
              </Box>
            )}

            {/* SUBMIT */}
            <Button
              w="full" h="48px" borderRadius="12px" fontSize="15px" fontWeight="700"
              color="white"
              bg={
                !side || !amount ? "#252A33" :
                side === "yes" ? "#10B981" : "#EF4444"
              }
              _hover={{
                opacity: side && amount ? 0.9 : 1,
                transform: side && amount ? "translateY(-1px)" : "none",
              }}
              isDisabled={!side || !amount}
              transition="all 0.15s"
              onClick={() => {
                if (side && amount && onBet) {
                  onBet(side, parseFloat(amount));
                }
              }}
            >
              {!side ? "Select Yes or No" : `Bet ${side === "yes" ? "Yes" : "No"}${amount ? ` · $${amount}` : ""}`}
            </Button>

            <Text fontSize="11px" color="#64748B" textAlign="center">
              Powered by Polygon • Non-custodial
            </Text>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes livePulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.5;transform:scale(1.3)}
        }
      `}</style>
    </Box>
  );
}
