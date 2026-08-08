"use client";

import { FileJson, MessageSquare, X } from "lucide-react";

import type { LogEvent } from "../types/log.type";

type LogDetailPanelProps = {
  log: LogEvent | null;
  onClose: () => void;
};

export function LogDetailPanel({ log, onClose }: LogDetailPanelProps) {
  if (!log) {
    return null;
  }

  return (
    <aside className="w-96 shrink-0 border-l border-border bg-surface flex flex-col">
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

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
          aria-label="Close log details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <DetailItem label="Event">{log.event}</DetailItem>

        <DetailItem label="Level">{log.level}</DetailItem>

        <DetailItem label="Environment">{log.environment}</DetailItem>

        <DetailItem label="Occurred At">
          {new Date(log.occurredAt).toLocaleString()}
        </DetailItem>

        {log.message && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />

              <h3 className="text-xs font-semibold">Message</h3>
            </div>

            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-xs text-foreground whitespace-pre-wrap wrap-break-word">
                {log.message}
              </p>
            </div>
          </section>
        )}

        {log.payload && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FileJson className="h-3.5 w-3.5 text-muted-foreground" />

              <h3 className="text-xs font-semibold">Payload</h3>
            </div>

            <pre className="rounded-md border border-border bg-background p-3 overflow-x-auto text-[11px] leading-relaxed font-mono text-muted-foreground">
              {JSON.stringify(log.payload, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </aside>
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

      <p className="text-xs text-foreground wrap-break-word">{children}</p>
    </div>
  );
}
