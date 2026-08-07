"use client";

import { Search, X } from "lucide-react";

type LogFiltersProps = {
  search: string;
  level: string;
  environment: string;
  from: string;
  to: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClearFilters: () => void;
};

const FIELD =
  "rounded-md border border-border bg-surface text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

export function LogFilters({
  search,
  level,
  environment,
  from,
  to,
  hasActiveFilters,
  onSearchChange,
  onLevelChange,
  onEnvironmentChange,
  onFromChange,
  onToChange,
  onClearFilters,
}: LogFiltersProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface p-2 shadow-sm">
      <div className="relative min-w-45 flex-1">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
        <input
          aria-label="Search logs"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search event or message…"
          className={`${FIELD} w-full py-1.5 pl-8 pr-2.5`}
        />
      </div>

      <select
        aria-label="Filter by level"
        value={level}
        onChange={(e) => onLevelChange(e.target.value)}
        className={`${FIELD} px-2 py-1.5 text-foreground`}
      >
        <option value="">All levels</option>
        <option value="info">Info</option>
        <option value="warn">Warn</option>
        <option value="error">Error</option>
        <option value="fatal">Fatal</option>
      </select>

      <select
        aria-label="Filter by environment"
        value={environment}
        onChange={(e) => onEnvironmentChange(e.target.value)}
        className={`${FIELD} px-2 py-1.5 text-foreground`}
      >
        <option value="">All environments</option>
        <option value="development">Development</option>
        <option value="staging">Staging</option>
        <option value="production">Production</option>
      </select>

      <input
        aria-label="From date"
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className={`${FIELD} px-2 py-1.5`}
      />

      <input
        aria-label="To date"
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className={`${FIELD} px-2 py-1.5`}
      />

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
