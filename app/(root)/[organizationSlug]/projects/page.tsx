// app/[organizationSlug]/projects - Project listing
"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Skeleton from "@/src/components/ui/Skeleton";
import { FolderKanban } from "lucide-react";
import { projectSchema, useProjects } from "@/src/domains/project";
import { delok } from "@/src/lib/delok";
import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  const {
    projects,
    isLoading: loadingProjects,
    isPending: pendingProjects,
    createProject,
  } = useProjects(organizationSlug);

  // Controlled input for the "create project" form
  const [projectName, setProjectName] = useState("");
  // Error message shown when project creation fails
  const [error, setError] = useState("");

  // Whether the form is currently submitting (to disable the button & show feedback)
  const [submitting, setSubmitting] = useState(false);

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

      delok.info({
        event: "project_created",
        message: "Project created",
        payload: {
          organizationSlug,
          name: result.data.name,
        },
      });

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              Projects
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Projects in this workspace
            </p>
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            {projects.length} total
          </span>
        </header>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Column: Create Project Form */}
          <div className="w-72 shrink-0">
            <Card className="p-4">
              <h2 className="text-xs font-semibold text-foreground mb-3 tracking-wide uppercase">
                Create Project
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  label="Project Name"
                  name="name"
                  placeholder="e.g. My API Service"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                />

                {error && (
                  <p className="text-xs text-danger font-medium">{error}</p>
                )}

                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  disabled={submitting || !projectName.trim()}
                >
                  {submitting ? "Creating..." : "Create Project"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Projects Grid */}
          <div className="flex-1 min-w-0">
            {/* State: still loading projects */}
            {(loadingProjects || pendingProjects) && (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            )}

            {/* State: loading finished but there are no projects */}
            {!loadingProjects && !pendingProjects && projects.length === 0 && (
              <EmptyState
                icon={<FolderKanban className="h-6 w-6" />}
                title="No projects yet"
                description="Get started by creating your first project on the left."
              />
            )}

            {/* State: projects available */}
            {!loadingProjects && !pendingProjects && projects.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={ROUTES.DASHBOARD.PROJECT(
                        organizationSlug,
                        project.id,
                      )}
                      className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-hover transition-all group"
                    >
                      <span>{project.name}</span>
                      <span className="text-xs text-muted-foreground font-mono group-hover:text-primary transition-colors">
                        Open →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
