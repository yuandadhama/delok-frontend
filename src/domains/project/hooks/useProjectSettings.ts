// ./src/domains/project/hooks/useProjectSettings.ts

"use client";

import { useRouter } from "next/navigation";

import { showToast } from "@/src/components/ui/toast";

import { ROUTES } from "@/src/constants/routes";

import { useProjects } from "./useProjects";

/**
 * Project settings actions for a single project: rename and delete (with
 * navigation back to the organization's project list). Reuses the shared
 * project mutations from `useProjects` so project API logic stays owned by the
 * project domain.
 *
 * The mutations are controlled directly by React Query: `mutateAsync` drives
 * the loading state (`isPending`) and the cache is synchronized in each
 * mutation's `onSuccess`, so the project name is only committed to the UI
 * after the API succeeds.
 */
export function useProjectSettings(
  organizationSlug: string,
  projectId: string,
) {
  const router = useRouter();

  const { updateProject, deleteProject } = useProjects(organizationSlug);

  const renameProject = async (name: string) => {
    await updateProject.mutateAsync({ projectId, name });
  };

  const deleteProjectAndNavigate = async () => {
    await deleteProject.mutateAsync(projectId);

    showToast({ message: "Project deleted", type: "success" });

    router.replace(ROUTES.ORGANIZATION.PROJECTS(organizationSlug));
  };

  return {
    renameProject,
    deleteProject: deleteProjectAndNavigate,
    isRenaming: updateProject.isPending,
    isDeleting: deleteProject.isPending,
  };
}
