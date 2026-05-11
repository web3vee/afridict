import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import PredictionMarketABI from "../contracts/PredictionMarket.json";
import addresses from "../contracts/addresses.json";

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  contract: ethers.Contract | null;
  usdtContract: ethers.Contract | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isCorrectNetwork: boolean;
  switchToPolygon: () => Promise<void>;
}

const POLYGON_CHAIN_ID = 137;
const MUMBAI_CHAIN_ID = 80001;
const LOCAL_CHAIN_ID = 31337;
const TARGET_CHAIN_ID = Number((addresses as any).chainId) || LOCAL_CHAIN_ID;

const USDT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [usdtContract, setUsdtContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isCorrectNetwork = chainId === TARGET_CHAIN_ID;

  const setupContracts = useCallback((signer: ethers.JsonRpcSigner) => {
    try {
      const addr = addresses as any;
      const pm = new ethers.Contract(addr.PredictionMarket, PredictionMarketABI.abi, signer);
      const usdt = new ethers.Contract(addr.MockUSDT, USDT_ABI, signer);
      setContract(pm);
      setUsdtContract(usdt);
    } catch {
      // contracts not deployed yet — wallet still connects fine
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use AfriDict");
      return;
    }
    setIsConnecting(true);
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);

      try {
        const network = await _provider.getNetwork();
        setChainId(Number(network.chainId));
        setupContracts(_signer);
      } catch {
        // node offline — wallet still connected
      }

      localStorage.setItem("walletConnected", "true");
    } catch (err) {
      console.error("Wallet connection failed:", err);
      localStorage.removeItem("walletConnected");
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [setupContracts]);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setContract(null);
    setUsdtContract(null);
    localStorage.removeItem("walletConnected");
  }, []);

  const switchToPolygon = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${POLYGON_CHAIN_ID.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
            chainName: "Polygon Mainnet",
            nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://polygon-rpc.com"],
            blockExplorerUrls: ["https://polygonscan.com"],
          }],
        });
      }
    }
  }, []);

  // Auto-reconnect (silent — no popup)
  useEffect(() => {
    if (localStorage.getItem("walletConnected") !== "true") return;
    if (!window.ethereum) return;
    (async () => {
      try {
        const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          connectWallet();
        } else {
          localStorage.removeItem("walletConnected");
        }
      } catch {
        localStorage.removeItem("walletConnected");
      }
    })();
  }, [connectWallet]);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountChange = (accounts: string[]) => {
      if (accounts.length === 0) disconnectWallet();
      else setAccount(accounts[0]);
    };
    const handleChainChange = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountChange);
    window.ethereum.on("chainChanged", handleChainChange);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
      window.ethereum?.removeListener("chainChanged", handleChainChange);
    };
  }, [connectWallet, disconnectWallet]);

  return (
    <Web3Context.Provider value={{
      provider, signer, account, chainId, contract, usdtContract,
      isConnecting, connectWallet, disconnectWallet, isCorrectNetwork, switchToPolygon,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
