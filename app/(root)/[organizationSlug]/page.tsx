// /[organizationSlug]
"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useOrganization } from "@/src/domains/organization";
import { projectSchema, useProjects } from "@/src/domains/project";
import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  const {
    organization,
    isPending: loadingOrg,
    isError: orgError,
    updateOrganization,
    deleteOrganization,
  } = useOrganization(organizationSlug);

  const {
    projects,
    isLoading: loadingProjects,
    isPending: pendingProjects,
    createProject,
  } = useProjects(organizationSlug);

  // Organization update form
  const [organizationName, setOrganizationName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete organization
  const [deleting, setDeleting] = useState(false);

  // Controlled input for the "create project" form
  const [projectName, setProjectName] = useState("");
  // Error message shown when project creation fails
  const [error, setError] = useState("");

  // Whether the form is currently submitting (to disable the button & show feedback)
  const [submitting, setSubmitting] = useState(false);

  const name = organization?.name ?? "";

  /**
   * Update organization name. Slug is regenerated server-side, so the
   * URL identifier changes on success.
   */
  const handleUpdateOrganization = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!organizationName.trim()) return;

    setUpdating(true);

    try {
      const updated = await updateOrganization.mutateAsync({
        name: organizationName,
      });
      // Slug is regenerated server-side, so navigate to the new slug URL.
      if (updated.slug && updated.slug !== organizationSlug) {
        router.replace(ROUTES.DASHBOARD.ORGANIZATION(updated.slug));
      }
      alert("Organization updated");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
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
      await deleteOrganization.mutateAsync();
      window.location.href = ROUTES.DASHBOARD.ROOT;
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  // Handler for submitting the "create project" form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent full page reload
    if (!projectName.trim()) return; // guard: don't submit an empty name

    const result = projectSchema.safeParse({ name: projectName });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createProject.mutateAsync(result.data);
      // Success: reset the input (list refreshes via react-query)
      setProjectName("");
    } catch (err) {
      // Server responded with an error: surface it to the user
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // While the organization data is still being fetched, show a loading state.
  if (loadingOrg) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Loading organization...
      </div>
    );
  }

  // Fetch finished but the organization genuinely doesn't exist / fetch failed
  if (orgError || !organization) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex gap-6 px-6 py-8">
        {/* Left column: org settings & create project */}
        <div className="w-64 shrink-0 flex flex-col gap-4">
          <div>
            <p className="text-[11px] font-mono text-muted-foreground">
              Organization slug: {organizationSlug}
            </p>
            <h1 className="text-lg font-semibold text-foreground truncate tracking-tight">
              {name}
            </h1>
          </div>

          {/* Organization Management */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-sm flex flex-col gap-3">
            <h2 className="text-xs font-semibold text-foreground">
              Organization Settings
            </h2>

            <form
              onSubmit={handleUpdateOrganization}
              className="flex flex-col gap-2"
            >
              <Input
                label="Organization Name"
                name="organizationName"
                value={organizationName || organization.name}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Organization name"
              />

              <Button
                disabled={updating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Organization"}
              </Button>
            </form>

            <div className="border-t border-border pt-2.5">
              <Button
                onClick={handleDeleteOrganization}
                disabled={deleting}
                className="w-full border border-danger/20 bg-danger/10 text-danger hover:bg-danger/20 text-xs py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Organization"}
              </Button>
            </div>
          </div>

          {/* Create project */}
          <div className="bg-surface border border-border rounded-xl p-3 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Input
                label="Create New Project"
                name="name"
                placeholder="Project name"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
              />
              {/* Only render the error message when there is one */}
              {error && (
                <p className="text-xs text-danger font-medium">{error}</p>
              )}
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
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
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Projects in {name}
          </h2>

          {/* State: still loading projects */}
          {(loadingProjects || pendingProjects) && (
            <p className="text-xs text-muted-foreground animate-pulse">
              Loading projects...
            </p>
          )}

          {/* State: loading finished but there are no projects */}
          {!loadingProjects && !pendingProjects && projects.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              No projects yet. Create one on the left.
            </p>
          )}

          {/* State: projects available */}
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li key={project.id}>
                {/* Clicking a project name navigates to its detail page */}
                <Link
                  href={ROUTES.DASHBOARD.PROJECT(organizationSlug, project.id)}
                  className="block bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-hover transition-all"
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
