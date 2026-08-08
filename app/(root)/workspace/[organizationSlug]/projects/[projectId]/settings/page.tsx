"use client";

import { useParams } from "next/navigation";

import {
  ProjectBreadcrumb,
  ProjectSettings,
  useProject,
  useProjects,
} from "@/src/domains/project";

import { ApiKeyList, ApiKeyService } from "@/src/domains/api-key";

import { useEffect, useState } from "react";

export default function ProjectSettingsPage() {
  const params = useParams<{
    organizationSlug: string;
    projectId: string;
  }>();

  const { organizationSlug, projectId } = params;

  const { project, isLoading } = useProject(projectId);

  const { updateProject, deleteProject } = useProjects(organizationSlug);

  const [apiKeys, setApiKeys] = useState<
    Awaited<ReturnType<typeof ApiKeyService.listByProject>>
  >([]);

  const [loadingKeys, setLoadingKeys] = useState(true);

  const loadApiKeys = async () => {
    try {
      setLoadingKeys(true);

      const keys = await ApiKeyService.listByProject(projectId);

      setApiKeys(keys);
    } finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, [projectId]);

  if (isLoading || !project) {
    return (
      <div className="p-6">
        <p className="text-xs text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  const handleUpdate = async (name: string) => {
    await updateProject.mutateAsync({
      projectId,
      name,
    });
  };

  const handleDelete = async () => {
    await deleteProject.mutateAsync(projectId);

    window.location.assign(`/workspace/${organizationSlug}/projects`);
  };

  const handleCreateApiKey = async (name: string) => {
    const key = await ApiKeyService.create(projectId, { name });

    await loadApiKeys();

    return key;
  };

  const handleRenameApiKey = async (id: string, name: string) => {
    await ApiKeyService.rename(id, name);

    await loadApiKeys();
  };

  const handleRevokeApiKey = async (id: string) => {
    await ApiKeyService.revoke(id);

    await loadApiKeys();
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <ProjectBreadcrumb
          organizationSlug={organizationSlug}
          projectId={projectId}
          projectName={project.name}
          settings
        />
      </div>

      <div className="space-y-6">
        <ProjectSettings
          projectName={project.name}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <ApiKeyList
          apiKeys={apiKeys}
          isLoading={loadingKeys}
          onGenerate={handleCreateApiKey}
          onRename={handleRenameApiKey}
          onRevoke={handleRevokeApiKey}
        />
      </div>
    </div>
  );
}
