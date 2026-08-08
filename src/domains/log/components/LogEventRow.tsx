"use client";

import { ChevronRight, FileJson, MessageSquare } from "lucide-react";

import type { LogEvent } from "../types/log.type";

type LogEventRowProps = {
  log: LogEvent;
  onClick: () => void;
};

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
    case "fatal":
      return "text-danger";

    case "warn":
      return "text-yellow-500";

    case "debug":
      return "text-muted-foreground";

    default:
      return "text-primary";
  }
}

export function LogEventRow({ log, onClick }: LogEventRowProps) {
  const hasMessage = Boolean(log.message);
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  const hasDetails = hasMessage || hasPayload;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-left border-b border-border/50 hover:bg-surface-hover transition-colors"
    >
      <span className="w-20 shrink-0 text-[11px] font-mono text-muted-foreground">
        {formatTime(log.occurredAt)}
      </span>

      <span
        className={`w-14 shrink-0 text-[11px] font-semibold uppercase ${getLevelClass(
          log.level,
        )}`}
      >
        {log.level}
      </span>

      <span className="w-36 shrink-0 truncate text-xs font-mono text-muted-foreground">
        {log.environment}
      </span>

      <span className="min-w-0 flex-1 truncate text-xs text-foreground">
        {log.event}
      </span>

      {hasDetails && (
        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {hasMessage && <MessageSquare className="h-3.5 w-3.5" />}

          {hasPayload && <FileJson className="h-3.5 w-3.5" />}
        </span>
      )}

      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}
