import type { LogFiltersState, LogResponse } from "../types/log.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const EMPTY_FILTERS: LogFiltersState = {
  search: "",
  level: "",
  environment: "",
  from: "",
  to: "",
};

export class LogService {
  static async listByProject(
    projectId: string,
    page = 1,
    limit = 50,
    filters: LogFiltersState = EMPTY_FILTERS,
  ): Promise<LogResponse> {
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const { search, level, environment, from, to } = filters;

    if (search.trim()) searchParams.set("search", search.trim());

    if (level) searchParams.set("level", level);

    if (environment) searchParams.set("environment", environment);

    if (from) searchParams.set("from", from);

    if (to) searchParams.set("to", to);

    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/logs?${searchParams}`,
      {
        credentials: "include",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to fetch logs");
    }

    return data.data;
  }
}
