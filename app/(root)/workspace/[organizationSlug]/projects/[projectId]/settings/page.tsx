"use client";

import { useParams } from "next/navigation";

import {
  ProjectBreadcrumb,
  ProjectDangerZone,
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
      <div className="w-full max-w-4xl p-6">
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
    <div>
      {/* Sticky page header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="w-full max-w-4xl px-6 pt-5 pb-4">
          <ProjectBreadcrumb
            organizationSlug={organizationSlug}
            projectId={projectId}
            projectName={project.name}
            settings
          />
        </div>
      </div>

      {/* Page content */}
      <div className="w-full max-w-4xl flex flex-col p-6">
        <div className="space-y-12">
          <ProjectSettings projectName={project.name} onUpdate={handleUpdate} />

          <ApiKeyList
            apiKeys={apiKeys}
            isLoading={loadingKeys}
            onGenerate={handleCreateApiKey}
            onRename={handleRenameApiKey}
            onRevoke={handleRevokeApiKey}
          />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <ProjectDangerZone
            projectName={project.name}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
