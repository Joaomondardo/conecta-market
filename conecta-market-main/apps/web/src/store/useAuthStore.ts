import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Wallet {
  id: string;
  balance: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  wallet?: Wallet;
  store?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      updateUser: (updatedUser) => set((state) => ({ user: state.user ? { ...state.user, ...updatedUser } : null })),
    }),
    {
      name: 'conecta-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
