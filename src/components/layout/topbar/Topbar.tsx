// ./src/components/layout/topbar/Topbar.tsx

"use client";

import { authClient } from "@/src/lib/auth/auth-client";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserMenu } from "./UserMenu";

type TopbarProps = {
  organizationSlug: string;
  organizationName: string;
};

export function Topbar({ organizationSlug, organizationName }: TopbarProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="h-14 z-999 flex items-center justify-between pr-9 pl-3 text-primary-foreground">
      <OrganizationSwitcher
        organizationSlug={organizationSlug}
        organizationName={organizationName}
      />

      <UserMenu
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </header>
  );
}
