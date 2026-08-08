"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectService } from "../api/project.service";

export function useProject(projectId: string) {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectService.getById(projectId),
    enabled: Boolean(projectId),
  });

  return {
    project: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
