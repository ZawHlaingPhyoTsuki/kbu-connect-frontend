"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useRequireAuth() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const profileCompleted = useAuthStore((s) => s.profileCompleted);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    } else if (accessToken && profileCompleted === false) {
      router.replace("/discover");
    }
  }, [accessToken, profileCompleted, router]);

  return { accessToken, profileCompleted };
}
