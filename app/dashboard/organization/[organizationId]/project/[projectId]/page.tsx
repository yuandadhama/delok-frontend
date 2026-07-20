// app/dashboard/organization/[id]/project/[projectId]

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ApiKey = {
  key: string;
};

type LogEvent = {
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

// Only 4 severities exist in this system: info, warn, error, fatal.
const LEVEL_BADGE_STYLES: Record<string, string> = {
  info: "bg-blue-50 text-blue-600 border-blue-200",
  warn: "bg-amber-50 text-amber-600 border-amber-200",
  error: "bg-red-50 text-red-600 border-red-200",
  fatal: "bg-rose-600 text-white border-rose-600",
};

// Left accent bar per row so the list can be scanned by eye without
// reading every badge.
const LEVEL_ACCENT_STYLES: Record<string, string> = {
  info: "border-l-blue-400",
  warn: "border-l-amber-400",
  error: "border-l-red-400",
  fatal: "border-l-rose-600",
};

const getLevelBadgeStyle = (level: string) =>
  LEVEL_BADGE_STYLES[level.toLowerCase()] ??
  "bg-gray-50 text-gray-500 border-gray-200";

const getLevelAccentStyle = (level: string) =>
  LEVEL_ACCENT_STYLES[level.toLowerCase()] ?? "border-l-gray-300";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

// --- tiny inline icons (kept dependency-free) ---------------------------

const SearchIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-3.5 w-3.5 text-gray-400"
    aria-hidden="true"
  >
    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M17 17l-4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" aria-hidden="true">
    <path
      d="M5 5l10 10M15 5L5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path
      d={direction === "left" ? "M12 5l-5 5 5 5" : "M8 5l5 5-5 5"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InboxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6 text-gray-300"
    aria-hidden="true"
  >
    <path
      d="M4 12h4l1.5 3h5L16 12h4M5 12l1.4-6.3A1 1 0 0 1 7.4 5h9.2a1 1 0 0 1 1 .7L19 12M5 12v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// -------------------------------------------------------------------------

const LogEventRow = ({ logEvent }: { logEvent: LogEvent }) => {
  const [expanded, setExpanded] = useState(false);
  const hasPayload =
    logEvent.payload !== null &&
    typeof logEvent.payload === "object" &&
    Object.keys(logEvent.payload).length > 0;

  return (
    <div
      className={`rounded-md border border-gray-100 border-l-2 ${getLevelAccentStyle(
        logEvent.level,
      )} bg-white px-2.5 py-1.5 transition-colors hover:border-gray-200 hover:shadow-sm`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`shrink-0 px-1 py-0.5 rounded text-[9px] font-semibold border uppercase tracking-wide ${getLevelBadgeStyle(
              logEvent.level,
            )}`}
          >
            {logEvent.level}
          </span>
          <span className="text-[13px] font-medium text-gray-800 truncate">
            {logEvent.event}
          </span>
          <span className="shrink-0 text-[10px] text-gray-400 px-1 py-0.5 rounded bg-gray-50">
            {logEvent.environment}
          </span>
        </div>
        <span
          className="shrink-0 text-[10px] text-gray-400"
          title={`Received: ${formatDate(logEvent.receivedAt)}`}
        >
          {formatDate(logEvent.occurredAt)}
        </span>
      </div>

      {logEvent.message && (
        <p className="mt-0.5 text-[12px] text-gray-500 leading-snug truncate">
          {logEvent.message}
        </p>
      )}

      {hasPayload && (
        <div className="mt-1">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[10px] font-medium text-gray-400 hover:text-gray-600"
          >
            {expanded ? "hide payload" : "See payload"}
          </button>
          {expanded && (
            <pre className="mt-1 max-h-56 overflow-auto rounded bg-gray-900 p-2 text-[10px] leading-relaxed text-gray-100">
              {JSON.stringify(logEvent.payload, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const params = useParams<{ organizationId: string; projectId: string }>();
  const { projectId } = params;

  const [projectName, setProjectName] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Project settings
  const [editingProjectName, setEditingProjectName] = useState("");

  // Update project
  const [updatingProject, setUpdatingProject] = useState(false);

  // Delete project
  const [deletingProject, setDeletingProject] = useState(false);

  // General error
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Filters
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [environment, setEnvironment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Metadata pagination dari backend
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    total: 0,
    hasPreviousPage: false,
  });

  const hasActiveFilters = Boolean(
    search || level || environment || from || to,
  );

  const clearFilters = () => {
    setPage(1);
    setSearch("");
    setLevel("");
    setEnvironment("");
    setFrom("");
    setTo("");
  };

  const fetchProjectById = async () => {
    setLoadingProject(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/project/${projectId}`,
        { credentials: "include" },
      );
      const result = await response.json();
      const { name, apiKeys } = result.data;
      setProjectName(name);
      setEditingProjectName(name);
      setApiKeys(apiKeys ?? []);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchLogEvents = async () => {
    setLoadingLogs(true);

    try {
      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", String(limit));
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      if (search) params.set("search", search);
      if (level) params.set("level", level);
      if (environment) params.set("environment", environment);

      const response = await fetch(
        `http://localhost:8000/api/projects/${projectId}/logs?${params.toString()}`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      setLogEvents(result.data.logs ?? []);

      setPagination(result.data.pagination);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    } finally {
      setLoadingLogs(false);
    }
  };

  /**
   * Update project name.
   */
  const handleUpdateProject = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingProjectName.trim()) return;

    setUpdatingProject(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/project/${projectId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingProjectName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setProjectName(data.data.name);
        alert("Project updated successfully");
      } else {
        setError(data.message ?? "Failed to update project");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setUpdatingProject(false);
    }
  };

  /**
   * Delete project.
   */
  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    setDeletingProject(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/project/${projectId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Project deleted");
        window.history.back();
      } else {
        setError(data.message ?? "Failed to delete project");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setDeletingProject(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProjectById();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    fetchLogEvents();
  }, [projectId, page, search, level, environment, from, to]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto flex gap-5 px-6 py-8">
        {/* Left column: settings & keys */}
        <div className="w-64 shrink-0 flex flex-col gap-4">
          <div>
            <p className="text-[11px] text-gray-400">Project ID: {projectId}</p>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {loadingProject
                ? "Loading..."
                : projectName || "Untitled Project"}
            </h1>
          </div>

          {/* Project settings */}
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <h2 className="text-xs font-semibold text-gray-700 mb-2">
              Project Settings
            </h2>

            <form
              onSubmit={handleUpdateProject}
              className="flex flex-col gap-2"
            >
              <Input
                label="Project Name"
                name="projectName"
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                placeholder="Project name"
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button
                disabled={updatingProject}
                className="bg-gray-900 text-white text-xs py-1.5 rounded-md hover:bg-gray-800 transition-colors"
              >
                {updatingProject ? "Updating..." : "Update Project"}
              </Button>
            </form>

            <div className="border-t border-gray-100 mt-2.5 pt-2.5">
              <Button
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="w-full border border-red-200 bg-red-600 text-xs py-1.5 rounded-md hover:bg-red-500 transition-colors"
              >
                {deletingProject ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </div>

          {/* API Keys */}
          <div>
            <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              API Keys
            </h2>
            {apiKeys.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No API keys found</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {apiKeys.map((apiKey) => (
                  <li
                    key={apiKey.key}
                    className="font-mono text-[10px] bg-white border border-gray-100 rounded px-1.5 py-1 text-gray-600 truncate"
                  >
                    {apiKey.key}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Space reserved for future features */}
          {/* e.g. alerts, integrations, usage stats */}
        </div>

        {/* Right column: logs */}
        <div className="flex-1 min-w-0">
          {/* Compact filter toolbar — a single slim row instead of a big card */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <div className="relative flex-1 min-w-45">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                aria-label="Search logs"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search event or message..."
                className="w-full rounded-md border border-gray-200 bg-white pl-7 pr-2.5 py-1.5 text-[12.5px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900/15 focus:border-gray-300"
              />
            </div>

            <select
              aria-label="Filter by level"
              value={level}
              onChange={(e) => {
                setPage(1);
                setLevel(e.target.value);
              }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12.5px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900/15"
            >
              <option value="">All levels</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="fatal">Fatal</option>
            </select>

            <select
              aria-label="Filter by environment"
              value={environment}
              onChange={(e) => {
                setPage(1);
                setEnvironment(e.target.value);
              }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12.5px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900/15"
            >
              <option value="">All environments</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>

            <input
              type="date"
              value={from}
              onChange={(e) => {
                setPage(1);
                setFrom(e.target.value);
              }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12.5px]"
            />

            <input
              type="date"
              value={to}
              onChange={(e) => {
                setPage(1);
                setTo(e.target.value);
              }}
              className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[12.5px]"
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[12px] text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <ClearIcon />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Logs Found{" "}
              <span className="font-bold text-black">{pagination.total}</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => prev - 1)}
                  aria-label="Previous page"
                  className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  aria-label="Next page"
                  className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>
          </div>

          {loadingLogs && (
            <div className="flex flex-col gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          )}

          {!loadingLogs && logEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-white py-10">
              <InboxIcon />
              <p className="text-xs text-gray-400">
                {hasActiveFilters
                  ? "No logs match these filters"
                  : "No logs yet"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-medium text-gray-500 hover:text-gray-700 underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loadingLogs && logEvents.length > 0 && (
            <div className="flex flex-col gap-1">
              {logEvents.map((logEvent) => (
                <LogEventRow key={logEvent.id} logEvent={logEvent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
