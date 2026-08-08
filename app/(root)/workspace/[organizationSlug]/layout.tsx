"use client";

import { Sidebar } from "@/src/components/layout/sidebar";
import { Topbar } from "@/src/components/layout/topbar";
import { useOrganization } from "@/src/domains/organization";

import { useParams } from "next/navigation";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  const {
    organization,
    isPending: loadingOrg,
    isError: orgError,
  } = useOrganization(organizationSlug);

  if (loadingOrg) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Loading organization...
      </div>
    );
  }

  if (orgError || !organization) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex">
      <Sidebar
        organizationSlug={organizationSlug}
        organizationName={organization.name}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          organizationSlug={organizationSlug}
          organizationName={organization.name}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
