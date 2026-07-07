"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const token = searchParam.get("token");

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Store form error from backend
  const [formError, setFormError] = useState("");

  // Loading state while submitting form
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      setFormError("");

      if (password !== confirmPassword) {
        setFormError("Password does not match");
        return;
      }

      console.log(`token: ${token}`);
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

      console.log(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
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
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm password"
            name="password"
            type="password"
            placeholder="*********"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" className="bg-green-600" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default page;
