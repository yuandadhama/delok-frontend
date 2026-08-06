export default function VerifyEmailCard() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Check your email</h1>

      <p className="mt-3 text-muted-foreground">
        We have sent a verification link to your email address.
      </p>

      <p className="mt-3 text-muted-foreground">
        Please open your inbox and click the verification link.
      </p>
    </div>
  );
}
