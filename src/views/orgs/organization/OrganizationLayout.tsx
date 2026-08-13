// ./src/views/orgs/organization/OrganizationLayout.tsx

"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";

import { Sidebar } from "@/src/components/layout/sidebar";
import { Topbar } from "@/src/components/layout/topbar";

import { useOrganization } from "@/src/domains/organization";

type Props = {
  children: ReactNode;
};

export default function OrganizationLayout({ children }: Props) {
  const params = useParams<{
    organizationSlug: string;
  }>();

  const organizationSlug = params.organizationSlug;

  const { organization, isPending, isError } =
    useOrganization(organizationSlug);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading organization...
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar organizationSlug={organizationSlug} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          organizationSlug={organizationSlug}
          organizationName={organization.name}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
