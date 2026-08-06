import AuthCard from "./AuthCard";
import AuthLayout from "./AuthLayout";

export default function VerifyEmailCard() {
  return (
    <AuthLayout>
      <AuthCard title="Check your email">
        <p className="text-center text-sm text-muted-foreground leading-6">
          We have sent a verification link to your email address.
        </p>

        <p className="mt-3 text-center text-sm text-muted-foreground leading-6">
          Please open your inbox and click the verification link to activate
          your account.
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
