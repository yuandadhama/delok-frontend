"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { LogService } from "../api/log.service";
import type {
  LogEvent,
  LogFiltersState,
  LogPagination,
} from "../types/log.type";

import { createWebSocket } from "@/src/lib/websocket/websocket";

const DEFAULT_PAGINATION: LogPagination = {
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  total: 0,
};

const EMPTY_FILTERS: LogFiltersState = {
  search: "",
  level: "",
  environment: "",
  from: "",
  to: "",
};

/**
 * Client-side filter check used for realtime (WebSocket) logs, which bypass
 * the server query. Page data is already filtered server-side.
 */
function matchesLogFilters(log: LogEvent, filters: LogFiltersState): boolean {
  const search = filters.search.trim().toLowerCase();
  const from = filters.from ? new Date(filters.from).getTime() : null;
  const to = filters.to ? new Date(filters.to).getTime() + 86_400_000 : null;

  if (
    search &&
    !`${log.event} ${log.message ?? ""}`.toLowerCase().includes(search)
  ) {
    return false;
  }

  if (
    filters.level &&
    log.level.toLowerCase() !== filters.level.toLowerCase()
  ) {
    return false;
  }

  if (
    filters.environment &&
    log.environment.toLowerCase() !== filters.environment.toLowerCase()
  ) {
    return false;
  }

  const occurredAt = new Date(log.occurredAt).getTime();

  if (from !== null && occurredAt < from) return false;

  if (to !== null && occurredAt >= to) return false;

  return true;
}

export function useProjectLogs(projectId: string, initialLimit = 50) {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [pagination, setPagination] =
    useState<LogPagination>(DEFAULT_PAGINATION);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [limit, setLimitState] = useState<number>(initialLimit);

  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);

  const [filters, setFilters] = useState<LogFiltersState>(EMPTY_FILTERS);

  // Always-current filter ref so the WebSocket handler can check incoming
  // logs without reconnecting whenever a filter changes.
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
      filters.level ||
      filters.environment ||
      filters.from ||
      filters.to,
  );

  const setFilter = useCallback(
    (key: keyof LogFiltersState, value: string) => {
      setFilters((previous) => ({ ...previous, [key]: value }));
      setPage(1);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }, []);

  const setLimit = useCallback((next: number) => {
    setLimitState(next);
    setPage(1);
  }, []);

  // Only the latest fetch request may apply its result, so a slow earlier
  // response (e.g. after rapid filter typing) can't overwrite a newer one.
  const fetchSequence = useRef(0);

  const fetchLogs = useCallback(async () => {
    if (!projectId) return;

    const sequence = ++fetchSequence.current;

    setIsLoading(true);

    try {
      const result = await LogService.listByProject(
        projectId,
        page,
        limit,
        filters,
      );

      if (sequence !== fetchSequence.current) return;

      setLogs(result.logs);
      setPagination(result.pagination);
    } catch (error) {
      if (sequence === fetchSequence.current) {
        console.error("Failed to fetch logs:", error);
      }
    } finally {
      if (sequence === fetchSequence.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, page, limit, filters]);

  useEffect(() => {
    // Defer so the initial fetch (which sets loading state) doesn't run
    // synchronously inside the effect body.
    const timer = setTimeout(() => {
      void fetchLogs();
    }, 0);

    return () => clearTimeout(timer);
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

        if (!matchesLogFilters(log, filtersRef.current)) {
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

    filters,
    hasActiveFilters,

    limit,

    setPage,

    setFilter,
    clearFilters,
    setLimit,

    selectLog,
    closeLogDetail,

    refetch: fetchLogs,
  };
}
