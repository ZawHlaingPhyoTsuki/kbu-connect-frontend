import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  profileCompleted: boolean | null;
  pendingEmail: string | null; // holds email between OTP steps
  setTokens: (accessToken: string, profileCompleted?: boolean) => void;
  setPendingEmail: (email: string) => void;
  clearPendingEmail: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      profileCompleted: null,
      pendingEmail: null,

      setTokens: (accessToken, profileCompleted) =>
        set((state) => ({
          accessToken,
          profileCompleted:
            profileCompleted !== undefined
              ? profileCompleted
              : state.profileCompleted,
        })),

      setPendingEmail: (email) => set({ pendingEmail: email }),
      clearPendingEmail: () => set({ pendingEmail: null }),

      logout: () =>
        set({ accessToken: null, profileCompleted: null, pendingEmail: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        profileCompleted: state.profileCompleted,
      }),
    },
  ),
);
