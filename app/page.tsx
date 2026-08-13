// ./app/page.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";

import { ROUTES } from "@/src/constants/routes";
import { authClient } from "@/src/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.id) {
      router.push(ROUTES.ORGANIZATION.ROOT);
    }
  }, [session?.user?.id, router]);

  if (isPending || session?.user?.id) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  return (
    <div>
      <Link href={ROUTES.AUTH.SIGN_UP} className="underline text-blue-500">
        Go to sign up page
      </Link>
    </div>
  );
}
