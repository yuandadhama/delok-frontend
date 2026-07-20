// /app/dashboard

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { organizationSchema } from "@/src/features/organization/organization.schema";
import { authClient } from "@/src/lib/auth-client";
import { delok } from "@/src/lib/delok";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Organization = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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
  // Controlled input for the "create organization" form
  const [organizationName, setOrganizationName] = useState("");
  // List of organizations the current user belongs to
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Loading state for the organizations fetch (separate from session's own isPending)
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  // Whether the create-organization form is currently submitting
  const [submitting, setSubmitting] = useState(false);
  // Error message shown when creating an organization fails
  const [error, setError] = useState("");
  // Whether logout is in progress, to prevent double clicks
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch all organizations belonging to the logged-in user
  const fetchOrganization = async () => {
    setLoadingOrganizations(true);
    try {
      const response = await fetch("http://localhost:8000/api/organization", {
        credentials: "include",
      });
      const result = await response.json();
      // Fallback to an empty array if data.data is null/undefined,
      // so .map() below doesn't throw
      setOrganizations(result.data ?? []);
    } catch (e) {
      console.error("failed to fetch organizations", e);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  // Only fetch organizations once we know who the user is
  useEffect(() => {
    if (!session?.user?.id) return;

    fetchOrganization();
  }, [session]);

  // Handler for submitting the "create organization" form
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent full page reload

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
      const response = await fetch("http://localhost:8000/api/organization", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: reset the input & refresh the organization list
        delok.info({
          event: "organization_created",
          message: "delok sdk works",
          payload: {
            name: organizationName,
          },
        });
        setOrganizationName("");
        await fetchOrganization();
      } else {
        // Server responded with an error: surface it to the user
        setError(data?.message ?? "Failed to create organization");
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for logging out via authClient
  const handleLogout = () => {
    setLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          // Reset the button if logout fails, so the user can retry
          setLoggingOut(false);
        },
      },
    });
  };

  // Session is still being resolved by better-auth
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  // No session at all: user isn't authenticated
  if (!session) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-sm text-gray-500">
        You are not logged in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col gap-5 px-6 py-8">
        {/* Header: welcome message + logout button */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Welcome, {session.user.name}
            </p>
          </div>

          <button
            className="text-xs font-medium text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </header>

        <div className="flex gap-5">
          {/* Left column: create organization */}
          <div className="w-64 shrink-0 flex flex-col gap-4">
            <div className="bg-white border border-gray-100 rounded-lg p-3">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <Input
                  label="Create New Organization"
                  name="name"
                  placeholder="Organization name"
                  onChange={(e) => setOrganizationName(e.target.value)}
                  value={organizationName}
                />
                {/* Only render the error message when there is one */}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <Button
                  className="bg-gray-900 text-xs py-1.5 disabled:opacity-50"
                  disabled={submitting || !organizationName.trim()}
                >
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </form>
            </div>

            {/* Space reserved for future features */}
            {/* e.g. account settings, billing overview */}
          </div>

          {/* Right column: organizations list */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Your Organizations
            </h2>

            {/* State: still loading organizations */}
            {loadingOrganizations && (
              <p className="text-xs text-gray-400">Loading organizations...</p>
            )}

            {/* State: loading finished but there are no organizations */}
            {!loadingOrganizations && organizations.length === 0 && (
              <p className="text-xs text-gray-400 italic">
                No organizations yet. Create one on the left.
              </p>
            )}

            {/* State: organizations available */}
            <ul className="flex flex-col gap-1.5">
              {organizations.map((organization) => (
                <li key={organization.id}>
                  {/* Clicking an organization navigates to its detail page */}
                  <Link
                    href={`/dashboard/organization/${organization.id}`}
                    className="block bg-white border border-gray-100 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-200 transition-colors"
                  >
                    {organization.name}
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
