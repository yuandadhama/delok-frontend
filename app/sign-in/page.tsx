"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { signInSchema } from "@/src/features/auth/auth.schema";
import { authClient } from "@/src/lib/auth-client";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

// Infer TypeScript type directly from zod schema
// Result:
// {
//   email: string;
//   password: string;
// }
type SignInForm = z.infer<typeof signInSchema>;

// Create optional error object based on form fields
// Result:
// {
//   email?: string;
//   password?: string;
// }
type SignInErrors = Partial<Record<keyof SignInForm, string>>;

const page = () => {
  const router = useRouter();

  // Store validation errors for each field
  const [errors, setErrors] = useState<SignInErrors>({});

  // Store form error from backend
  const [formError, setFormError] = useState("");

  // Loading state while submitting form
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Google OAuth Sign In
   */
  const signInGoogle = async () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000/dashboard",
    });
  };

  /**
   * Github OAuth Sign In
   */
  const signInGithub = async () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000/dashboard",
    });
  };

  /**
   * Handle email sign up form
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      // Prevent browser page refresh
      e.preventDefault();

      // Start loading state
      setIsLoading(true);

      // Clear previous validation errors
      setFormError("");
      setErrors({});

      // Read form values
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Validate using zod schema
      const result = signInSchema.safeParse({
        email,
        password,
      });

      /**
       * Validation failed
       *
       * Convert:
       * [
       *   { path:["email"], message:"invalid email" }
       * ]
       *
       * Into:
       * {
       *   email:"invalid email"
       * }
       */
      if (!result.success) {
        const fieldErrors: SignInErrors = {};

        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SignInErrors;

          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);

        return;
      }

      /**
       * sign in account using Better Auth
       */
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          /**
           * Redirect after successful registration
           */
          onSuccess: () => {
            router.push("/dashboard");
          },

          /**
           * Handle backend error
           *
           * Example:
           * "invalid email or password"
           */
          onError: (ctx) => {
            if (ctx.error.message.includes("verify")) {
              router.push("/sign-in/verify-email");
              return;
            }

            setFormError(ctx.error.message);
          },
        },
      });
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    } finally {
      // Stop loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4 ">
        <h1>Test authentication</h1>

        {isLoading ? "loading" : "not loading"}
        {/* email sign up */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
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

        {/* social sign up */}
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
        <Button className="bg-black">Test login button</Button>
      </div>
    </div>
  );
};

export default page;
