// app/dashboard/organization/[id]/project/[projectId]

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { delok } from "@/src/lib/delok";
import { userAc } from "better-auth/plugins/admin/access";
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

const LEVEL_STYLES: Record<string, string> = {
  info: "bg-blue-50 text-blue-600 border-blue-200",
  warn: "bg-amber-50 text-amber-600 border-amber-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  error: "bg-red-50 text-red-600 border-red-200",
  debug: "bg-gray-50 text-gray-500 border-gray-200",
};

const getLevelStyle = (level: string) =>
  LEVEL_STYLES[level.toLowerCase()] ??
  "bg-gray-50 text-gray-500 border-gray-200";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const LogEventRow = ({ logEvent }: { logEvent: LogEvent }) => {
  const [expanded, setExpanded] = useState(false);
  const hasPayload =
    logEvent.payload !== null &&
    typeof logEvent.payload === "object" &&
    Object.keys(logEvent.payload).length > 0;

  return (
    <div className="rounded border border-gray-100 bg-white px-2.5 py-1.5 transition-colors hover:border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`shrink-0 px-1 py-0.5 rounded text-[9px] font-medium border uppercase tracking-wide ${getLevelStyle(
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
            {expanded ? "Sembunyikan payload" : "Lihat payload"}
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

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

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
      const response = await fetch(
        `http://localhost:8000/api/projects/${projectId}/logs?page=${page}&limit=20`,
        { credentials: "include" },
      );
      const result = await response.json();
      setLogEvents(result.data.logs ?? []);
      setPagination(result.data.pagination);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
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
  }, [projectId, page]);

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
                className="bg-gray-900 text-white text-xs py-1.5"
              >
                {updatingProject ? "Updating..." : "Update Project"}
              </Button>
            </form>

            <div className=" border-t border-gray-100 pt-2.5">
              <Button
                onClick={handleDeleteProject}
                disabled={deletingProject}
                className="w-full border border-red-200 bg-red-600 text-xs py-1.5 hover:bg-red-500"
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Logs
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="disabled:opacity-30 hover:text-gray-700"
              >
                ←
              </button>
              <span>
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="disabled:opacity-30 hover:text-gray-700"
              >
                →
              </button>
            </div>
          </div>

          {loadingLogs && (
            <p className="text-xs text-gray-400">Loading logs...</p>
          )}
          {!loadingLogs && logEvents.length === 0 && (
            <p className="text-xs text-gray-400 italic">No logs yet</p>
          )}

          <div className="flex flex-col gap-1">
            {logEvents.map((logEvent) => (
              <LogEventRow key={logEvent.id} logEvent={logEvent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
