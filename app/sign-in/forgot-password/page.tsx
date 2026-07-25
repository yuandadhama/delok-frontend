"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";

const page = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevent double submit
    if (loading || countdown > 0) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "http://localhost:3000/sign-in/reset-password",
      });

      console.log(`data: ${JSON.stringify(data)}`);
      console.log(`error: ${JSON.stringify(error)}`);

      if (error) {
        /**
         * Better Auth error handling
         *
         * Example:
         * - rate limit
         * - invalid request
         * - internal error
         */
        setErrorMessage(
          error.message ?? "Something went wrong. Please try again.",
        );

        return;
      }

      setSent(true);

      // cooldown after successful request
      setCountdown(60);
    } catch (error) {
      console.error(error);

      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        {sent && (
          <div className="w-full max-w-sm rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Check your email for reset instructions.
          </div>
        )}

        {errorMessage && (
          <div className="w-full max-w-sm rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          <Input
            name="email"
            label="Input your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            placeholder="email"
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
};

export default page;
