import { Search } from "lucide-react";

export function SearchButton() {
  return (
    <button
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors cursor-pointer"
      title="Search (coming soon)"
    >
      <Search className="h-4 w-4" />
      <span className="hidden md:block">Search...</span>
    </button>
  );
}
