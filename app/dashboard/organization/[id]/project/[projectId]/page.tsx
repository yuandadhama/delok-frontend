// app/dashboard/organization/[id]/project/[projectId]

"use client";

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
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warn: "bg-yellow-100 text-yellow-700 border-yellow-200",
  warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
  error: "bg-red-100 text-red-700 border-red-200",
  debug: "bg-gray-100 text-gray-700 border-gray-200",
};

const getLevelStyle = (level: string) =>
  LEVEL_STYLES[level.toLowerCase()] ??
  "bg-gray-100 text-gray-700 border-gray-200";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

const LogEventRow = ({ logEvent }: { logEvent: LogEvent }) => {
  const [expanded, setExpanded] = useState(false);
  const hasPayload =
    logEvent.payload !== null &&
    typeof logEvent.payload === "object" &&
    Object.keys(logEvent.payload).length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border uppercase ${getLevelStyle(
              logEvent.level,
            )}`}
          >
            {logEvent.level}
          </span>
          <span className="font-medium text-gray-900">{logEvent.event}</span>
          <span className="text-xs text-gray-400 px-2 py-0.5 rounded bg-gray-50 border border-gray-100">
            {logEvent.environment}
          </span>
        </div>
        <span
          className="text-xs text-gray-400"
          title={`Received: ${formatDate(logEvent.receivedAt)}`}
        >
          {formatDate(logEvent.occurredAt)}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {logEvent.message ? (
          logEvent.message
        ) : (
          <span className="italic text-gray-400">No message</span>
        )}
      </p>

      {hasPayload ? (
        <div className="mt-2">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {expanded ? "Hide payload ▲" : "Show payload ▼"}
          </button>
          {expanded && (
            <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-gray-900 p-3 text-xs text-gray-100">
              {JSON.stringify(logEvent.payload, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs italic text-gray-300">No payload</p>
      )}
    </div>
  );
};

const Page = () => {
  const params = useParams<{ id: string; projectId: string }>();
  const { projectId } = params;

  const [projectName, setProjectName] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

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
        `http://localhost:8000/api/logs/project/${projectId}`,
        { credentials: "include" },
      );
      const result = await response.json();
      setLogEvents(result.data ?? []);
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProjectById();
  }, [projectId]);

  useEffect(() => {
    if (apiKeys.length === 0) return;
    fetchLogEvents();
  }, [apiKeys]);

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full container flex flex-col gap-6 p-8">
        <div>
          <h1 className="text-sm text-gray-400">Project ID: {projectId}</h1>
          <h1 className="text-3xl font-bold text-gray-900">
            {loadingProject ? "Loading..." : projectName || "Untitled Project"}
          </h1>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">API Keys</h2>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No API keys found</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {apiKeys.map((apiKey) => (
                <li
                  key={apiKey.key}
                  className="font-mono text-xs bg-gray-100 border border-gray-200 rounded px-2 py-1"
                >
                  {apiKey.key}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Logs</h1>
          {loadingLogs && (
            <p className="text-sm text-gray-400">Loading logs...</p>
          )}
          {!loadingLogs && logEvents.length === 0 && (
            <p className="text-sm text-gray-400 italic">No logs yet</p>
          )}
          <div className="flex flex-col gap-3">
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
