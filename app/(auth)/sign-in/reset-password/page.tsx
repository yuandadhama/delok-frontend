"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { resetPasswordSchema } from "@/src/domains/auth/schemas/auth.schema";
import { authClient } from "@/src/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { z } from "zod";

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
type ResetPasswordErrors = Partial<Record<keyof ResetPasswordForm, string>>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  const [errors, setErrors] = useState<ResetPasswordErrors>({});

  // Store form error from backend
  const [formError, setFormError] = useState("");

  // Loading state while submitting form
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

      const { data } = await authClient.resetPassword({
        newPassword: password,
        token,
        fetchOptions: {
          onError: (ctx) => {
            setFormError(ctx.error.message);
          },
          onSuccess: () => {
            router.push("/sign-in?reset=success");
          },
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="mb-6 font-bold">Create your new password</h1>
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {formError}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          <Input
            label="New password"
            name="password"
            type="password"
            placeholder="*********"
            error={errors.password}
          />

          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="*********"
            error={errors.confirmPassword}
          />

          <Button type="submit" className="bg-green-600" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
