// ./src/domains/log/components/LogFilters.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;

type LogFiltersProps = {
  search: string;
  level: string;
  environment: string;
  from: string;
  to: string;
  hasActiveFilters: boolean;
  totalEvents: number;
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onEnvironmentChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClearFilters: () => void;
};

const FIELD =
  "rounded-md border border-border bg-surface text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

const DATE_GROUP =
  "flex items-center rounded-md border border-border bg-surface transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20";

const DATE_INPUT =
  "bg-transparent px-2 py-1.5 text-[12.5px] text-foreground outline-none";

const LEVEL_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warn" },
  { value: "error", label: "Error" },
  { value: "fatal", label: "Fatal" },
];

const ENVIRONMENT_OPTIONS = [
  { value: "", label: "All environments" },
  { value: "development", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

function SearchField({
  value,
  onChange,
  wrapperClassName = "",
}: {
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
}) {
  return (
    <div className={`relative ${wrapperClassName}`}>
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
      </span>

      <input
        aria-label="Search logs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search event or message…"
        className={`${FIELD} w-full py-1.5 pl-8 pr-2.5`}
      />
    </div>
  );
}

function SelectField({
  ariaLabel,
  value,
  onChange,
  options,
  className = "",
}: {
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} w-full appearance-none py-1.5 pl-2.5 pr-8 text-foreground`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function DateFilterField({
  label,
  value,
  min,
  max,
  onChange,
  wrapperClassName = "",
  fill = false,
}: {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
  fill?: boolean;
}) {
  return (
    <div className={`${DATE_GROUP} ${wrapperClassName}`}>
      <span className="pl-2 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        aria-label={`${label} date`}
        type="date"
        value={value}
        min={min || undefined}
        max={max || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${DATE_INPUT} ${fill ? "min-w-0 flex-1" : ""}`}
      />
    </div>
  );
}

export function LogFilters({
  search,
  level,
  environment,
  from,
  to,
  hasActiveFilters,
  totalEvents,
  onSearchChange,
  onLevelChange,
  onEnvironmentChange,
  onFromChange,
  onToChange,
  onClearFilters,
}: LogFiltersProps) {
  const [open, setOpen] = useState(false);

  // Local draft of the search text so keystrokes are committed (and the API
  // fetched) only after the user stops typing for SEARCH_DEBOUNCE_MS.
  const [searchDraft, setSearchDraft] = useState(search);
  const searchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    searchChangeRef.current = onSearchChange;
  });

  // Keep the draft in sync when the parent resets the search (e.g. "Clear").
  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  // Debounce committing the draft to avoid an API call per keystroke.
  useEffect(() => {
    if (searchDraft === search) return;

    const timer = setTimeout(() => {
      searchChangeRef.current(searchDraft);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchDraft, search]);

  const activeCount = [search.trim(), level, environment, from, to].filter(
    Boolean,
  ).length;

  return (
    <div className="mb-3 px-3">
      {/* Compact mode (< @2xl container): collapsible filter box */}
      <div className="@2xl:hidden flex flex-wrap items-center gap-x-1 gap-y-1 rounded-md border border-border bg-surface py-1 pl-1.5 pr-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="log-filters-panel"
          onClick={() => setOpen((value) => !value)}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[12px] font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />

          <span>Filters</span>

          {activeCount > 0 && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-primary">
              {activeCount}
            </span>
          )}

          <ChevronDown
            className={`h-3 w-3 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <span className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">
          <span className="font-bold ">{totalEvents}</span>{" "}
          {hasActiveFilters ? "matching" : "total"} events
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded panel (< @2xl container, while open) */}
      {open && (
        <div
          id="log-filters-panel"
          className="@2xl:hidden mt-2 space-y-2 rounded-md border border-border bg-surface p-3"
        >
          <SearchField
            value={searchDraft}
            onChange={setSearchDraft}
          />

          <div className="grid grid-cols-2 gap-2">
            <SelectField
              ariaLabel="Filter by level"
              value={level}
              onChange={onLevelChange}
              options={LEVEL_OPTIONS}
              className="w-full"
            />

            <SelectField
              ariaLabel="Filter by environment"
              value={environment}
              onChange={onEnvironmentChange}
              options={ENVIRONMENT_OPTIONS}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <DateFilterField
              label="From"
              value={from}
              max={to}
              onChange={onFromChange}
              wrapperClassName="w-full"
              fill
            />

            <DateFilterField
              label="To"
              value={to}
              min={from}
              onChange={onToChange}
              wrapperClassName="w-full"
              fill
            />
          </div>
        </div>
      )}

      {/* Wide mode (>= @2xl container): inline toolbar */}
      <div className="hidden @2xl:flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <SearchField
          value={searchDraft}
          onChange={setSearchDraft}
          wrapperClassName="min-w-45 flex-1"
        />

        <SelectField
          ariaLabel="Filter by level"
          value={level}
          onChange={onLevelChange}
          options={LEVEL_OPTIONS}
        />

        <SelectField
          ariaLabel="Filter by environment"
          value={environment}
          onChange={onEnvironmentChange}
          options={ENVIRONMENT_OPTIONS}
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <DateFilterField
            label="From"
            value={from}
            max={to}
            onChange={onFromChange}
          />

          <DateFilterField
            label="To"
            value={to}
            min={from}
            onChange={onToChange}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
