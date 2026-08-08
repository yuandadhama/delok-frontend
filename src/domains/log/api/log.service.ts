import type { LogResponse } from "../types/log.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class LogService {
  static async listByProject(
    projectId: string,
    page = 1,
    limit = 20,
  ): Promise<LogResponse> {
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

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
