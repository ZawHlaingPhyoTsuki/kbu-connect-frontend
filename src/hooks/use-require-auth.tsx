"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user && !user.profileCompleted) router.replace("/discover");
  }, [user]);

  return user;
}
