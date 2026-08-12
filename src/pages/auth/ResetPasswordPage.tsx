// ./src/pages/auth/ResetPasswordPage.tsx

import { Suspense } from "react";

import { ResetPasswordForm } from "@/src/domains/auth";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
