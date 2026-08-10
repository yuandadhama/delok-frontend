"use client";

import { useParams } from "next/navigation";

import Button from "@/src/components/ui/Button";

import { ProjectHeader, useProject } from "@/src/domains/project";

import { LogsPanel, useProjectLogs } from "@/src/domains/log";

import { ROUTES } from "@/src/constants/routes";

export default function ProjectPage() {
  const params = useParams<{
    organizationSlug: string;
    projectId: string;
  }>();

  const { organizationSlug, projectId } = params;

  const { project, isLoading: loadingProject, isError } = useProject(projectId);

  const {
    logs,
    pagination,
    page,
    isLoading: loadingLogs,
    selectedLog,
    filters,
    hasActiveFilters,
    limit,
    setPage,
    setFilter,
    clearFilters,
    setLimit,
    selectLog,
    closeLogDetail,
  } = useProjectLogs(projectId);

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading project...
        </p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-sm font-semibold">Project not found</h1>

        <p className="mt-2 text-xs text-muted-foreground">
          This project doesn&apos;t belong to this workspace or you don&apos;t
          have permission to access it.
        </p>

        <Button
          className="mt-5"
          onClick={() => {
            window.location.assign(ROUTES.WORKSPACE.PROJECTS(organizationSlug));
          }}
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full  flex flex-col">
      <ProjectHeader
        organizationSlug={organizationSlug}
        projectId={project.id}
        projectName={project.name}
      />

      <div className="flex-1 h-200 pb-10">
        <LogsPanel
          logs={logs}
          pagination={pagination}
          isLoading={loadingLogs}
          page={page}
          onPageChange={setPage}
          selectedLog={selectedLog}
          onSelectLog={selectLog}
          onCloseDetail={closeLogDetail}
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          limit={limit}
          onLimitChange={setLimit}
        />
      </div>
    </div>
  );
}
