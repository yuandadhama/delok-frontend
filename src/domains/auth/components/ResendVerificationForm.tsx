"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import { useResendVerification } from "../hooks/useResendVerification";

export default function ResendVerificationForm() {
  const {
    email,
    setEmail,
    fieldError,
    setFieldError,
    loading,
    success,
    countdown,
    resendVerification,
  } = useResendVerification();

  return (
    <AuthLayout>
      <AuthCard
        title="Verify your email"
        subtitle="The Google account you're using is associated with an unverified email. Enter it below and we'll send a new verification email."
      >
        {success ? (
          <div className="rounded-md border border-success bg-success/10 p-3 text-sm text-success text-center">
            If an account requiring email verification exists, we&apos;ve sent a
            new verification email.
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError(null);
              }}
              placeholder="you@example.com"
              error={fieldError ?? undefined}
            />

            <Button
              type="button"
              className="w-full"
              disabled={loading || countdown > 0}
              onClick={resendVerification}
            >
              {loading
                ? "Sending..."
                : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Send verification email"}
            </Button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
