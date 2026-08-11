import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import DelokMarkLogo from "@/public/delok-light-logo.webp";
import DelokTextLogo from "@/public/delok-light-teks_logo.webp";

type SidebarHeaderProps = {
  collapsed: boolean;
  pinned: boolean;
  onToggle: () => void;
};

export function SidebarHeader({
  collapsed,
  pinned,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={`px-3 py-4 flex items-center ${
        collapsed ? "justify-center" : "justify-between"
      }`}
    >
      {collapsed ? (
        // The logo mark doubles as the re-expand control when the sidebar is
        // collapsed (tooltip + aria-label keep it discoverable/accessible).
        <button
          type="button"
          onClick={onToggle}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="flex items-center justify-center rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <Image
            src={DelokMarkLogo}
            alt=""
            aria-hidden
            width={24}
            height={24}
          />
        </button>
      ) : (
        <>
          {/* Wordmark at the same height as the toggle button. Decorative
              only - the toggle button beside it handles collapse/pin. */}
          <Image src={DelokTextLogo} alt="Delok" width={90} />

          <button
            type="button"
            onClick={onToggle}
            title={pinned ? "Collapse sidebar" : "Pin sidebar"}
            aria-label={pinned ? "Collapse sidebar" : "Pin sidebar"}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
          >
            {pinned ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </>
      )}
    </div>
  );
}
