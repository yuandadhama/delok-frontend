"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../api/project.service";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project.type";

export function useProjects(organizationSlug: string | undefined) {
  const projectsKey = ["projects", organizationSlug] as const;

  const { data: projects, ...query } = useQuery({
    queryKey: projectsKey,
    queryFn: () => ProjectService.listByOrganization(organizationSlug!),
    enabled: Boolean(organizationSlug),
  });

  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: (input: CreateProjectInput) =>
      ProjectService.create(organizationSlug!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey });
    },
  });

  const updateProject = useMutation({
    mutationFn: (input: { projectId: string } & UpdateProjectInput) =>
      ProjectService.update(input.projectId, { name: input.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey });
    },
  });

  const deleteProject = useMutation({
    mutationFn: (projectId: string) => ProjectService.delete(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKey });
    },
  });

  return {
    projects: projects ?? [],
    ...query,
    createProject,
    updateProject,
    deleteProject,
  };
}
