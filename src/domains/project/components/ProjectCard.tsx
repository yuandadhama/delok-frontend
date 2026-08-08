// src/domains/project/components/ProjectCard.tsx

import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";

import type { Project } from "../types/project.type";
import { ROUTES } from "@/src/constants/routes";

type ProjectCardProps = {
  project: Project;
  organizationSlug: string;
};

export function ProjectCard({ project, organizationSlug }: ProjectCardProps) {
  return (
    <Link
      href={ROUTES.WORKSPACE.PROJECT(organizationSlug, project.id)}
      className="
        group
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-border
        bg-surface
        px-4
        py-3
        transition-all
        hover:border-primary/50
        hover:bg-surface-hover
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <FolderKanban className="h-4 w-4" />
        </div>

        <span className="truncate text-sm font-medium text-foreground">
          {project.name}
        </span>
      </div>

      <ArrowRight
        className="
          h-4
          w-4
          shrink-0
          text-muted-foreground
          transition-transform
          group-hover:translate-x-1
          group-hover:text-primary
        "
      />
    </Link>
  );
}
