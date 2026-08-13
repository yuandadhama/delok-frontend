// ./src/views/orgs/organization/projects/project/settings/ProjectSettingsView.tsx

"use client";

import {
  ProjectDangerZone,
  ProjectSettings,
  useProjectSettings,
} from "@/src/domains/project";

import {
  ApiKeyList,
  useProjectApiKeys,
} from "@/src/domains/api-key";

import type { Project } from "@/src/domains/project";

type ProjectSettingsViewProps = {
  organizationSlug: string;
  projectId: string;
  project: Project;
};

export function ProjectSettingsView({
  organizationSlug,
  projectId,
  project,
}: ProjectSettingsViewProps) {
  const { renameProject, deleteProject } = useProjectSettings(
    organizationSlug,
    projectId,
  );

  const {
    apiKeys,
    isLoading: loadingKeys,
    createApiKey,
    renameApiKey,
    revokeApiKey,
  } = useProjectApiKeys(projectId);

  return (
    <div className="w-full max-w-4xl flex flex-col p-4 sm:p-6">
      <div className="space-y-10 sm:space-y-12">
        <ProjectSettings projectName={project.name} onUpdate={renameProject} />

        <ApiKeyList
          apiKeys={apiKeys}
          isLoading={loadingKeys}
          onGenerate={(name) => createApiKey.mutateAsync(name)}
          onRename={(id, name) => renameApiKey.mutateAsync({ id, name })}
          onRevoke={(id) => revokeApiKey.mutateAsync(id)}
        />
      </div>

      <div className="mt-10 border-t border-border pt-6 sm:mt-12 sm:pt-8">
        <ProjectDangerZone
          projectName={project.name}
          onDelete={deleteProject}
        />
      </div>
    </div>
  );
}
