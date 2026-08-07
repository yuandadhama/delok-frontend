"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarFooter } from "./SidebarFooter";

type SidebarProps = {
  organizationSlug: string;
  organizationName: string;
};

const EXPANDED_WIDTH = 178;
const COLLAPSED_WIDTH = 50;

export function Sidebar({ organizationSlug, organizationName }: SidebarProps) {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);

  const collapsed = !pinned && !hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      className="shrink-0 bg-surface border-r border-border flex flex-col transition-[width] duration-200 ease-in-out"
    >
      <SidebarHeader
        organizationName={organizationName}
        collapsed={collapsed}
      />

      <SidebarNavigation
        organizationSlug={organizationSlug}
        pathname={pathname}
        collapsed={collapsed}
      />

      <button
        onClick={() => setPinned((prev) => !prev)}
        title={pinned ? "Collapse sidebar" : "Pin sidebar"}
        className="flex items-center gap-2.5 px-3 py-2 mx-2 mb-2 text-xs font-medium text-muted-foreground rounded-md hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
      >
        {pinned ? (
          <PanelLeftClose className="h-4 w-4 shrink-0" />
        ) : (
          <PanelLeftOpen className="h-4 w-4 shrink-0" />
        )}
        {!collapsed && (
          <span className="truncate">{pinned ? "Collapse" : "Expand"}</span>
        )}
      </button>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
