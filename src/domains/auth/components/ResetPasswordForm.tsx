// ./src/domains/auth/components/ResetPasswordForm.tsx

"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";
import { useResetPassword } from "../hooks/useResetPassword";

type ResetPasswordFormProps = {
  /** Invoked after successful reset; the view owns navigation. */
  onSuccess?: () => void;
};

export default function ResetPasswordForm({
  onSuccess,
}: ResetPasswordFormProps = {}) {
  const { token, errors, formError, isLoading, submit } = useResetPassword({
    onSuccess,
  });

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard title="Invalid reset link">
          <p className="text-center text-sm text-muted-foreground">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="mt-6 text-center">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your new password"
        subtitle="Enter your new password below"
      >
        {formError && (
          <div className="mb-4 rounded-md border border-danger bg-danger/10 p-3 text-sm text-danger">
            {formError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Input
            id="password"
            label="New password"
            name="password"
            type="password"
            placeholder="*********"
            error={errors.password}
          />

          <Input
            id="confirmPassword"
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="*********"
            error={errors.confirmPassword}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
