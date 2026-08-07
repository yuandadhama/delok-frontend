import Image from "next/image";
import DelokTextLogo from "@/public/delok-light-teks_logo.webp";
import DelokLogo from "@/public/delok-light-logo.webp";

type SidebarHeaderProps = {
  organizationName: string;
  collapsed: boolean;
};

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="px-4 py-4 border-b border-border flex items-center gap-2.5">
      {!collapsed ? (
        <Image
          src={DelokTextLogo}
          alt="Delok Logo"
          width={100}
          className="text-sm font-semibold text-foreground truncate tracking-tight mb-0.5"
        />
      ) : (
        <Image
          src={DelokLogo}
          alt="Delok Logo"
          width={100}
          className="text-sm font-semibold text-foreground truncate tracking-tight mb-0.5"
        />
      )}
    </div>
  );
}
