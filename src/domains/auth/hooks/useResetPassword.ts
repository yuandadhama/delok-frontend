"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { resetPasswordSchema } from "../schemas/auth.schema";
import type { ResetPasswordForm } from "../types/auth.type";
import { AuthService } from "../api/auth.service";

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordForm, string>>;

export function useResetPassword() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      setFormError("");
      setErrors({});

      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      const result = resetPasswordSchema.safeParse({
        password,
        confirmPassword,
      });

      if (!result.success) {
        const fieldErrors: ResetPasswordErrors = {};

        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ResetPasswordErrors;
          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);
        return;
      }

      if (!token) {
        setFormError("Invalid reset link");
        return;
      }

      const { error } = await AuthService.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setFormError(error.message ?? "Unable to reset password.");
        return;
      }

      router.push("/sign-in?reset=success");
    } catch (e) {
      console.error(e);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    errors,
    formError,
    isLoading,
    submit,
  };
}
