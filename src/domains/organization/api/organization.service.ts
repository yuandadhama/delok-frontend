import type {
  CreateOrganizationInput,
  Organization,
  UpdateOrganizationInput,
} from "../types/organization.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * OrganizationService
 *
 * Centralized service for all organization-related API requests.
 * The backend uses organization *slugs* as the URL identifier for
 * single-resource operations (`/api/organization/:slug`).
 */
export class OrganizationService {
  /**
   * List all organizations the authenticated user belongs to.
   * @returns `GET /api/organization`
   */
  static async list(): Promise<Organization[]> {
    const response = await fetch(`${API_BASE_URL}/api/organization`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch organizations");
    }

    const data = await response.json();
    return data.data ?? [];
  }

  /**
   * Create a new organization. The authenticated user becomes the OWNER.
   * @returns `POST /api/organization`
   */
  static async create(input: CreateOrganizationInput): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to create organization");
    }

    return data.data;
  }

  /**
   * Get a single organization by slug.
   * @returns `GET /api/organization/:slug`
   */
  static async getBySlug(slug: string): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message ?? "Failed to fetch organization");
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Update an organization's name. The slug is regenerated from the new name.
   * @returns `PATCH /api/organization/:slug`
   */
  static async update(
    slug: string,
    input: UpdateOrganizationInput,
  ): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to update organization");
    }

    return data.data;
  }

  /**
   * Delete an organization by slug. Cascades to projects, API keys, members.
   * @returns `DELETE /api/organization/:slug`
   */
  static async delete(slug: string): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/api/organization/${slug}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message ?? "Failed to delete organization");
    }

    return data.data;
  }
}
