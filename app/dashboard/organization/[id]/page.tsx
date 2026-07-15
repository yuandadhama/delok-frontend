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
  const params = useParams<{ id: string }>();
  const id = params.id;

  // Fetch organization details based on the id in the URL
  const fetchOrganizationData = async () => {
    setLoadingOrg(true);
    setOrgNotFound(false);
    try {
      const response = await fetch(
        `http://localhost:8000/api/organization/${id}`,
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
        `http://localhost:8000/api/project/organization/${id}`,
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

  // Fetch organization & project data as soon as the URL id is available.
  // Both are independent, so they can run in parallel (no need to wait on each other).
  useEffect(() => {
    if (!id) return;

    fetchOrganizationData();
    fetchProjectData();
  }, [id]);

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
      const response = await fetch("http://localhost:8000/api/project", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          organizationId: id,
        }),
      });

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
      <div className="flex justify-center items-center w-full h-screen text-gray-400">
        Loading organization...
      </div>
    );
  }

  // Fetch finished but the organization genuinely doesn't exist / fetch failed
  if (orgNotFound || !name) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-gray-500">
        Organization not found
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full container flex flex-col gap-6 p-8">
        {/* Header: organization id & name */}
        <div>
          <h1 className="text-sm text-gray-400">Organization ID: {id}</h1>
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        </div>

        {/* Form to create a new project */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Create New Project"
              name="name"
              placeholder="Project name"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
            {/* Only render the error message when there is one */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              className="bg-green-600 mt-2 disabled:opacity-50"
              // Disable the button while submitting or when the input is empty
              disabled={submitting || !projectName.trim()}
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>

        {/* List of projects in this organization */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Projects in {name}
          </h2>

          {/* State: still loading projects */}
          {loadingProjects && (
            <p className="text-sm text-gray-400">Loading projects...</p>
          )}

          {/* State: loading finished but there are no projects */}
          {!loadingProjects && projects.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No projects yet. Create one above.
            </p>
          )}

          {/* State: projects available */}
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li key={project.id}>
                {/* Clicking a project name navigates to its detail page */}
                <Link
                  href={`/dashboard/organization/${id}/project/${project.id}`}
                  className="block bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow font-medium text-gray-800"
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
