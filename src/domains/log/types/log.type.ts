// src/domains/log/types/log.type.ts

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | string;

export type LogEvent = {
  id: string;
  projectId: string;
  environment: string;
  level: LogLevel;
  event: string;
  message: string | null;
  occurredAt: string;
  receivedAt: string;
  payload: Record<string, unknown> | null;
};

export type LogPagination = {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
};

export type LogResponse = {
  logs: LogEvent[];
  pagination: LogPagination;
};
