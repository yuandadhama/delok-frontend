// ./app/(root)/workspace/[organizationSlug]/projects/page.tsx

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
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      {/* Header */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground sm:text-lg">
            Projects
          </h1>

          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1">
            Projects in this workspace
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {!loading && (
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
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
