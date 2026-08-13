// ./src/domains/project/hooks/useProjectSettings.ts

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ROUTES } from "@/src/constants/routes";

import { useProjects } from "./useProjects";

/**
 * Project settings actions for a single project: rename (with its success
 * notification) and delete (with navigation back to the organization's
 * project list). Reuses the shared project mutations from `useProjects` so
 * project API logic stays owned by the project domain.
 */
export function useProjectSettings(
  organizationSlug: string,
  projectId: string,
) {
  const router = useRouter();

  const { updateProject, deleteProject } = useProjects(organizationSlug);

  const renameProject = async (name: string) => {
    await updateProject.mutateAsync({ projectId, name });

    toast.success("Project renamed", { id: "project-rename" });
  };

  const deleteProjectAndNavigate = async () => {
    await deleteProject.mutateAsync(projectId);

    router.replace(ROUTES.ORGANIZATION.PROJECTS(organizationSlug));
  };

  return {
    renameProject,
    deleteProject: deleteProjectAndNavigate,
    isRenaming: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  };
}
