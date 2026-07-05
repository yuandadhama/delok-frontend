"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { signUpSchema } from "@/src/features/auth/schema";
import { authClient } from "@/src/lib/auth-client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const page = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const signInGoogle = async () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000/dashboard",
    });
  };

  const signInGithub = async () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000/dashboard",
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      setErrors({});

      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = signUpSchema.safeParse({
        name,
        email,
        password,
      });

      if (!result.success) {
        const error = Object.fromEntries(
          result.error.issues.map((issue) => [issue.path[0], issue.message]),
        );

        setErrors(error);
        console.log(typeof error);
        console.table(error);

        return;
      }

      await authClient.signUp.email({
        name,
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (ctx) => {
            setErrors({
              email: ctx.error.message,
            });
          },
        },
      });
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4 ">
        <h1>Test authentication</h1>
        {isLoading ? "loading" : "not loading"}
        {/* email sign up */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          <Input
            label="Name"
            name="name"
            placeholder="Alan Turing"
            error={errors.name}
          />

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

          <button
            type="submit"
            className="bg-green-500 mt-6 text-white p-2 rounded hover:opacity-80 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "submitting . . ." : "Sign up with email"}
          </button>
        </form>

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
