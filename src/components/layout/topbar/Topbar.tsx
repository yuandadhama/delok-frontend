"use client";

import { authClient } from "@/src/lib/auth/auth-client";
import { OrganizationSwitcher } from "../sidebar/OrganizationSwitcher";
import { UserMenu } from "./UserMenu";
import DelokTextLogo from "@/public/delok-light-teks_logo.webp";
import Image from "next/image";

type TopbarProps = {
  organizationSlug: string;
  organizationName: string;
};

export function Topbar({ organizationSlug, organizationName }: TopbarProps) {
  const { data: session } = authClient.useSession();

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-surface border-b border-border">
      <Image
        src={DelokTextLogo}
        alt="Delok Text Logo"
        width={120}
        height={28}
      />

      <UserMenu
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </header>
  );
}
