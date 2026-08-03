"use client";

import Link from "next/link";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

import AuthCard from "./AuthCard";
import SocialLogin from "./SocialLogin";
import { useSignUp } from "../hooks/useSignUp";

export default function SignUpForm() {
  const { form, submit } = useSignUp();

  return (
    <AuthCard title="Get started with Delok">
      <form onSubmit={submit} className="space-y-4">
        {form.formState.errors.root && (
          <div
            className="
            rounded-md
            border
            border-danger
            bg-danger/10
            p-3
            text-danger
          "
          >
            {form.formState.errors.root.message}
          </div>
        )}

        <Input
          label="Name"
          placeholder="Alan Turing"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="alan@turing.com"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button className="w-full" loading={form.formState.isSubmitting}>
          Create Account
        </Button>
      </form>

      <SocialLogin />

      <p className="text-sm mt-6 text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary">
          Sign In
        </Link>
      </p>
    </AuthCard>
  );
}
