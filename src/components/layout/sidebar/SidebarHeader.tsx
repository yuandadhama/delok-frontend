import { OrganizationSwitcher } from "@/src/components/layout/sidebar/OrganizationSwitcher";

type SidebarHeaderProps = {
  organizationSlug: string;
  organizationName: string;
  collapsed: boolean;
};

export function SidebarHeader({
  organizationSlug,
  organizationName,
  collapsed,
}: SidebarHeaderProps) {
  return (
    <div
      className={`border-b border-border px-3 py-4 flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}
    >
      {!collapsed ? (
        <OrganizationSwitcher
          organizationSlug={organizationSlug}
          organizationName={organizationName}
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
          {organizationName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
