// src/domains/log-explorer/hooks/useLogExplorerRealtime.ts

"use client";

import { useEffect } from "react";

import type { LogEvent, LogFiltersState } from "@/src/domains/log";

import { createWebSocket } from "@/src/lib/websocket/websocket";

import { matchesLogFilters } from "../utils/matchesLogFilters";

type UseLogExplorerRealtimeOptions = {
  projectId: string | undefined;
  filtersRef: { current: LogFiltersState };
  onLogReceived: (log: LogEvent) => void;
};

/**
 * Owns the WebSocket lifecycle for a single project: creates the connection,
 * subscribes to the project, validates incoming `log.created` messages against
 * the project and the current filters, and forwards accepted logs via
 * `onLogReceived`.
 *
 * The filters ref is read from inside the message handler so incoming logs
 * always respect the latest filters without forcing a reconnection whenever a
 * filter changes.
 */
export function useLogExplorerRealtime({
  projectId,
  filtersRef,
  onLogReceived,
}: UseLogExplorerRealtimeOptions) {
  useEffect(() => {
    if (!projectId) return;

    const socket = createWebSocket();

    let intentionallyClosed = false;

    console.info("[WS] Creating connection:", socket.url);

    socket.onopen = () => {
      if (intentionallyClosed) return;

      console.info("[WS] Connected:", socket.url);

      socket.send(
        JSON.stringify({
          type: "project.subscribe",
          data: {
            projectId,
          },
        }),
      );

      console.info("[WS] Subscribed:", projectId);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type !== "log.created") {
          return;
        }

        const log: LogEvent = message.data;

        if (log.projectId !== projectId) {
          return;
        }

        if (!matchesLogFilters(log, filtersRef.current)) {
          return;
        }

        onLogReceived(log);
      } catch (error) {
        console.error("[WS] Failed to process message:", error);
      }
    };

    socket.onerror = () => {
      if (intentionallyClosed) {
        return;
      }

      console.warn("[WS] Connection error:", socket.url);
    };

    socket.onclose = (event) => {
      if (intentionallyClosed) {
        return;
      }

      console.warn("[WS] Connection closed:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    };

    return () => {
      intentionallyClosed = true;

      console.info("[WS] Cleanup");

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [projectId, onLogReceived, filtersRef]);
}
