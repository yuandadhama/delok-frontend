// ./src/views/auth/ResetPasswordPage.tsx

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";

import { ResetPasswordForm } from "@/src/domains/auth";
import { ROUTES } from "@/src/constants/routes";

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm
        onSuccess={() => router.push(`${ROUTES.AUTH.SIGN_IN}?reset=success`)}
      />
    </Suspense>
  );
}
