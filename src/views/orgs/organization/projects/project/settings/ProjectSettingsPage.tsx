// ./src/views/orgs/organization/projects/project/settings/ProjectSettingsPage.tsx

"use client";

import { useParams } from "next/navigation";

import { ProjectBreadcrumb, useProject } from "@/src/domains/project";

import ProjectSettingsLoading from "./ProjectSettingsLoading";
import { ProjectSettingsView } from "./ProjectSettingsView";

export default function ProjectSettingsPage() {
  const { organizationSlug, projectId } = useParams<{
    organizationSlug: string;
    projectId: string;
  }>();

  const { project, isLoading } = useProject(organizationSlug, projectId);

  if (isLoading || !project) {
    return <ProjectSettingsLoading />;
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="w-full max-w-4xl px-4 pt-4 pb-3 sm:px-6 sm:pt-5 sm:pb-4">
          <ProjectBreadcrumb
            organizationSlug={organizationSlug}
            projectId={projectId}
            projectName={project.name}
            settings
          />
        </div>
      </header>

      <ProjectSettingsView
        organizationSlug={organizationSlug}
        projectId={projectId}
        project={project}
      />
    </div>
  );
}
