"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "http://localhost:3000/sign-in/reset-password",
      });

      console.log(`data: ${JSON.stringify(data)}`);
      console.log(`error: ${error}`);

      setSent(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full container flex flex-col justify-center items-center gap-4">
        {sent && <div>Check your email for reset instructions.</div>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          <Input
            name="email"
            label="Input your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />

          <Button type="submit" className="bg-green-600">
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
