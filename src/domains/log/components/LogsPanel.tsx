"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { LogEventRow } from "./LogEventRow";
import { LogDetailPanel } from "./LogDetailPanel";

import type { LogEvent, LogPagination } from "../types/log.type";

type LogsPanelProps = {
  logs: LogEvent[];
  pagination: LogPagination;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;

  selectedLog: LogEvent | null;
  onSelectLog: (log: LogEvent) => void;
  onCloseDetail: () => void;
};

export function LogsPanel({
  logs,
  pagination,
  isLoading,
  page,
  onPageChange,
  selectedLog,
  onSelectLog,
  onCloseDetail,
}: LogsPanelProps) {
  return (
    <div className="flex h-full min-h-0">
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-xs font-semibold text-foreground">Logs</h2>

            <p className="text-[10px] text-muted-foreground">
              {pagination.total} total events
            </p>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-background text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
          <span className="w-20 shrink-0">Time</span>
          <span className="w-14 shrink-0">Level</span>
          <span className="w-36 shrink-0">Environment</span>
          <span className="flex-1">Event</span>
          <span className="w-8" />
        </div>

        {/* Scrollable Logs */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <p className="text-xs text-muted-foreground animate-pulse">
                Loading logs...
              </p>
            </div>
          )}

          {!isLoading && logs.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-xs text-muted-foreground">No logs found.</p>
            </div>
          )}

          {!isLoading &&
            logs.map((log) => (
              <LogEventRow
                key={log.id}
                log={log}
                onClick={() => onSelectLog(log)}
              />
            ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border">
          <span className="text-[10px] text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-md hover:bg-surface-hover disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-md hover:bg-surface-hover disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Detail Drawer */}
      {selectedLog && (
        <LogDetailPanel log={selectedLog} onClose={onCloseDetail} />
      )}
    </div>
  );
}
