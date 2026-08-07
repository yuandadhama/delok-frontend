"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizations } from "@/src/domains/organization";
import { authClient } from "@/src/lib/auth/auth-client";
import { ROUTES } from "@/src/constants/routes";
import { delok } from "@/src/lib/delok";
import Link from "next/link";

type TopbarProps = {
  organizationSlug: string;
  organizationName: string;
};

export default function Topbar({
  organizationSlug,
  organizationName,
}: TopbarProps) {
  const router = useRouter();
  const { organizations } = useOrganizations();
  const { data: session } = authClient.useSession();

  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const currentOrganization = organizations.find(
    (org) => org.slug === organizationSlug,
  );

  const handleLogout = () => {
    setLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.HOME);
        },
        onError: () => {
          setLoggingOut(false);
        },
      },
    });
  };

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U";

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-surface border-b border-border">
      {/* Organization switcher */}
      <div className="relative">
        <button
          onClick={() => {
            setOrgSwitcherOpen((prev) => !prev);
            setUserMenuOpen(false);
          }}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-surface-hover px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
            {organizationName.charAt(0).toUpperCase()}
          </span>
          <span className="max-w-[180px] truncate">
            {currentOrganization?.name ?? organizationName}
          </span>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {orgSwitcherOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOrgSwitcherOpen(false)}
            />
            <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-border bg-surface shadow-lg py-1.5">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Switch workspace
              </p>
              <div className="flex flex-col gap-0.5 px-1.5 pt-1">
                {organizations.length === 0 && (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">
                    No other workspaces
                  </p>
                )}
                {organizations.map((org) => {
                  const isCurrent = org.slug === organizationSlug;
                  return (
                    <Link
                      key={org.id}
                      href={ROUTES.DASHBOARD.ORGANIZATION(org.slug)}
                      onClick={() => {
                        setOrgSwitcherOpen(false);
                        delok.info({
                          event: "organization_switched",
                          message: "User switched organization",
                          payload: {
                            from: organizationSlug,
                            to: org.slug,
                          },
                        });
                      }}
                      className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors ${
                        isCurrent
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      <span className="flex items-center justify-center h-5 w-5 rounded bg-surface-hover text-[10px] font-semibold text-muted-foreground">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate">{org.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => {
            setUserMenuOpen((prev) => !prev);
            setOrgSwitcherOpen(false);
          }}
          className="flex items-center gap-2 hover:bg-surface-hover px-2 py-1.5 rounded-md transition-colors cursor-pointer"
        >
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {userInitials}
          </span>
          <span className="hidden sm:block text-xs font-medium text-foreground max-w-[120px] truncate">
            {session?.user?.name ?? "User"}
          </span>
        </button>

        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setUserMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface shadow-lg py-1.5">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {session?.user?.email ?? ""}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
