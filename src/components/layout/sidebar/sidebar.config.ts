import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href: (slug: string) => string;
  isActive: (pathname: string, slug: string) => boolean;
  disabled?: boolean;
  permission?: string;
  badge?: string;
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: (slug: string) => ROUTES.WORKSPACE.ORGANIZATION(slug),
    isActive: (pathname: string, slug: string) =>
      pathname === ROUTES.WORKSPACE.ORGANIZATION(slug),
    disabled: true,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: (slug: string) => ROUTES.WORKSPACE.PROJECTS(slug),
    isActive: (pathname: string, slug: string) =>
      pathname.startsWith(`${ROUTES.WORKSPACE.ORGANIZATION(slug)}/project`) ||
      pathname === ROUTES.WORKSPACE.PROJECTS(slug),
  },
  {
    label: "Members",
    icon: Users,
    href: () => "#",
    isActive: () => false,
    disabled: true,
  },
  {
    label: "Settings",
    icon: Settings,
    href: (slug: string) => ROUTES.WORKSPACE.ORGANIZATION_SETTINGS(slug),
    isActive: (pathname: string, slug: string) =>
      pathname === ROUTES.WORKSPACE.ORGANIZATION_SETTINGS(slug),
  },
];
