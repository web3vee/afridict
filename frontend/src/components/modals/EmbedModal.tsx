import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Box, Button, HStack, Input, Switch, Text, Textarea, VStack,
  useColorModeValue, useToast,
} from '@chakra-ui/react';

interface EmbedModalProps {
  market: any | null;
  onClose: () => void;
}

export default function EmbedModal({ market, onClose }: EmbedModalProps) {
  const toast = useToast();
  const [embedTheme,   setEmbedTheme]   = useState('dark');
  const [embedBorder,  setEmbedBorder]  = useState(true);
  const [embedWidth,   setEmbedWidth]   = useState('600');
  const [embedHeight,  setEmbedHeight]  = useState('300');
  const [embedChart,   setEmbedChart]   = useState(true);
  const [embedBuyBtns, setEmbedBuyBtns] = useState(true);
  const [embedVolume,  setEmbedVolume]  = useState(true);
  const [embedLive,    setEmbedLive]    = useState(true);
  const [showCode,     setShowCode]     = useState(false);

  const modalBg        = useColorModeValue('white', '#111827');
  const textColor      = useColorModeValue('gray.900', 'white');
  const borderColor    = useColorModeValue('#e2e8f0', '#374151');
  const borderMd       = useColorModeValue('#cbd5e1', '#334155');
  const pageBg         = useColorModeValue('#f8fafc', '#070b14');
  const navBg          = useColorModeValue('#ffffff', '#0f172a');
  const previewBg      = useColorModeValue('gray.50', '#0d1117');
  const rowDivider     = useColorModeValue('gray.100', '#1f2937');
  const viewCodeBg     = useColorModeValue('gray.900', '#1f2937');
  const viewCodeHover  = useColorModeValue('gray.700', '#374151');
  const subtleColor    = useColorModeValue('gray.600', 'gray.400');
  const codeColor      = useColorModeValue('gray.700', '#9ca3af');
  const inputBorderClr = useColorModeValue('gray.300', '#374151');

  const handleClose = () => { setShowCode(false); onClose(); };

  const buildEmbedSrc = (m: any) => {
    if (!m) return '';
    const params = new URLSearchParams({
      id: String(m.id), title: m.title, yes: String(m.yesOdds),
      no: String(m.noOdds), pool: String(m.pool), category: m.category,
      theme: embedTheme, border: String(embedBorder),
      chart: String(embedChart), buybtns: String(embedBuyBtns),
      volume: String(embedVolume), live: String(embedLive),
    });
    return `${window.location.origin}/embed.html?${params.toString()}`;
  };

  const generateEmbedCode = (m: any) => {
    if (!m) return '';
    const base = window.location.origin;
    const marketUrl = `${base}/?market=${m.id}`;
    const yp = Math.round((1 / m.yesOdds) / ((1 / m.yesOdds) + (1 / m.noOdds)) * 100);
    const np = 100 - yp;
    return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${m.title}",
  "description": "Prediction market: Yes ${yp}% · No ${np}% on Afridict.",
  "url": "${marketUrl}",
  "publisher": { "@type": "Organization", "name": "Afridict", "url": "${base}" }
}
<\/script>
<figure
  class="afridict-embed"
  id="afridict-market-${m.id}"
  aria-label="Afridict prediction market: ${m.title}"
  itemscope itemtype="https://schema.org/WebPage"
  style="position:relative;display:inline-block;margin:0">
  <iframe
    title="${m.title} — Afridict Prediction Market"
    src="${buildEmbedSrc(m)}"
    width="${embedWidth}" height="${embedHeight}"
    frameborder="0" allowtransparency="true">
  </iframe>
  <a href="${marketUrl}" aria-label="View on Afridict" target="_blank" rel="noopener"
    style="position:absolute;top:12px;right:14px;width:110px;height:22px;z-index:10"></a>
  <figcaption style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">
    <strong>${m.title}</strong><br>Yes ${yp}% · No ${np}%<br>
    <a href="${marketUrl}">View full market &amp; trade on Afridict</a>
  </figcaption>
</figure>`;
  };

  const TOGGLES = [
    { label: 'Chart',         val: embedChart,            set: setEmbedChart },
    { label: 'Buy buttons',   val: embedBuyBtns,          set: setEmbedBuyBtns },
    { label: 'Volume',        val: embedVolume,            set: setEmbedVolume },
    { label: 'Live activity', val: embedLive,              set: setEmbedLive },
    { label: 'Border',        val: embedBorder,            set: setEmbedBorder },
    { label: 'Dark mode',     val: embedTheme === 'dark',  set: (v: boolean) => setEmbedTheme(v ? 'dark' : 'light') },
  ];

  return (
    <Modal isOpen={!!market} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent bg={modalBg} color={textColor} maxH="95vh" overflowY="auto">
        <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
          <HStack spacing={2}>
            <Text>&lt;/&gt;</Text>
            <Text>Embed</Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">ⓘ</Text>
          </HStack>
          <Text fontSize="sm" color={subtleColor} fontWeight="normal" mt={1}>
            Embed a live, interactive Afridict widget on your website. Customize the appearance, then copy the code to add it to your site.
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0}>
          {!showCode ? (
            <HStack align="stretch" spacing={0} minH="420px">
              {/* Left: toggles */}
              <VStack align="stretch" spacing={0} w="260px" flexShrink={0}
                borderRight="1px solid" borderColor={borderMd} p={6}>
                {TOGGLES.map(({ label, val, set }) => (
                  <HStack key={label} justify="space-between" py={3}
                    borderBottom="1px solid" borderColor={rowDivider}>
                    <Text fontSize="sm">{label}</Text>
                    <Switch isChecked={val} onChange={() => set(!val)} colorScheme="blue" />
                  </HStack>
                ))}
                <Box pt={6} mt="auto">
                  <Button w="full" size="md" bg={viewCodeBg} color="white"
                    _hover={{ bg: viewCodeHover }}
                    leftIcon={<Text fontSize="sm">&lt;/&gt;</Text>}
                    onClick={() => setShowCode(true)}>
                    View Code
                  </Button>
                </Box>
              </VStack>

              {/* Right: live preview */}
              <VStack flex={1} align="center" justify="center" p={8} spacing={4} bg={previewBg}>
                {market && (
                  <Box borderRadius="14px" overflow="hidden" boxShadow="0 8px 32px rgba(0,0,0,0.4)"
                    border={embedBorder ? '1px solid #2d3748' : 'none'}
                    w={`${embedWidth}px`} h={`${embedHeight}px`} flexShrink={0}>
                    <iframe
                      key={`${embedTheme}-${embedBorder}-${embedChart}-${embedBuyBtns}-${embedVolume}-${embedLive}`}
                      title="Embed preview"
                      src={buildEmbedSrc(market)}
                      width={Number(embedWidth)}
                      height={Number(embedHeight)}
                      style={{ display: 'block', border: 'none' }}
                    />
                  </Box>
                )}
                <HStack spacing={4}>
                  <VStack spacing={1}>
                    <Input size="sm" type="number" value={embedHeight}
                      onChange={(e) => setEmbedHeight(e.target.value)}
                      w="70px" textAlign="center" bg={navBg} borderColor={inputBorderClr} />
                    <Text fontSize="10px" color="gray.400">H</Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Input size="sm" type="number" value={embedWidth}
                      onChange={(e) => setEmbedWidth(e.target.value)}
                      w="70px" textAlign="center" bg={navBg} borderColor={inputBorderClr} />
                    <Text fontSize="10px" color="gray.400">W</Text>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          ) : (
            <VStack align="stretch" spacing={0}>
              <HStack px={6} py={4} borderBottom="1px solid" borderColor={borderMd} justify="space-between">
                <Button size="sm" variant="ghost" leftIcon={<Text>←</Text>} onClick={() => setShowCode(false)}>
                  Back
                </Button>
                <Text fontSize="sm" color={subtleColor}>Copy and paste this code into your website</Text>
                <Button size="sm" colorScheme="blue" variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(generateEmbedCode(market));
                    toast({ title: '✅ Copied!', status: 'success', duration: 1800 });
                  }}>
                  Copy ⧉
                </Button>
              </HStack>
              <Box p={6}>
                <Textarea value={generateEmbedCode(market)} readOnly rows={18}
                  fontFamily="'Fira Code', 'Courier New', monospace"
                  fontSize="11.5px" bg={pageBg} borderColor={borderMd}
                  color={codeColor} resize="none" _focus={{ boxShadow: 'none' }} />
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
