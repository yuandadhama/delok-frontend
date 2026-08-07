"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Badge, { type BadgeVariant } from "@/src/components/ui/Badge";

export type LogEvent = {
  id: string;
  projectId: string;
  environment: string;
  level: string;
  event: string;
  message: string | null;
  occurredAt: string;
  receivedAt: string;
  payload: Record<string, unknown> | null;
};

const LEVEL_ACCENT_STYLES: Record<string, string> = {
  info: "border-l-info",
  warn: "border-l-warning",
  error: "border-l-danger",
  fatal: "border-l-danger",
};

const LEVEL_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  info: "info",
  warn: "warn",
  error: "error",
  fatal: "fatal",
};

const getLevelAccentStyle = (level: string) =>
  LEVEL_ACCENT_STYLES[level.toLowerCase()] ?? "border-l-border";

const getLevelBadgeVariant = (level: string): BadgeVariant =>
  LEVEL_BADGE_VARIANTS[level.toLowerCase()] ?? "neutral";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

type LogEventRowProps = {
  logEvent: LogEvent;
};

export function LogEventRow({ logEvent }: LogEventRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasPayload =
    logEvent.payload !== null &&
    typeof logEvent.payload === "object" &&
    Object.keys(logEvent.payload).length > 0;

  return (
    <div
      className={`rounded-md border border-border border-l-[3px] ${getLevelAccentStyle(
        logEvent.level,
      )} bg-surface px-3 py-2 transition-colors hover:bg-surface-hover`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <Badge variant={getLevelBadgeVariant(logEvent.level)}>
            {logEvent.level}
          </Badge>
          <span className="truncate text-[13px] font-medium text-foreground">
            {logEvent.event}
          </span>
          <span className="shrink-0 rounded-sm bg-surface-hover px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {logEvent.environment}
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-[10px] text-muted-foreground"
          title={`Received: ${formatDate(logEvent.receivedAt)}`}
        >
          {formatDate(logEvent.occurredAt)}
        </span>
      </div>

      {logEvent.message && (
        <p className="mt-1 truncate text-[12px] leading-snug text-muted-foreground">
          {logEvent.message}
        </p>
      )}

      {hasPayload && (
        <div className="mt-1.5">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-sm cursor-pointer"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
            {expanded ? "Hide payload" : "See payload"}
          </button>
          {expanded && (
            <pre className="mt-1.5 max-h-56 overflow-auto rounded-md border border-border bg-background p-2.5 font-mono text-[10px] leading-relaxed text-foreground">
              {JSON.stringify(logEvent.payload, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
