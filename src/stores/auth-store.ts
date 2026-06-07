import { create } from "zustand";

interface AuthUser {
  profileCompleted: boolean;
}

interface AuthStore {
  accessToken: string | null;
  user: AuthUser | null;
  pendingEmail: string | null; // holds email between OTP steps
  setTokens: (accessToken: string, user: AuthUser) => void;
  setPendingEmail: (email: string) => void;
  clearPendingEmail: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  pendingEmail: null,

  setTokens: (accessToken, user) => set({ accessToken, user }),

  setPendingEmail: (email) => set({ pendingEmail: email }),
  clearPendingEmail: () => set({ pendingEmail: null }),

  logout: () => set({ accessToken: null, user: null, pendingEmail: null }),
}));
