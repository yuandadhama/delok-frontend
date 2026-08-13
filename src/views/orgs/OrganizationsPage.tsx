// ./src/views/orgs/OrganizationsPage.tsx

"use client";

import { useEffect, useRef } from "react";

import { useOrganizations } from "@/src/domains/organization";
import { delok } from "@/src/lib/delok";

import OrganizationsShell from "./components/OrganizationsShell";
import OrganizationsWelcome from "./components/OrganizationsWelcome";
import OrganizationsOverview from "./components/OrganizationsOverview";
import { authClient } from "@/src/lib/auth/auth-client";

export default function OrganizationsPage() {
  const { data } = authClient.useSession();
  const name = data?.user.name;
  const { organizations, isLoading } = useOrganizations();

  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;

    hasLogged.current = true;

    delok.info({
      event: "USER_OPEN_ORGANIZATIONS",
      message: "User opens organizations page",
      payload: {
        userId: data?.user.id,
        name,
      },
    });
  }, []);

  return (
    <OrganizationsShell>
      <OrganizationsWelcome name={name} />
      <OrganizationsOverview
        organizations={organizations}
        isLoading={isLoading}
      />
    </OrganizationsShell>
  );
}
