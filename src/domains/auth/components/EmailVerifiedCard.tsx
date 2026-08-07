import Link from "next/link";

import Button from "@/src/components/ui/Button";

import { ROUTES } from "@/src/constants/routes";

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";

export default function EmailVerifiedCard() {
  return (
    <AuthLayout>
      <AuthCard title="Email verified successfully">
        <p className="text-center text-sm text-muted-foreground">
          Your email has been verified. You can now sign in to Delok.
        </p>

        <div className="mt-6 text-center">
          <Link href={ROUTES.AUTH.SIGN_IN}>
            <Button className="w-full">Sign In</Button>
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
