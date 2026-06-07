import { api } from "@/lib/api";

export async function requestAuthCode(type: "login" | "signup", email: string) {
  const res = await api.post(`/auth/${type}`, { email });
  return res.data;
}

export async function verifyCode(email: string, code: string) {
  const res = await api.post("/auth/verify", { email, code });
  return res.data.data as {
    access_token: string;
    expiresIn: number;
    profileCompleted: boolean;
  };
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data.data as {
    access_token: string;
    expiresIn: number;
  };
}
