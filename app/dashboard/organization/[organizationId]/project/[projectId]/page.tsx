// app/dashboard/organization/[id]/project/[projectId]

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { apiKeySchema } from "@/src/features/api-key/api-key.schema";
import { z } from "better-auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
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
  info: "bg-sky-50 text-sky-700 border-sky-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-red-50 text-red-700 border-red-200",
  fatal: "bg-rose-600 text-white border-rose-600",
};

// Left accent bar per row so the list can be scanned by eye without
// reading every badge.
const LEVEL_ACCENT_STYLES: Record<string, string> = {
  info: "border-l-sky-400",
  warn: "border-l-amber-400",
  error: "border-l-red-400",
  fatal: "border-l-rose-600",
};

const getLevelBadgeStyle = (level: string) =>
  LEVEL_BADGE_STYLES[level.toLowerCase()] ??
  "bg-slate-50 text-slate-500 border-slate-200";

const getLevelAccentStyle = (level: string) =>
  LEVEL_ACCENT_STYLES[level.toLowerCase()] ?? "border-l-slate-300";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

// --- design tokens (className presets kept local so styling stays one
// source of truth without touching the shared Button/Input components) ---

const EYEBROW =
  "text-[11px] font-semibold uppercase tracking-wide text-slate-400";
const CARD = "bg-white border border-slate-200 rounded-xl shadow-sm";
const BTN_PRIMARY =
  "bg-slate-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-slate-800 active:bg-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_DANGER =
  "w-full border bg-red-700 border-red-200 text-xs font-medium py-2 rounded-lg  active:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const BTN_ACCENT =
  "w-full flex items-center justify-center gap-1.5 text-xs font-medium bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const ICON_BTN =
  "inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium hover:bg-slate-100 cursor-pointer  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20";
const FIELD =
  "rounded-lg border border-slate-200 bg-white text-[12.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-colors";

// --- tiny inline icons (kept dependency-free) ---------------------------

const SearchIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-3.5 w-3.5 text-slate-400"
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

const CaretIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
    aria-hidden="true"
  >
    <path
      d="M7 5l5 5-5 5"
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
    className="h-6 w-6 text-slate-300"
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

const PlusIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <path
      d="M10 4v12M4 10h12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    className="h-3.5 w-3.5"
    aria-hidden="true"
  >
    <rect
      x="7"
      y="7"
      width="9"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7"
      stroke="currentColor"
      strokeWidth="1.4"
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
      className={`rounded-lg border border-slate-100 border-l-[3px] ${getLevelAccentStyle(
        logEvent.level,
      )} bg-white px-3 py-2 transition-shadow hover:shadow-sm`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide border ${getLevelBadgeStyle(
              logEvent.level,
            )}`}
          >
            {logEvent.level}
          </span>
          <span className="truncate text-[13px] font-medium text-slate-800">
            {logEvent.event}
          </span>
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {logEvent.environment}
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-[10px] text-slate-400"
          title={`Received: ${formatDate(logEvent.receivedAt)}`}
        >
          {formatDate(logEvent.occurredAt)}
        </span>
      </div>

      {logEvent.message && (
        <p className="mt-1 truncate text-[12px] leading-snug text-slate-500">
          {logEvent.message}
        </p>
      )}

      {hasPayload && (
        <div className="mt-1.5">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded"
          >
            <CaretIcon open={expanded} />
            {expanded ? "Hide payload" : "See payload"}
          </button>
          {expanded && (
            <pre className="mt-1.5 max-h-56 overflow-auto rounded-lg bg-slate-900 p-2.5 font-mono text-[10px] leading-relaxed text-slate-100">
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
  const [apiKeyError, setApiKeyError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Filters
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [environment, setEnvironment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Modal untuk generate API key
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [modalApiKeyName, setModalApiKeyName] = useState("");
  const [creatingApiKey, setCreatingApiKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);

  const [editingApiKeyId, setEditingApiKeyId] = useState<string | null>(null);
  const [editingApiKeyName, setEditingApiKeyName] = useState("");

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
      const [projectResponse, apiKeyResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/project/${projectId}`, {
          credentials: "include",
        }),
        fetch(`http://localhost:8000/api/projects/${projectId}/api-keys`, {
          credentials: "include",
        }),
      ]);

      if (!projectResponse.ok || !apiKeyResponse.ok) {
        throw new Error("Failed loading project");
      }

      const projectResult = await projectResponse.json();
      const apiKeyResult = await apiKeyResponse.json();

      setProjectName(projectResult.data.name);
      setEditingProjectName(projectResult.data.name);
      setApiKeys(apiKeyResult.data ?? []);
    } catch (e) {
      console.error(e);
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

  const handleCreateApiKey = async (name: string) => {
    setCreatingApiKey(true);
    setApiKeyError("");

    // Validate name with schema
    const validationResult = apiKeySchema.safeParse({
      name: name.trim(),
    });

    if (!validationResult.success) {
      setApiKeyError(validationResult.error.issues[0].message);
      setCreatingApiKey(false);
      return;
    }

    const validatedName = validationResult.data.name;

    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/${projectId}/api-keys`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: validatedName,
          }),
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        setGeneratedKey(responseData.data.key);
        setModalApiKeyName("");
        fetchProjectById();
      } else {
        setApiKeyError(responseData.message ?? "Failed to create API key");
      }
    } catch (error) {
      console.error(error);
      setApiKeyError("Something went wrong");
    } finally {
      setCreatingApiKey(false);
    }
  };

  const handleRenameApiKey = async (id: string) => {
    const response = await fetch(`http://localhost:8000/api/api-key/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editingApiKeyName,
      }),
    });

    if (response.ok) {
      fetchProjectById();
      setEditingApiKeyId(null);
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    const confirm = window.confirm("Revoke this API key?");

    if (!confirm) return;

    const response = await fetch(
      `http://localhost:8000/api/api-key/${id}/revoke`,
      {
        method: "PATCH",
        credentials: "include",
      },
    );

    if (response.ok) {
      fetchProjectById();
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row">
        {/* Left column: settings & keys */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-64">
          <div>
            <p className="font-mono text-[11px] text-slate-400">{projectId}</p>
            {loadingProject ? (
              <div className="mt-1 h-6 w-40 animate-pulse rounded bg-slate-200" />
            ) : (
              <h1 className="truncate text-lg font-semibold text-slate-900">
                {projectName || "Untitled project"}
              </h1>
            )}
          </div>

          {/* Project settings */}
          <div className={`${CARD} p-3.5`}>
            <h2 className={`${EYEBROW} mb-2.5`}>Project settings</h2>

            <form
              onSubmit={handleUpdateProject}
              className="flex flex-col gap-2.5"
            >
              <Input
                label="Project name"
                name="projectName"
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                placeholder="Project name"
              />

              {error && (
                <p className="rounded-md bg-red-50 px-2 py-1.5 text-[11px] text-red-600">
                  {error}
                </p>
              )}

              <Button disabled={updatingProject} className={BTN_PRIMARY}>
                {updatingProject ? "Updating…" : "Update project"}
              </Button>
            </form>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <Button
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className={BTN_DANGER}
              >
                {deletingProject ? "Deleting…" : "Delete project"}
              </Button>
            </div>
          </div>

          {/* dlok_028590d7a60774ab4b7dcf9e39b6c10db70d616d4e227c67d07fccf57e0d8a2d */}
          {/* API Keys */}
          <div className={`${CARD} p-3.5`}>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className={EYEBROW}>API keys</h2>
              <span className="text-[10px] text-slate-300">
                {apiKeys.length}
              </span>
            </div>

            <Button
              onClick={() => {
                setShowGenerateModal(true);
                setModalApiKeyName("");
                setApiKeyError("");
                setGeneratedKey(null);
              }}
              className={`${BTN_ACCENT} mb-3`}
            >
              <PlusIcon />
              Generate API key
            </Button>

            {apiKeys.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400">No API key created yet</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {apiKeys.map((apiKey) => (
                  <li
                    key={apiKey.id}
                    className="rounded-lg border border-slate-100 px-2.5 py-2"
                  >
                    <div className="flex flex-col gap-1">
                      {editingApiKeyId === apiKey.id ? (
                        <div className="flex gap-1.5">
                          <input
                            value={editingApiKeyName}
                            onChange={(e) =>
                              setEditingApiKeyName(e.target.value)
                            }
                            autoFocus
                            className={`${FIELD} flex-1 px-2 py-1`}
                          />

                          <button
                            onClick={() => handleRenameApiKey(apiKey.id)}
                            className="rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-slate-800 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[12.5px] font-medium text-slate-800">
                            {apiKey.name}
                          </span>

                          {!apiKey.revokedAt && (
                            <button
                              onClick={() => {
                                setEditingApiKeyId(apiKey.id);
                                setEditingApiKeyName(apiKey.name);
                              }}
                              className={ICON_BTN}
                            >
                              Rename
                            </button>
                          )}
                        </div>
                      )}

                      <span className="font-mono text-[10px] text-slate-400">
                        {apiKey.keyPrefix}********
                      </span>

                      {apiKey.revokedAt ? (
                        <span className="inline-flex w-fit items-center rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
                          Revoked {formatDate(apiKey.revokedAt)}
                        </span>
                      ) : (
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[10px] text-slate-400">
                            Last used:{" "}
                            {apiKey.lastUsedAt
                              ? formatDate(apiKey.lastUsedAt)
                              : "Never"}
                          </span>
                          <button
                            onClick={() => handleRevokeApiKey(apiKey.id)}
                            className={`${ICON_BTN} text-red-500 hover:bg-red-50 hover:text-red-600`}
                          >
                            Revoke
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Space reserved for future features */}
          {/* e.g. alerts, integrations, usage stats */}
        </div>

        {/* Right column: logs */}
        <div className="min-w-0 flex-1">
          {/* Compact filter toolbar — a single slim row instead of a big card */}
          <div
            className={`${CARD} mb-3 flex flex-wrap items-center gap-1.5 p-2`}
          >
            <div className="relative min-w-45 flex-1">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                aria-label="Search logs"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search event or message…"
                className={`${FIELD} w-full py-1.5 pl-8 pr-2.5`}
              />
            </div>

            <select
              aria-label="Filter by level"
              value={level}
              onChange={(e) => {
                setPage(1);
                setLevel(e.target.value);
              }}
              className={`${FIELD} px-2 py-1.5 text-slate-600`}
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
              className={`${FIELD} px-2 py-1.5 text-slate-600`}
            >
              <option value="">All environments</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>

            <input
              aria-label="From date"
              type="date"
              value={from}
              onChange={(e) => {
                setPage(1);
                setFrom(e.target.value);
              }}
              className={`${FIELD} px-2 py-1.5`}
            />

            <input
              aria-label="To date"
              type="date"
              value={to}
              onChange={(e) => {
                setPage(1);
                setTo(e.target.value);
              }}
              className={`${FIELD} px-2 py-1.5`}
            />

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                <ClearIcon />
                Clear
              </button>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <h2 className={EYEBROW}>
              Logs found{" "}
              <span className="font-bold text-slate-900">
                {pagination.total}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => prev - 1)}
                  aria-label="Previous page"
                  className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-1 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  aria-label="Next page"
                  className="flex items-center justify-center rounded-md border border-slate-200 bg-white p-1 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            </div>
          </div>

          {loadingLogs && (
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          )}

          {!loadingLogs && logEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white py-12">
              <InboxIcon />
              <p className="text-xs text-slate-400">
                {hasActiveFilters
                  ? "No logs match these filters"
                  : "No logs yet"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="cursor-pointer text-[11px] font-medium text-slate-500 underline hover:text-slate-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loadingLogs && logEvents.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {logEvents.map((logEvent) => (
                <LogEventRow key={logEvent.id} logEvent={logEvent} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Generate API Key */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
            {!generatedKey ? (
              // Step 1: Input nama API key
              <div className="p-6">
                <h2 className="mb-1 text-lg font-semibold text-slate-900">
                  Generate API Key
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  Enter a name for your new API key
                </p>

                <div className="mb-4">
                  <label className="mb-2 block text-xs font-medium text-slate-700">
                    API Key Name
                  </label>
                  <input
                    type="text"
                    value={modalApiKeyName}
                    onChange={(e) => setModalApiKeyName(e.target.value)}
                    placeholder="e.g., Production Key"
                    autoFocus
                    className={`${FIELD} w-full px-3 py-2`}
                  />
                </div>

                {apiKeyError && (
                  <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                    {apiKeyError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowGenerateModal(false);
                      setGeneratedKey(null);
                      setModalApiKeyName("");
                      setKeyCopied(false);
                      setApiKeyError("");
                    }}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCreateApiKey(modalApiKeyName)}
                    disabled={creatingApiKey || !modalApiKeyName.trim()}
                    className={`${BTN_PRIMARY} flex-1 cursor-pointer`}
                  >
                    {creatingApiKey ? "Generating…" : "Generate"}
                  </button>
                </div>
              </div>
            ) : (
              // Step 2: Display generated key
              <div className="p-6">
                <h2 className="mb-1 text-lg font-semibold text-slate-900">
                  API Key Generated
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                  Copy this key now — it will not be shown again.
                </p>

                <div className="mb-4 rounded-lg border border-dashed border-slate-700 bg-slate-900 p-3">
                  <code className="break-all font-mono text-xs text-white">
                    {`${generatedKey.slice(0, 12)}*********************`}
                  </code>
                </div>
                {/* dlok_3eca9f2756244d1212c52acf239377f7274c793343fcde2bdd5d6b46b5480e8c */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey);
                    setKeyCopied(true);
                    setTimeout(() => setKeyCopied(false), 1500);
                  }}
                  className={`w-full mb-3 flex items-center justify-center gap-2 rounded-lg border border-indigo-300 cursor-pointer bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors`}
                >
                  <CopyIcon />
                  {keyCopied ? "Copied!" : "Copy Key"}
                </button>

                <button
                  onClick={() => {
                    setShowGenerateModal(false);
                    setGeneratedKey(null);
                    setModalApiKeyName("");
                    setKeyCopied(false);
                    setApiKeyError("");
                  }}
                  className={`${BTN_PRIMARY} w-full cursor-pointer`}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
