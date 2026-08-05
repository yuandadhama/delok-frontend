import { SignUpForm } from "@/src/domains/auth";

export default function Page() {
  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-background
      p-6
    "
    >
      <SignUpForm />
    </main>
  );
}
