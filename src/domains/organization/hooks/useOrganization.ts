"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../api/organization.service";
import type { UpdateOrganizationInput } from "../types/organization.type";

export function useOrganization(slug: string | undefined) {
  const orgKey = ["organization", slug] as const;

  const { data: organization, ...query } = useQuery({
    queryKey: orgKey,
    queryFn: () => OrganizationService.getBySlug(slug!),
    enabled: Boolean(slug),
  });

  const queryClient = useQueryClient();

  const updateOrganization = useMutation({
    mutationFn: (input: UpdateOrganizationInput) =>
      OrganizationService.update(slug!, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(orgKey, updated);
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: () => OrganizationService.delete(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return {
    organization,
    ...query,
    updateOrganization,
    deleteOrganization,
  };
}
