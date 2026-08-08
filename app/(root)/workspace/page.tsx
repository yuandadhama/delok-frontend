// app/(root)/workspace/page.tsx

"use client";

import { useEffect, useRef } from "react";

import {
  CreateOrganizationModal,
  OrganizationEmptyState,
  OrganizationList,
  OrganizationListSkeleton,
  useOrganizations,
} from "@/src/domains/organization";

import { authClient } from "@/src/lib/auth/auth-client";
import { delok } from "@/src/lib/delok";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const { organizations, isLoading } = useOrganizations();

  const hasLogged = useRef(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    if (hasLogged.current) return;

    hasLogged.current = true;

    delok.info({
      event: "user_open_dashboard",
      message: "User opened dashboard page",
      payload: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }, [session]);

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return;
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Workspace</h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>

        <CreateOrganizationModal />
      </header>

      {/* Organizations */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Workspaces
          </h2>

          {!isLoading && (
            <span className="font-mono text-xs text-muted-foreground">
              {organizations.length} total
            </span>
          )}
        </div>

        {isLoading && <OrganizationListSkeleton />}

        {!isLoading && organizations.length === 0 && <OrganizationEmptyState />}

        {!isLoading && organizations.length > 0 && (
          <OrganizationList organizations={organizations} />
        )}
      </section>
    </div>
  );
}
