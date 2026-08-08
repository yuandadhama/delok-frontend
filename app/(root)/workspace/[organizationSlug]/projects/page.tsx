"use client";

import { useParams } from "next/navigation";

import {
  CreateProjectModal,
  ProjectEmptyState,
  ProjectList,
  ProjectListSkeleton,
  useProjects,
} from "@/src/domains/project";

export default function ProjectsPage() {
  const params = useParams<{
    organizationSlug: string;
  }>();

  const organizationSlug = params.organizationSlug;

  const { projects, isLoading, isPending } = useProjects(organizationSlug);

  const loading = isLoading || isPending;

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Projects</h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Projects in this workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <span className="font-mono text-xs text-muted-foreground">
              {projects.length} total
            </span>
          )}

          <CreateProjectModal organizationSlug={organizationSlug} />
        </div>
      </header>

      {/* Content */}
      <section>
        {loading && <ProjectListSkeleton />}

        {!loading && projects.length === 0 && <ProjectEmptyState />}

        {!loading && projects.length > 0 && (
          <ProjectList
            projects={projects}
            organizationSlug={organizationSlug}
          />
        )}
      </section>
    </div>
  );
}
