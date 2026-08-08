// src/domains/project/api/project.service.ts

import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "../types/project.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * ProjectService
 *
 * Centralized service for all project-related API requests.
 *
 * Projects are mounted at two URL prefixes:
 * - `/api/organizations/:organizationSlug/projects` — list/create within an org
 * - `/api/project/:id` — get/update/delete individual project
 */
export class ProjectService {
  /**
   * List all projects belonging to an organization.
   * @returns `GET /api/organizations/:organizationSlug/projects`
   */
  static async listByOrganization(
    organizationSlug: string,
  ): Promise<Project[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects`,
      { credentials: "include" },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch projects");
    }

    const data = await response.json();
    return data.data ?? [];
  }

  /**
   * Create a project inside an organization. Requires org OWNER role.
   * @returns `POST /api/organizations/:organizationSlug/projects`
   */
  static async create(
    organizationSlug: string,
    input: CreateProjectInput,
  ): Promise<Project> {
    const response = await fetch(
      `${API_BASE_URL}/api/organizations/${organizationSlug}/projects`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to create project");
    }

    return data.data;
  }

  /**
   * Get a single project by id.
   * @returns `GET /api/project/:id`
   */
  static async getById(projectId: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/project/${projectId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch project");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Update a project's name. Requires parent org OWNER role.
   * @returns `PATCH /api/project/:id`
   */
  static async update(
    projectId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/project/${projectId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to update project");
    }

    return data.data;
  }

  /**
   * Delete a project. Cascades to all ApiKeys and LogEvents.
   * @returns `DELETE /api/project/:id`
   */
  static async delete(projectId: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/project/${projectId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to delete project");
    }

    return data.data;
  }
}
