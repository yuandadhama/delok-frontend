// /app/dashboard

"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import {
  organizationSchema,
  useOrganizations,
} from "@/src/domains/organization";
import { authClient } from "@/src/lib/auth/auth-client";
import { delok } from "@/src/lib/delok";
import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const {
    organizations,
    isLoading: loadingOrganizations,
    createOrganization,
  } = useOrganizations();

  const hasLogged = useRef(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    if (hasLogged.current) return;
    hasLogged.current = true;

    delok.info({
      event: "user_open_dashboard",
      message: "User opened dashboard page",
      payload: {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }, [session]);

  const [organizationName, setOrganizationName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = organizationSchema.safeParse({
      name: organizationName,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await createOrganization.mutateAsync(result.data);

      delok.info({
        event: "organization_created",
        message: "delok sdk works",
        payload: {
          name: organizationName,
        },
      });
      setOrganizationName("");
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.HOME);
        },
        onError: () => {
          setLoggingOut(false);
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-background text-sm text-muted-foreground">
        You are not logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 px-6 py-8">
        {/* Header: Welcome Message + Logout Button */}
        <header className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              Workspace
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Welcome back,{" "}
              <span className="text-foreground font-medium">
                {session.user.name}
              </span>
            </p>
          </div>

          <button
            className="text-xs font-medium text-muted-foreground border border-border bg-surface px-3 py-1.5 rounded-md hover:bg-surface-hover hover:text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </header>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Column: Create Organization Form */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
              <h2 className="text-xs font-semibold text-foreground mb-3 tracking-wide uppercase">
                Create Workspace
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  label="Organization Name"
                  name="name"
                  placeholder="e.g. Acme Inc"
                  onChange={(e) => setOrganizationName(e.target.value)}
                  value={organizationName}
                />

                {error && (
                  <p className="text-xs text-danger font-medium">{error}</p>
                )}

                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  disabled={submitting || !organizationName.trim()}
                >
                  {submitting ? "Creating..." : "Create Organization"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Organizations List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Your Organizations
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {organizations.length} total
              </span>
            </div>

            {/* State: Loading Organizations */}
            {loadingOrganizations && (
              <div className="bg-surface border border-border rounded-xl p-6 text-center">
                <p className="text-xs text-muted-foreground animate-pulse">
                  Loading organizations...
                </p>
              </div>
            )}

            {/* State: Empty List */}
            {!loadingOrganizations && organizations.length === 0 && (
              <div className="bg-surface border border-dashed border-border rounded-xl p-10 text-center flex flex-col items-center gap-3">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-surface-hover text-muted-foreground">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5A1.5 1.5 0 0 1 4.5 3h4l2 2h5A1.5 1.5 0 0 1 17 6.5v9a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="text-xs text-muted-foreground">
                  No organizations found. Get started by creating your first
                  workspace on the left.
                </p>
              </div>
            )}

            {/* State: Organizations Available */}
            <ul className="flex flex-col gap-2">
              {organizations.map((organization) => (
                <li key={organization.id}>
                  <Link
                    href={ROUTES.DASHBOARD.ORGANIZATION(organization.slug)}
                    className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-hover transition-all group"
                  >
                    <span>{organization.name}</span>
                    <span className="text-xs text-muted-foreground font-mono group-hover:text-primary transition-colors">
                      View →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
