// src/domains/project/hooks/useProjects.ts

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ProjectService } from "../api/project.service";

import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project.type";

export function useProjects(organizationSlug: string | undefined) {
  const queryClient = useQueryClient();

  const projectsKey = ["projects", organizationSlug] as const;

  const query = useQuery({
    queryKey: projectsKey,
    queryFn: () => ProjectService.listByOrganization(organizationSlug!),
    enabled: Boolean(organizationSlug),
  });

  const createProject = useMutation({
    mutationFn: (input: CreateProjectInput) =>
      ProjectService.create(organizationSlug!, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsKey,
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: (input: { projectId: string } & UpdateProjectInput) =>
      ProjectService.update(input.projectId, {
        name: input.name,
      }),

    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: projectsKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["project", input.projectId],
      });
    },
  });

  const deleteProject = useMutation({
    mutationFn: (projectId: string) => ProjectService.delete(projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectsKey,
      });
    },
  });

  return {
    projects: query.data ?? [],

    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,

    createProject,
    updateProject,
    deleteProject,
  };
}
