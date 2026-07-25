"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const emailSchema = z.string().email();

export default function AuthErrorPage() {
  const params = useSearchParams();
  const router = useRouter();

  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const resendVerification = async () => {
    // Validate format locally first -- no point hitting the backend for an
    // obviously malformed email.
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setFieldError("Please enter a valid email");
      return;
    }

    setFieldError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/resend-verification",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: result.data,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setCountdown(60);
        return;
      }

      if (response.status === 429) {
        setFieldError(data.message);
        return;
      }

      setFieldError("Something went wrong. Please try again.");
    } catch {
      setFieldError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error !== "account_not_linked") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
          <h1 className="text-xl font-semibold">Authentication Error</h1>

          <p className="mt-3 text-slate-500">Something went wrong.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mt-6 text-center text-2xl font-semibold text-slate-900">
          Verify your email
        </h1>

        <p className="mt-3 text-center text-sm text-slate-500 leading-6">
          The Google account you&apos;re trying to use is associated with an
          email address that hasn&apos;t been verified yet. Enter your email
          below and we&apos;ll send another verification email.
        </p>

        {success ? (
          <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 text-center">
            If an account requiring email verification exists, we&apos;ve sent a
            new verification email.
          </div>
        ) : (
          <div className="mt-6">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError(null);
              }}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
            {fieldError && (
              <p className="mt-1.5 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        )}

        <button
          disabled={loading || countdown > 0}
          onClick={resendVerification}
          className="mt-6 w-full rounded-lg cursor-pointer bg-slate-900 py-3 text-white font-medium transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Sending..."
            : countdown > 0
              ? `Resend in ${countdown}s`
              : "Send verification email"}
        </button>

        <button
          onClick={() => router.push("/sign-in")}
          className="mt-3 w-full rounded-lg border cursor-pointer py-3 font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Sign In
        </button>
      </div>
    </main>
  );
}
