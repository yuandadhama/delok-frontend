"use client";

import { useCallback, useEffect, useState } from "react";

import { LogService } from "../api/log.service";
import type { LogEvent, LogPagination } from "../types/log.type";

import { createWebSocket } from "@/src/lib/websocket/websocket";

const DEFAULT_PAGINATION: LogPagination = {
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  total: 0,
};

export function useProjectLogs(projectId: string, limit = 20) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [pagination, setPagination] =
    useState<LogPagination>(DEFAULT_PAGINATION);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      const result = await LogService.listByProject(projectId, page, limit);

      setLogs(result.logs);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * Realtime log subscription.
   */
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

        setLogs((previous) => [log, ...previous.slice(0, limit - 1)]);

        setPagination((previous) => ({
          ...previous,
          total: previous.total + 1,
        }));
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
  }, [projectId, limit]);

  const selectLog = useCallback((log: LogEvent) => {
    setSelectedLog(log);
  }, []);

  const closeLogDetail = useCallback(() => {
    setSelectedLog(null);
  }, []);

  return {
    logs,
    pagination,
    page,
    isLoading,

    selectedLog,

    setPage,

    selectLog,
    closeLogDetail,

    refetch: fetchLogs,
  };
}
