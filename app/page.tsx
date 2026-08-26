// ./app/page.tsx

"use client";

import { Navbar, Hero } from "@/src/components/landing";
import { authClient } from "@/src/lib/auth/auth-client";

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  if (session?.user?.id) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />
    </div>
  );
}
