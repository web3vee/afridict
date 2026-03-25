import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

interface User {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  country: string;
  currency: string;
  language: string;
  kyc: { status: string };
  balance: { usdt: number };
  totalBets: number;
  totalWinnings: number;
  referralCode: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  country: string;
  currency?: string;
  language?: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem("token"));

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      refreshUser().finally(() => setIsLoading(false));
    }
  }, [token, refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post("/auth/register", data);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
