"use client";

import Button from "@/src/components/ui/Button";
import { AuthService } from "../api/auth.service";

export default function SocialLogin() {
  return (
    <div className="space-y-3 mt-6">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => AuthService.signInGoogle()}
      >
        Continue with Google
      </Button>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => AuthService.signInGithub()}
      >
        Continue with Github
      </Button>
    </div>
  );
}
