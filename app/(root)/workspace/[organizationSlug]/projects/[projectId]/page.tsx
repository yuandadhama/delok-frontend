// app/dashboard/organization/[organizationId]/projects/[projectId]/page.tsx

"use client";

import Button from "@/src/components/ui/Button";
import { ROUTES } from "@/src/constants/routes";
import { apiKeySchema } from "@/src/domains/api-key/api-key.schema";
import { ProjectService, useProjects } from "@/src/domains/project";
import { delok } from "@/src/lib/delok";
import { createWebSocket } from "@/src/lib/websocket/websocket";
import { ApiKeyList, type ApiKey } from "@/src/domains/api-key";
import { LogsPanel } from "@/src/domains/log";
import { ProjectSettings } from "@/src/domains/project";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

type Project = {
  id: string;
  name: string;
  organizationId: string;
};

const API_BASE = "http://localhost:8000/api";

const Page = () => {
  const params = useParams<{ organizationSlug: string; projectId: string }>();
  const { projectId, organizationSlug } = params;

  const [projectNotFound, setProjectNotFound] = useState(false);

  const { updateProject, deleteProject } = useProjects(organizationSlug);

  const [projectName, setProjectName] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [logEvents, setLogEvents] = useState<LogEvent[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Metadata pagination dari backend
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    total: 0,
    hasPreviousPage: false,
  });

  const fetchProjectById = useCallback(async () => {
    setLoadingProject(true);

    try {
      const responseApiKeys = await fetch(
        `${API_BASE}/projects/${projectId}/api-keys`,
        {
          credentials: "include",
        },
      );

      const resultApiKeys = await responseApiKeys.json();

      const project: Project = await ProjectService.getById(projectId);

      setProjectName(project.name);
      setApiKeys(resultApiKeys.data ?? []);

      return project;
    } catch (e) {
      console.error(e);
      setProjectNotFound(true);
      return null;
    } finally {
      setLoadingProject(false);
    }
  }, [projectId]);

  const fetchLogEvents = useCallback(async () => {
    setLoadingLogs(true);

    try {
      const searchParams = new URLSearchParams();

      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));

      const response = await fetch(
        `${API_BASE}/projects/${projectId}/logs?${searchParams.toString()}`,
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
  }, [projectId, page, limit]);

  useEffect(() => {
    if (!projectId) return;
    fetchProjectById();
  }, [projectId, fetchProjectById]);

  useEffect(() => {
    if (projectNotFound) return;
    if (!projectId) return;
    fetchLogEvents();
  }, [projectId, page, fetchLogEvents, projectNotFound]);

  useEffect(() => {
    if (!projectId) return;

    const socket = createWebSocket();

    socket.onopen = () => {
      console.log("Realtime connected");

      socket.send(
        JSON.stringify({
          type: "project.subscribe",
          data: {
            projectId,
          },
        }),
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(`message comming ${message}`);
      if (message.type !== "log.created") return;

      if (message.data.projectId !== projectId) return;

      setLogEvents((previous) => [
        message.data,
        ...previous.slice(0, limit - 1),
      ]);

      setPagination((previous) => ({
        ...previous,
        total: previous.total + 1,
      }));
    };

    socket.onclose = () => {
      console.log("Realtime disconnected");
    };

    return () => {
      socket.close();
    };
  }, [projectId, limit]);

  const handleUpdateProject = useCallback(
    async (name: string) => {
      const project = await updateProject.mutateAsync({
        projectId,
        name,
      });

      delok.info({
        event: "project_updated",
        message: "Project updated",
        payload: {
          organizationSlug,
          projectId,
          name: project.name,
        },
      });

      setProjectName(project.name);
    },
    [updateProject, projectId, organizationSlug],
  );

  const handleDeleteProject = useCallback(async () => {
    await deleteProject.mutateAsync(projectId);

    delok.info({
      event: "project_deleted",
      message: "Project deleted",
      payload: {
        organizationSlug,
        projectId,
      },
    });

    window.location.assign(ROUTES.WORKSPACE.PROJECTS(organizationSlug));
  }, [deleteProject, projectId, organizationSlug]);

  const handleCreateApiKey = useCallback(
    async (name: string): Promise<string> => {
      const validationResult = apiKeySchema.safeParse({ name: name.trim() });
      if (!validationResult.success) {
        throw new Error(validationResult.error.issues[0].message);
      }

      const response = await fetch(
        `${API_BASE}/projects/${projectId}/api-keys`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: validationResult.data.name,
          }),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message ?? "Failed to create API key");
      }

      await fetchProjectById();
      return responseData.data.key as string;
    },
    [projectId, fetchProjectById],
  );

  const handleRenameApiKey = useCallback(
    async (id: string, name: string) => {
      const response = await fetch(`${API_BASE}/api-key/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        await fetchProjectById();
      }
    },
    [fetchProjectById],
  );

  const handleRevokeApiKey = useCallback(
    async (id: string) => {
      const response = await fetch(`${API_BASE}/api-key/${id}/revoke`, {
        method: "PATCH",
        credentials: "include",
      });

      if (response.ok) {
        await fetchProjectById();
      }
    },
    [fetchProjectById],
  );

  if (projectNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md rounded-lg border border-border bg-surface p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">
            Project not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This project doesn&apos;t belong to organization or you don&apos;t
            have permission to access it.
          </p>

          <Button
            className="mt-6 bg-primary text-primary-foreground hover:opacity-90"
            onClick={() =>
              window.location.assign(
                ROUTES.WORKSPACE.ORGANIZATION(organizationSlug),
              )
            }
          >
            Back to Organization
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row">
        {/* Left column: settings & keys */}
        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-64">
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {projectId}
            </p>
            {loadingProject ? (
              <div className="mt-1 h-6 w-40 animate-pulse rounded-md bg-surface-hover" />
            ) : (
              <h1 className="truncate text-lg font-semibold text-foreground">
                {projectName || "Untitled project"}
              </h1>
            )}
          </div>

          <ProjectSettings
            projectName={projectName}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />

          <ApiKeyList
            apiKeys={apiKeys}
            onGenerate={handleCreateApiKey}
            onRename={handleRenameApiKey}
            onRevoke={handleRevokeApiKey}
          />
        </div>

        {/* Right column: logs */}
        <div className="min-w-0 flex-1">
          <LogsPanel
            logEvents={logEvents}
            isLoading={loadingLogs}
            page={pagination.page}
            pageSize={limit}
            total={pagination.total}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
