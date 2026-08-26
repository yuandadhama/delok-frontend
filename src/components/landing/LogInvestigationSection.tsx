import { ChevronRight, FileJson, MessageSquare } from "lucide-react";

import type { LogEvent } from "@/src/domains/log";
import {
  formatLogDate,
  formatLogTime,
  formatLogTimestamp,
} from "@/src/domains/log";
import {
  INVESTIGATION_LOGS,
  SELECTED_LOG_ID,
} from "./delok-log-investigation.data";

function getLevelClass(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "text-danger";
    case "fatal":
      return "text-danger font-bold";
    case "warn":
      return "text-yellow-500";
    case "debug":
      return "text-muted-foreground";
    default:
      return "text-primary";
  }
}

// Mirrors LogEventRow tinting: fatal keeps a red wash, the selected row gets
// a white highlight border, everything else stays transparent.
function getRowTintClass(log: LogEvent) {
  if (log.id === SELECTED_LOG_ID) {
    return `border border-white ${log.level === "fatal" ? "bg-danger/10" : ""}`;
  }
  if (log.level.toLowerCase() === "fatal") {
    return "border-l-2 bg-danger/10";
  }
  return "border-l-2 border-l-transparent";
}

function StreamRow({ log }: { log: LogEvent }) {
  const isSelected = log.id === SELECTED_LOG_ID;
  const hasMessage = Boolean(log.message);
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  return (
    <div
      className={`w-full flex items-center gap-3 px-3 py-1.5 text-left border-b border-border/50 ${getRowTintClass(log)}`}
    >
      <span className="w-20 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogDate(log.occurredAt)}
      </span>

      <span className="w-16 shrink-0 text-[10px] font-mono text-muted-foreground">
        {formatLogTime(log.occurredAt)}
      </span>

      <span
        className={`w-12 shrink-0 text-[10px] font-semibold uppercase ${getLevelClass(log.level)}`}
      >
        {log.level}
      </span>

      <span className="min-w-0 flex-1 truncate text-[11px] text-foreground">
        {log.event}
      </span>

      {(hasMessage || hasPayload) && (
        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {hasMessage && <MessageSquare className="h-3.5 w-3.5" />}
          {hasPayload && <FileJson className="h-3.5 w-3.5" />}
        </span>
      )}

      {isSelected && (
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}
    </div>
  );
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-[11px] text-foreground wrap-break-word">{children}</p>
    </div>
  );
}

function DetailPanel({ log }: { log: LogEvent }) {
  const hasPayload =
    Boolean(log.payload) && Object.keys(log.payload ?? {}).length > 0;

  return (
    <div
      className="flex flex-col rounded-lg border border-border bg-surface overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            Log Details
          </p>
          <p className="text-[10px] text-muted-foreground font-mono truncate">
            {log.id}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <DetailItem label="Event">{log.event}</DetailItem>
          <DetailItem label="Level">{log.level}</DetailItem>
          <DetailItem label="Environment">{log.environment}</DetailItem>
          <DetailItem label="Occurred At">
            {formatLogTimestamp(log.occurredAt)}
          </DetailItem>
        </div>

        {log.message && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold">Message</h3>
            </div>
            <div className="rounded-md border border-border bg-background p-3 min-w-0 overflow-hidden">
              <p className="min-w-0 text-[11px] text-foreground whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
                {log.message}
              </p>
            </div>
          </section>
        )}

        {hasPayload && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FileJson className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-xs font-semibold">Payload</h3>
            </div>
            <pre className="min-w-0 overflow-x-auto rounded-md border border-border bg-background p-3 text-[10px] leading-relaxed font-mono text-muted-foreground whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
              {JSON.stringify(log.payload, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
}

export function LogInvestigationSection() {
  const selectedLog =
    INVESTIGATION_LOGS.find((log) => log.id === SELECTED_LOG_ID) ??
    INVESTIGATION_LOGS[0];

  return (
    <section className="w-full py-32 lg:py-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial heading */}
        <h2 className="max-w-3xl text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1]">
          Seeing logs is only the beginning.
        </h2>

        {/* Layered product showcase + copy column — one shared container,
            two explicit tracks (panels ~58% / copy ~32%) with a real
            column-gap (~10%) between them */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 gap-y-24 lg:grid-cols-[minmax(0,58%)_minmax(0,32%)] lg:gap-x-[10%] lg:gap-y-0 items-start">
          {/* Panel composition — explorer behind, details in front */}
          <div className="relative">
            {/* Ambient brand glow behind the panel stack */}
            <div
              aria-hidden
              className="absolute -inset-x-20 -inset-y-24 opacity-[0.16] pointer-events-none"
              style={{
                background:
                  "radial-gradient(closest-side, var(--primary), transparent)",
              }}
            />

            {/* Log Explorer — receded background layer, visible at every breakpoint */}
            <div
              aria-hidden
              className="absolute top-0 left-0 w-[72%] opacity-60 rounded-lg bg-surface overflow-hidden border-transparent"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  logs
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  production
                </span>
              </div>
              {INVESTIGATION_LOGS.map((log) => (
                <StreamRow key={log.id} log={log} />
              ))}
            </div>

            {/* Log Details — dominant foreground layer, bottom content fade */}
            <div className="relative z-10 ml-[18%] mt-10">
              <DetailPanel log={selectedLog} />
            </div>
          </div>

          {/* Copy column — second column of the shared container */}
          <div className="space-y-12">
            <p className="text-lg leading-relaxed max-w-none lg:max-w-[360px]">
              <span className="font-semibold text-foreground">
                Every event carries its full context.
              </span>{" "}
              <span className="text-muted-foreground">
                Open any log to read its message and payload.
              </span>
            </p>

            <div className="space-y-6">
              <p className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Features
              </p>

              <ul className="space-y-3">
                {[
                  "Realtime log stream",
                  "Full event payloads",
                  "Projects & environments",
                  "API key ingestion",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-foreground flex items-center gap-2 whitespace-nowrap"
                  >
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
