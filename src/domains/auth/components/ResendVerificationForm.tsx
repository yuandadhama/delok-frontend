"use client";

import { useRouter } from "next/navigation";

import { useResendVerification } from "../hooks/useResendVerification";

export default function ResendVerificationForm() {
  const router = useRouter();
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
