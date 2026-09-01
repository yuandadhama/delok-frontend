// ./app/page.tsx

"use client";

import {
  Navbar,
  Hero,
  LogInvestigationSection,
  ProjectsAwarenessSection,
  FindSignalSection,
  GetStartedSection,
  Footer,
} from "@/src/components/landing";
import { authClient } from "@/src/lib/auth/auth-client";

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || session?.user?.id) {
    return;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Hero />
      <LogInvestigationSection />
      <ProjectsAwarenessSection />
      <FindSignalSection />
      <GetStartedSection />
      <Footer />
    </div>
  );
}
