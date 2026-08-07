"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Skeleton from "@/src/components/ui/Skeleton";
import { LogEventRow, type LogEvent } from "./LogEventRow";
import { LogFilters } from "./LogFilters";

type LogsPanelProps = {
  logEvents: LogEvent[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function LogsPanel({
  logEvents,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: LogsPanelProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [environment, setEnvironment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const hasActiveFilters = Boolean(
    search || level || environment || from || to,
  );

  const filteredLogEvents = useMemo(() => {
    return logEvents.filter((logEvent) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !logEvent.event.toLowerCase().includes(q) &&
          !(logEvent.message ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (level && logEvent.level.toLowerCase() !== level) return false;
      if (environment && logEvent.environment !== environment) return false;
      if (from && new Date(logEvent.occurredAt) < new Date(from)) return false;
      if (to && new Date(logEvent.occurredAt) > new Date(to)) return false;
      return true;
    });
  }, [logEvents, search, level, environment, from, to]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const clearFilters = () => {
    setSearch("");
    setLevel("");
    setEnvironment("");
    setFrom("");
    setTo("");
  };

  return (
    <Card className="p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Logs
        </h2>
        <span className="text-[10px] text-muted-foreground/70">
          {filteredLogEvents.length} shown
        </span>
      </div>

      <LogFilters
        search={search}
        level={level}
        environment={environment}
        from={from}
        to={to}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onLevelChange={setLevel}
        onEnvironmentChange={setEnvironment}
        onFromChange={setFrom}
        onToChange={setTo}
        onClearFilters={clearFilters}
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : filteredLogEvents.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No logs found"
          description={
            hasActiveFilters
              ? "Try adjusting your filters."
              : "Logs will appear here once your project starts sending events."
          }
          className="py-8"
        />
      ) : (
        <ul className="flex flex-col gap-1.5">
          {filteredLogEvents.map((logEvent) => (
            <li key={logEvent.id}>
              <LogEventRow logEvent={logEvent} />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
          <span className="text-[10px] text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
