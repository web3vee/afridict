import React from "react";
import {
  Box, Flex, HStack, Button, Text, Menu, MenuButton, MenuList, MenuItem,
  Avatar, Badge, useDisclosure, Drawer, DrawerBody, DrawerHeader,
  DrawerOverlay, DrawerContent, DrawerCloseButton, VStack, IconButton,
  Select,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useWeb3 } from "../../hooks/useWeb3";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../i18n/I18nProvider";

function WalletButton() {
  const { account, isConnecting, connectWallet, disconnectWallet, isCorrectNetwork, switchToPolygon } = useWeb3();
  const { t } = useI18n();

  if (account) {
    return (
      <HStack spacing={2}>
        {!isCorrectNetwork && (
          <Button size="sm" colorScheme="red" onClick={switchToPolygon}>
            Wrong Network
          </Button>
        )}
        <Menu>
          <MenuButton as={Button} size="sm" variant="outline" borderColor="brand.500" color="brand.500">
            {account.slice(0, 6)}...{account.slice(-4)}
          </MenuButton>
          <MenuList bg="surface.card" borderColor="surface.border">
            <MenuItem onClick={disconnectWallet} _hover={{ bg: "surface.bg" }}>
              {t("nav.disconnect")}
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    );
  }

  return (
    <Button size="sm" isLoading={isConnecting} onClick={connectWallet}>
      {t("nav.connect_wallet")}
    </Button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="surface.card" borderBottom="1px" borderColor="surface.border" px={4} py={3} position="sticky" top={0} zIndex={100}>
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        {/* Logo */}
        <Link to="/">
          <HStack spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color="brand.500">🌍</Text>
            <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, brand.400, accent.500)" bgClip="text">
              AfriPredict
            </Text>
          </HStack>
        </Link>

        {/* Desktop Nav */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link to="/"><Text _hover={{ color: "brand.500" }}>{t("nav.markets")}</Text></Link>
          {user && <Link to="/dashboard"><Text _hover={{ color: "brand.500" }}>{t("nav.dashboard")}</Text></Link>}
          {user && <Link to="/deposit"><Text _hover={{ color: "brand.500" }}>{t("nav.deposit")}</Text></Link>}
        </HStack>

        {/* Right side */}
        <HStack spacing={3}>
          {/* Language switcher */}
          <Select
            size="xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            w="70px"
            bg="surface.bg"
            borderColor="surface.border"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="sw">SW</option>
          </Select>

          <WalletButton />

          {user ? (
            <Menu>
              <MenuButton>
                <HStack spacing={2}>
                  <Avatar size="sm" name={user.username} bg="brand.500" color="gray.900" />
                  <VStack spacing={0} align="start" display={{ base: "none", md: "flex" }}>
                    <Text fontSize="sm" fontWeight="medium">{user.username}</Text>
                    <HStack spacing={1}>
                      <Text fontSize="xs" color="gray.400">${user.balance.usdt.toFixed(2)} USDT</Text>
                      {user.kyc.status === "approved" && <Badge colorScheme="green" fontSize="2xs">KYC</Badge>}
                    </HStack>
                  </VStack>
                </HStack>
              </MenuButton>
              <MenuList bg="surface.card" borderColor="surface.border">
                <MenuItem onClick={() => navigate("/dashboard")} _hover={{ bg: "surface.bg" }}>
                  {t("nav.dashboard")}
                </MenuItem>
                <MenuItem onClick={() => navigate("/deposit")} _hover={{ bg: "surface.bg" }}>
                  {t("nav.deposit")}
                </MenuItem>
                <MenuItem onClick={logout} color="red.400" _hover={{ bg: "surface.bg" }}>
                  {t("auth.logout")}
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack display={{ base: "none", md: "flex" }}>
              <Button size="sm" variant="ghost" onClick={() => navigate("/login")}>{t("auth.login")}</Button>
              <Button size="sm" onClick={() => navigate("/register")}>{t("auth.register")}</Button>
            </HStack>
          )}

          {/* Mobile menu */}
          <IconButton
            aria-label="Menu"
            display={{ base: "flex", md: "none" }}
            icon={<Text>☰</Text>}
            variant="ghost"
            onClick={onOpen}
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="surface.card">
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px" borderColor="surface.border">AfriPredict</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start" mt={4}>
              <Link to="/" onClick={onClose}><Text>{t("nav.markets")}</Text></Link>
              {user && <Link to="/dashboard" onClick={onClose}><Text>{t("nav.dashboard")}</Text></Link>}
              {user && <Link to="/deposit" onClick={onClose}><Text>{t("nav.deposit")}</Text></Link>}
              {!user && (
                <>
                  <Button w="full" onClick={() => { navigate("/login"); onClose(); }}>{t("auth.login")}</Button>
                  <Button w="full" variant="outline" onClick={() => { navigate("/register"); onClose(); }}>{t("auth.register")}</Button>
                </>
              )}
              {user && <Button w="full" colorScheme="red" variant="ghost" onClick={logout}>{t("auth.logout")}</Button>}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
