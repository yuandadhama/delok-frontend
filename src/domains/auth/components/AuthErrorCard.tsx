// ./src/domains/auth/components/AuthErrorCard.tsx

import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";

export default function AuthErrorCard() {
  return (
    <AuthLayout>
      <AuthCard title="Authentication Error">
        <p className="text-center text-sm text-muted-foreground">
          Something went wrong during authentication. Please try again.
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
