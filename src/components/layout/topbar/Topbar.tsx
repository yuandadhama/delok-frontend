"use client";

import { authClient } from "@/src/lib/auth/auth-client";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserMenu } from "./UserMenu";
import { SearchButton } from "./SearchButton";

type TopbarProps = {
  organizationSlug: string;
  organizationName: string;
};

export function Topbar({ organizationSlug, organizationName }: TopbarProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-surface border-b border-border">
      <div className="flex items-center gap-3">
        <OrganizationSwitcher
          organizationSlug={organizationSlug}
          organizationName={organizationName}
        />
        <SearchButton />
      </div>

      <UserMenu
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </header>
  );
}
