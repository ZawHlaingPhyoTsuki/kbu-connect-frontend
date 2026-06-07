"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRequestCode, useVerifyCode } from "@/hooks/use-auth";
import { emailSchema, otpSchema } from "@/schemas/auth-schema";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";

export function LoginForm() {
  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const requestCode = useRequestCode("login");
  const verifyCode = useVerifyCode();

  const emailForm = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: emailSchema },
    onSubmit: async ({ value }) => {
      await requestCode.mutateAsync(value.email);
    },
  });

  const otpForm = useForm({
    defaultValues: { code: "" },
    validators: { onSubmit: otpSchema },
    onSubmit: async ({ value }) => {
      await verifyCode.mutateAsync({ email: pendingEmail!, code: value.code });
    },
  });

  if (!pendingEmail) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your university email to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              emailForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <emailForm.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="you@university.ac.th"
                        autoComplete="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!emailForm.state.canSubmit || requestCode.isPending}
                >
                  {requestCode.isPending ? "Sending…" : "Send code"}
                </Button>

                {requestCode.isError && (
                  <FieldError
                    errors={[
                      (requestCode.error as any)?.response?.data?.message ??
                        "Something went wrong",
                    ]}
                  />
                )}

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            otpForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <otpForm.Field
              name="code"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Verification code
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      autoComplete="one-time-code"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={!otpForm.state.canSubmit || verifyCode.isPending}
              >
                {verifyCode.isPending ? "Verifying…" : "Verify code"}
              </Button>

              {verifyCode.isError && (
                <FieldError
                  errors={[
                    (verifyCode.error as any)?.response?.data?.message ??
                      "Invalid or expired code",
                  ]}
                />
              )}

              <FieldDescription className="text-center">
                Wrong email?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => useAuthStore.getState().clearPendingEmail()}
                >
                  Go back
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
