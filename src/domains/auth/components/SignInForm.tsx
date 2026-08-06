"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import { useSignIn } from "../hooks/useSignIn";

export default function SignInForm() {
  const { errors, formError, isLoading, submit, signInGoogle, signInGithub } =
    useSignIn();

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-sm">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded">
              {formError}
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="alan@turing.com"
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="********"
            error={errors.password}
          />

          <p>
            Forgot your password?{" "}
            <Link
              href={"/sign-in/forgot-password"}
              className="text-blue-600 underline underline-offset-2"
            >
              {" "}
              reset password
            </Link>
          </p>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 mt-6"
          >
            {isLoading ? "Submitting..." : "Sign In"}
          </Button>
        </form>

        <p>
          dont have an account?
          <Link
            href={"/sign-up"}
            className="text-blue-600 underline underline-offset-2"
          >
            {" "}
            sign Up
          </Link>
        </p>

        <button
          className="bg-blue-400 text-white p-2 rounded hover:opacity-80 cursor-pointer"
          onClick={signInGoogle}
        >
          Login with google
        </button>
        <button
          className="bg-black text-white p-2 rounded hover:opacity-80 cursor-pointer"
          onClick={signInGithub}
        >
          Login with github
        </button>
      </div>
    </div>
  );
}
