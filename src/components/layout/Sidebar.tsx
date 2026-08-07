"use client";

import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { delok } from "@/src/lib/delok";

type SidebarProps = {
  organizationSlug: string;
  organizationName: string;
};

type NavItem = {
  label: string;
  href: (slug: string) => string;
  isActive: (pathname: string, slug: string) => boolean;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: (slug: string) => ROUTES.DASHBOARD.ORGANIZATION(slug),
    isActive: (pathname: string, slug: string) => {
      return (
        pathname === ROUTES.DASHBOARD.ORGANIZATION(slug) ||
        pathname.startsWith(`${ROUTES.DASHBOARD.ORGANIZATION(slug)}/project`)
      );
    },
  },
  {
    label: "Projects",
    href: (slug: string) => ROUTES.DASHBOARD.ORGANIZATION(slug),
    isActive: (pathname: string, slug: string) =>
      pathname.includes(`/project/`),
  },
  {
    label: "Members",
    href: () => "#",
    isActive: (_pathname: string, _slug: string) => false,
    disabled: true,
  },
  {
    label: "Settings",
    href: (slug: string) => ROUTES.DASHBOARD.ORGANIZATION_SETTINGS(slug),
    isActive: (pathname: string, slug: string) =>
      pathname === ROUTES.DASHBOARD.ORGANIZATION_SETTINGS(slug),
  },
];

export default function Sidebar({
  organizationSlug,
  organizationName,
}: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = (label: string) => {
    delok.info({
      event: "sidebar_nav_clicked",
      message: `Sidebar navigation clicked: ${label}`,
      payload: {
        organizationSlug,
        section: label,
      },
    });
  };

  return (
    <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col">
      {/* Organization name/logo at top */}
      <div className="px-4 py-4 border-b border-border">
        <p className="text-[11px] font-mono text-muted-foreground mb-1">
          Workspace
        </p>
        <h1 className="text-sm font-semibold text-foreground truncate tracking-tight">
          {organizationName}
        </h1>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-3">
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname, organizationSlug);
          const href = item.href(organizationSlug);

          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground/50 rounded-md cursor-not-allowed"
                title="Coming soon"
              >
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={href}
              onClick={() => handleNavClick(item.label)}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: back to dashboard */}
      <div className="px-2 py-3 border-t border-border">
        <Link
          href={ROUTES.DASHBOARD.ROOT}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground rounded-md hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          ← All workspaces
        </Link>
      </div>
    </aside>
  );
}
