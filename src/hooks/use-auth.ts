import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { requestAuthCode, verifyCode } from "@/services/auth-service";

export function useRequestCode(type: "login" | "signup") {
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  return useMutation({
    mutationFn: (email: string) => requestAuthCode(type, email),
    onSuccess: (_, email) => setPendingEmail(email),
  });
}

export function useVerifyCode() {
  const { setTokens, clearPendingEmail } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyCode(email, code),
    onSuccess: (data) => {
      setTokens(data.access_token, data.profileCompleted);
      clearPendingEmail();
      router.push(data.profileCompleted ? "/discover" : "/matches");
    },
  });
}
