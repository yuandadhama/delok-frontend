// ./app/(root)/workspace/page.tsx

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { WorkspaceTopbar } from "@/src/components/layout/topbar/WorkspaceTopbar";

import {
  GetStartedSection,
  OrganizationsPanel,
  useOrganizations,
} from "@/src/domains/organization";

import { authClient } from "@/src/lib/auth/auth-client";
import { delok } from "@/src/lib/delok";
import { ROUTES } from "@/src/constants/routes";

export default function WorkspacePage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const { organizations, isLoading } = useOrganizations();

  const hasLogged = useRef(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    if (hasLogged.current) return;

    hasLogged.current = true;

    delok.info({
      event: "user_open_workspace",
      message: "User opened workspace page",
      payload: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }, [session]);

  // Side-effect (navigation) must happen in an effect, not during render.
  useEffect(() => {
    if (sessionPending) return;
    if (session) return;

    router.push(ROUTES.AUTH.SIGN_IN);
  }, [sessionPending, session, router]);

  if (sessionPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkspaceTopbar />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Hello,{" "}
            <span className="text-primary">
              {session.user.name?.split(" ")[0] ?? "there"}
            </span>
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            Welcome back to Delok!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
          <GetStartedSection />

          <OrganizationsPanel
            organizations={organizations}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
