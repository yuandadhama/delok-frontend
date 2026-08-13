// ./src/components/layout/topbar/OrganizationsTopbar.tsx

"use client";

import { authClient } from "@/src/lib/auth/auth-client";
import { UserMenu } from "./UserMenu";
import Image from "next/image";
import DelokTextLogo from "@/public/delok-light-teks_logo.webp";

export function OrganizationsTopbar() {
  const { data: session } = authClient.useSession();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <Image src={DelokTextLogo} alt="Delok Logo" width={90} />

      <UserMenu
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
    </header>
  );
}
