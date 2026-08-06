import Link from "next/link";

import Button from "@/src/components/ui/Button";

export default function EmailVerifiedCard() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Email verified successfully</h1>
      <p className="mt-3 text-muted-foreground">
        You can now sign in to Delok.
      </p>
      <Link href={"/sign-in"} className="mt-6">
        <Button className="bg-blue-600">Sign In</Button>
      </Link>
    </div>
  );
}
