"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const { token, errors, formError, isLoading, submit } = useResetPassword();

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="mb-6 font-bold">Create your new password</h1>
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
            {formError}
          </div>
        )}
        <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-sm">
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
