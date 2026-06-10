"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (accessToken) router.replace("/discover");
  }, [accessToken]);

  if (accessToken) return null;

  return <>{children}</>;
}
