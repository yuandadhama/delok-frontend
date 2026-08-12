// ./src/pages/workspace/WorkspacePage.tsx

"use client";

import { useEffect, useRef } from "react";

import { useOrganizations } from "@/src/domains/organization";
import { delok } from "@/src/lib/delok";

import WorkspaceShell from "./components/WorkspaceShell";
import WorkspaceWelcome from "./components/WorkspaceWelcome";
import WorkspaceOverview from "./components/WorkspaceOverview";
import { authClient } from "@/src/lib/auth/auth-client";

export default function WorkspacePage() {
  const { data } = authClient.useSession();
  const name = data?.user.name;
  const { organizations, isLoading } = useOrganizations();

  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;

    hasLogged.current = true;

    delok.info({
      event: "USER_OPEN_WORKSPACE",
      message: "User opens workspace page",
    });
  }, []);

  return (
    <WorkspaceShell>
      <WorkspaceWelcome name={name} />
      <WorkspaceOverview organizations={organizations} isLoading={isLoading} />
    </WorkspaceShell>
  );
}
