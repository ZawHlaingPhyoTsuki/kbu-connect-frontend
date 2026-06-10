"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { refreshToken } from "@/services/auth-service";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const { accessToken, profileCompleted, setTokens } = useAuthStore();
  const router = useRouter();
  const [hydrating, setHydrating] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (accessToken && profileCompleted !== null) {
      setHydrating(false);
      return;
    }

    refreshToken()
      .then(({ access_token }) => {
        setTokens(access_token);
      })
      .catch(() => {
        console.log("hit");
        router.replace("/login");
      })
      .finally(() => setHydrating(false));
  }, []);

  if (hydrating) return <div className="min-h-screen animate-pulse bg-muted" />;
  if (!accessToken) return null;

  return <>{children}</>;
}
