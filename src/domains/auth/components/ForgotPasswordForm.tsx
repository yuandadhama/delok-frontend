"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const {
    email,
    setEmail,
    sent,
    countdown,
    loading,
    errors,
    formError,
    submit,
  } = useForgotPassword();

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        {sent && (
          <div className="w-full max-w-sm rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Check your email for reset instructions.
          </div>
        )}

        {formError && (
          <div className="w-full max-w-sm rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-sm">
          <Input
            name="email"
            label="Input your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            error={errors.email}
          />

          <Button
            type="submit"
            disabled={loading || countdown > 0}
            className="bg-green-600 disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
