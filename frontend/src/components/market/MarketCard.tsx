import React, { memo, useState } from "react";
import { Box, Text, HStack, VStack, Button } from "@chakra-ui/react";
import { useBookmarks } from "../../hooks/useBookmarks";
import { Bookmark } from "lucide-react";

interface MarketCardProps {
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
    featured?: boolean;
    isLive?: boolean;
    endingSoon?: boolean;
  };
  onClick?: () => void;
  onBetYes?: () => void;
  onBetNo?: () => void;
  onEmbed?: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Elections: "🗳️", elections: "🗳️",
  Sports: "⚽",    sports: "⚽",
  Music: "🎵",     music: "🎵",
  Crypto: "₿",     crypto: "₿",
  Economy: "💹",   economy: "💹",
  Commodities:"📦",commodity:"📦",
  Security: "🔒",  security: "🔒",
  Politics: "🏛️",  politics: "🏛️",
  Tech: "💻",      tech: "💻",
  Weather: "☁️",   weather: "☁️",
};

function MarketCard({ market, onClick, onBetYes, onBetNo, onEmbed }: MarketCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [hovered,    setHovered]    = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const marketId   = market.contractId ?? market.id ?? 0;
  const bookmarked = isBookmarked(marketId);

  const title = market.description || market.title || "";
  const id = market.contractId ?? market.id ?? 0;

  const total = (market.yesPool ?? 0) + (market.noPool ?? 0);
  const yesChance = total > 0
    ? Math.round((market.yesPool! / total) * 100)
    : market.yesOdds
    ? Math.round((1 / market.yesOdds) / ((1 / market.yesOdds) + (1 / (market.noOdds ?? 2))) * 100)
    : 50;
  const noChance = 100 - yesChance;

  const volume = market.totalVolume ?? market.pool ?? 0;
  const volumeLabel = volume >= 1000
    ? `$${(volume / 1000).toFixed(1)}K`
    : `$${volume.toLocaleString()}`;

  const daysLeft = market.endTime
    ? Math.max(0, Math.ceil((new Date(market.endTime).getTime() - Date.now()) / 86400000))
    : null;

  const isLive    = market.isLive ?? market.status === "open";
  const endingSoon = market.endingSoon ?? (daysLeft !== null && daysLeft <= 1);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cursor="pointer"
      position="relative"
      bg="#1C1F26"
      borderRadius="20px"
      minH="240px"
      p="20px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      boxShadow={
        hovered
          ? "0 20px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(22,82,240,0.4), 0 0 24px rgba(22,82,240,0.1)"
          : "0 10px 15px -3px rgba(0,0,0,0.3)"
      }
      transform={hovered ? "translateY(-4px)" : "translateY(0)"}
      transition="all 0.22s cubic-bezier(0.4,0,0.2,1)"
      border="1px solid"
      borderColor={hovered ? "rgba(22,82,240,0.5)" : "rgba(255,255,255,0.06)"}
    >
      {/* Glow overlay on hover */}
      {hovered && (
        <Box
          position="absolute" inset={0} borderRadius="20px" pointerEvents="none"
          background="radial-gradient(ellipse at 50% 0%, rgba(22,82,240,0.08) 0%, transparent 70%)"
        />
      )}

      {/* TOP ROW */}
      <HStack justify="space-between" mb={3} align="flex-start">
        <HStack spacing={2} flex={1}>
          {/* Category emoji */}
          <Text fontSize="18px" lineHeight="1">{CATEGORY_EMOJI[market.category] ?? "❓"}</Text>
          {/* LIVE / Ending soon tag */}
          {isLive && !endingSoon && (
            <HStack spacing={1} bg="rgba(34,211,238,0.12)" borderRadius="full" px={2} py={0.5}>
              <Box w="6px" h="6px" borderRadius="full" bg="#22D3EE"
                style={{boxShadow:"0 0 6px #22D3EE", animation:"livePulse 1.5s infinite"}}
              />
              <Text fontSize="10px" fontWeight="700" color="#22D3EE" letterSpacing="0.05em">LIVE</Text>
            </HStack>
          )}
          {endingSoon && (
            <HStack spacing={1} bg="rgba(239,68,68,0.12)" borderRadius="full" px={2} py={0.5}>
              <Text fontSize="10px" fontWeight="700" color="#EF4444">⏱ ENDING SOON</Text>
            </HStack>
          )}
        </HStack>
        {/* Category badge only */}
        <Box bg="rgba(255,255,255,0.06)" borderRadius="full" px={2} py="2px" flexShrink={0}>
          <Text fontSize="10px" fontWeight="600" color="#A1A7B3">{market.category}</Text>
        </Box>
      </HStack>

      {/* TITLE */}
      <Text
        fontSize="18px" fontWeight="700" color="#F8F9FA" lineHeight="1.35"
        mb={4} flex={1}
        style={{
          display:"-webkit-box",
          WebkitLineClamp:2,
          WebkitBoxOrient:"vertical",
          overflow:"hidden",
        }}
      >
        {title}
      </Text>

      {/* YES / NO CHANCES */}
      <HStack spacing={3} mb={3} align="center">
        <VStack spacing={0} align="center" flex={1}>
          <Text fontSize="28px" fontWeight="900" color="#10B981" lineHeight="1">{yesChance}%</Text>
          <Text fontSize="11px" color="#A1A7B3" fontWeight="600">YES chance</Text>
        </VStack>
        <Box w="1px" h="36px" bg="rgba(255,255,255,0.08)" />
        <VStack spacing={0} align="center" flex={1}>
          <Text fontSize="28px" fontWeight="900" color="#EF4444" lineHeight="1">{noChance}%</Text>
          <Text fontSize="11px" color="#A1A7B3" fontWeight="600">NO chance</Text>
        </VStack>
      </HStack>

      {/* YES / NO BUTTONS */}
      <HStack spacing={2} mb={4}>
        <Button
          flex={1} h="40px" borderRadius="10px" fontSize="13px" fontWeight="700" color="white"
          bg="#10B981" _hover={{bg:"#0ea572", transform:"translateY(-1px)"}}
          _active={{bg:"#059669"}} transition="all 0.15s"
          onClick={e => { e.stopPropagation(); onBetYes?.(); }}
        >
          YES {market.yesOdds ? `@ ${market.yesOdds}` : ""}
        </Button>
        <Button
          flex={1} h="40px" borderRadius="10px" fontSize="13px" fontWeight="700" color="white"
          bg="#EF4444" _hover={{bg:"#dc2626", transform:"translateY(-1px)"}}
          _active={{bg:"#b91c1c"}} transition="all 0.15s"
          onClick={e => { e.stopPropagation(); onBetNo?.(); }}
        >
          NO {market.noOdds ? `@ ${market.noOdds}` : ""}
        </Button>
      </HStack>

      {/* PROGRESS BAR */}
      <Box mb={4} borderRadius="full" overflow="hidden" h="4px" bg="#252A33">
        <Box
          h="full" borderRadius="full"
          style={{
            width:`${yesChance}%`,
            background:"linear-gradient(90deg, #10B981, #059669)",
            transition:"width 0.6s ease",
          }}
        />
      </Box>

      {/* BOTTOM ROW — volume + action icons */}
      <HStack justify="space-between" align="center">
        <HStack spacing={1}>
          <Text fontSize="12px" color="#A1A7B3" fontWeight="600">{volumeLabel} Vol.</Text>
        </HStack>

        <HStack spacing={3} align="center">
          {daysLeft !== null && (
            <Text fontSize="11px" color={daysLeft <= 1 ? "#EF4444" : "#64748B"} fontWeight="600">
              {daysLeft === 0 ? "Ends today" : `${daysLeft}d left`}
            </Text>
          )}

          {/* Embed </> */}
          <Box as="button" onClick={e => { e.stopPropagation(); onEmbed?.(); }}
            bg="transparent" border="none" p={0} cursor="pointer"
            color="rgba(161,167,179,0.55)" style={{ outline:'none', display:'flex', alignItems:'center' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#e2e8f0'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='rgba(161,167,179,0.55)'}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5,4 1,8 5,12" />
              <polyline points="11,4 15,8 11,12" />
            </svg>
          </Box>

          {/* Copy link */}
          <Box as="button"
            onClick={e => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${window.location.origin}/?market=${marketId}`).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 1500);
              });
            }}
            bg="transparent" border="none" p={0} cursor="pointer"
            color={linkCopied ? '#4ade80' : 'rgba(161,167,179,0.55)'}
            style={{ outline:'none', display:'flex', alignItems:'center', transition:'color .15s' }}
            onMouseEnter={e => { if (!linkCopied) (e.currentTarget as HTMLElement).style.color='#e2e8f0'; }}
            onMouseLeave={e => { if (!linkCopied) (e.currentTarget as HTMLElement).style.color='rgba(161,167,179,0.55)'; }}>
            {linkCopied ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2,8 6,12 14,4" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 9.5a3.5 3.5 0 0 0 4.95 0l2-2a3.5 3.5 0 0 0-4.95-4.95l-1 1" />
                <path d="M9.5 6.5a3.5 3.5 0 0 0-4.95 0l-2 2a3.5 3.5 0 0 0 4.95 4.95l1-1" />
              </svg>
            )}
          </Box>

          {/* Bookmark */}
          <Box as="button"
            onClick={e => {
              e.stopPropagation();
              toggleBookmark(market);
            }}
            bg="transparent" border="none" p={0} cursor="pointer"
            color={bookmarked ? '#ffd700' : 'rgba(161,167,179,0.55)'}
            style={{ outline:'none', display:'flex', alignItems:'center' }}
            onMouseEnter={e => { if (!bookmarked) (e.currentTarget as HTMLElement).style.color='#e2e8f0'; }}
            onMouseLeave={e => { if (!bookmarked) (e.currentTarget as HTMLElement).style.color='rgba(161,167,179,0.55)'; }}>
            <Bookmark size={13} strokeWidth={2} fill={bookmarked ? 'currentColor' : 'none'} />
          </Box>
        </HStack>
      </HStack>

      <style>{`
        @keyframes livePulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.5;transform:scale(1.3)}
        }
      `}</style>
    </Box>
  );
}

export default memo(MarketCard);
