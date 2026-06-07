import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .email("Invalid email")
    .min(1, "Email is required")
    .refine((e) => e.endsWith(".ac.th") || e.endsWith(".edu"), {
      message: "Must be a university email",
    }),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Digits only"),
});

export type EmailInput = z.infer<typeof emailSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
