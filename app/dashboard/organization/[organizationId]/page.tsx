// /app/dashboard/organization/[id]
"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { delok } from "@/src/lib/delok";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Project shape used by this page's list.
// Only the fields the UI actually needs (id for link/key, name for label).
type Project = {
  id: string;
  name: string;
};

const Page = () => {
  // Organization update form
  const [organizationName, setOrganizationName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete organization
  const [deleting, setDeleting] = useState(false);
  // Organization name, set once the fetch succeeds
  const [name, setName] = useState("");
  // Controlled input for the "create project" form
  const [projectName, setProjectName] = useState("");
  // List of projects belonging to this organization
  const [projects, setProjects] = useState<Project[]>([]);

  // Separate loading states for organization & projects,
  // so each section can have its own loading indicator
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [orgNotFound, setOrgNotFound] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Whether the form is currently submitting (to disable the button & show feedback)
  const [submitting, setSubmitting] = useState(false);
  // Error message shown when project creation fails
  const [error, setError] = useState("");

  // Grab :id from the URL, e.g. /dashboard/organization/abc123
  const params = useParams<{ organizationId: string }>();
  const organizationId = params.organizationId;

  // Fetch organization details based on the id in the URL
  const fetchOrganizationData = async () => {
    setLoadingOrg(true);
    setOrgNotFound(false);
    try {
      const response = await fetch(
        `http://localhost:8000/api/organization/${organizationId}`,
        { credentials: "include" }, // send session cookie to the backend
      );

      // If the response isn't 2xx (e.g. 404), treat it as "not found"
      if (!response.ok) {
        setOrgNotFound(true);
        return;
      }

      const data = await response.json();

      const { name } = data.data;

      setName(name);
      setOrganizationName(name);
    } catch (e) {
      // Network/parsing errors are also treated as "not found" to keep the UI consistent
      console.error("organization not found", e);
      setOrgNotFound(true);
    } finally {
      setLoadingOrg(false);
    }
  };

  // Fetch all projects belonging to this organization
  const fetchProjectData = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/organizations/${organizationId}/projects`,
        { credentials: "include" },
      );

      const data = await response.json();
      // Fallback to an empty array if data.data is null/undefined,
      // so the .map() below doesn't throw
      setProjects(data.data ?? []);
    } catch (e) {
      console.error("projects not found", e);
    } finally {
      setLoadingProjects(false);
    }
  };

  /**
   * Update organization name.
   */
  const handleUpdateOrganization = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!organizationName.trim()) return;

    setUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/organization/${organizationId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: organizationName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setName(data.data.name);
        alert("Organization updated");
      } else {
        alert(data.message ?? "Failed to update organization");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Delete organization.
   */
  const handleDeleteOrganization = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organization?",
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/organization/${organizationId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        alert(data.message ?? "Failed to delete organization");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  // Fetch organization & project data as soon as the URL id is available.
  // Both are independent, so they can run in parallel (no need to wait on each other).
  useEffect(() => {
    if (!organizationId) return;

    fetchOrganizationData();
    fetchProjectData();
  }, [organizationId]);

  // Handler for submitting the "create project" form
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    delok.info({
      event: "form create project submitted",
    });
    e.preventDefault(); // prevent full page reload
    if (!projectName.trim()) return; // guard: don't submit an empty name

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:8000/api/organizations/${organizationId}/projects`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: projectName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Success: reset the input & refresh the project list
        setProjectName("");
        await fetchProjectData();
      } else {
        // Server responded with an error: surface it to the user
        setError(data?.message ?? "Failed to create project");
      }
    } catch (e) {
      // Unexpected/network error
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // While the organization data is still being fetched, show a loading state.
  // This prevents "Organization not found" from flashing before the data arrives.
  if (loadingOrg) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-sm text-gray-400">
        Loading organization...
      </div>
    );
  }

  // Fetch finished but the organization genuinely doesn't exist / fetch failed
  if (orgNotFound || !name) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-sm text-gray-500">
        Organization not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto flex gap-5 px-6 py-8">
        {/* Left column: org settings & create project */}
        <div className="w-64 shrink-0 flex flex-col gap-4">
          <div>
            <p className="text-[11px] text-gray-400">
              Organization ID: {organizationId}
            </p>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h1>
          </div>

          {/* Organization Management */}
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <h2 className="text-xs font-semibold text-gray-700 mb-2">
              Organization Settings
            </h2>

            <form
              onSubmit={handleUpdateOrganization}
              className="flex flex-col gap-2"
            >
              <Input
                label="Organization Name"
                name="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Organization name"
              />

              <Button
                disabled={updating}
                className="bg-gray-900 text-xs py-1.5"
              >
                {updating ? "Updating..." : "Update Organization"}
              </Button>
            </form>

            <div className=" border-t border-gray-100 pt-2.5">
              <Button
                onClick={handleDeleteOrganization}
                disabled={deleting}
                className="w-full  border border-red-200 bg-red-600 text-xs py-1.5 hover:bg-red-500"
              >
                {deleting ? "Deleting..." : "Delete Organization"}
              </Button>
            </div>
          </div>

          {/* Create project */}
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Input
                label="Create New Project"
                name="name"
                placeholder="Project name"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
              />
              {/* Only render the error message when there is one */}
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button
                className="bg-gray-900 text-xs py-1.5 disabled:opacity-50"
                // Disable the button while submitting or when the input is empty
                disabled={submitting || !projectName.trim()}
              >
                {submitting ? "Creating..." : "Create"}
              </Button>
            </form>
          </div>

          {/* Space reserved for future features */}
          {/* e.g. members, billing, usage overview */}
        </div>

        {/* Right column: projects list */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Projects in {name}
          </h2>

          {/* State: still loading projects */}
          {loadingProjects && (
            <p className="text-xs text-gray-400">Loading projects...</p>
          )}

          {/* State: loading finished but there are no projects */}
          {!loadingProjects && projects.length === 0 && (
            <p className="text-xs text-gray-400 italic">
              No projects yet. Create one on the left.
            </p>
          )}

          {/* State: projects available */}
          <ul className="flex flex-col gap-1.5">
            {projects.map((project) => (
              <li key={project.id}>
                {/* Clicking a project name navigates to its detail page */}
                <Link
                  href={`/dashboard/organization/${organizationId}/project/${project.id}`}
                  className="block bg-white border border-gray-100 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-200 transition-colors"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
