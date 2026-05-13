import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';

interface User {
  id: string; email: string; username: string;
  country: string; currency: string; language: string;
  kyc: { status: string };
  balance: { usdt: number };
  totalBets: number; totalWinnings: number; referralCode: string;
}

interface RegisterData {
  email: string; password: string; username: string; country: string;
  currency?: string; language?: string; referralCode?: string;
}

// Bridges Firebase auth to the interface expected by Login / Register / Dashboard.
// No AuthProvider needed — state lives in AppContext (firebaseUser, cashBalance).
export function useAuth() {
  const { firebaseUser, cashBalance, authLoading, logout: appLogout } = useApp();

  const login = (email: string, password: string): Promise<void> =>
    signInWithEmailAndPassword(auth, email, password).then(() => undefined);

  const register = async (data: RegisterData): Promise<void> => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(cred.user, { displayName: data.username });
  };

  const user: User | null = firebaseUser
    ? {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        username: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
        country: 'Other',
        currency: 'USDT',
        language: 'en',
        kyc: { status: 'none' },
        balance: { usdt: cashBalance },
        totalBets: 0,
        totalWinnings: 0,
        referralCode: firebaseUser.uid.slice(0, 8).toUpperCase(),
      }
    : null;

  return {
    user,
    token: null as string | null,
    isLoading: authLoading,
    login,
    register,
    logout: appLogout,
    refreshUser: async () => {},
  };
}
