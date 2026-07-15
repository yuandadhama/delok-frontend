// /app/dashboard

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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
      const data = await response.json();
      // Fallback to an empty array if data.data is null/undefined,
      // so .map() below doesn't throw
      setOrganizations(data.data ?? []);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent full page reload
    if (!organizationName.trim()) return; // guard: don't submit an empty name

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/organization", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: organizationName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: reset the input & refresh the organization list
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
      <div className="flex justify-center items-center w-full h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  // No session at all: user isn't authenticated
  if (!session) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-gray-500">
        You are not logged in
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full container flex flex-col gap-6 p-8">
        {/* Header: welcome message + logout button */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome, {session.user.name}</p>
          </div>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Log out"}
          </button>
        </header>

        {/* Form to create a new organization */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              label="Create New Organization"
              name="name"
              placeholder="Organization name"
              onChange={(e) => setOrganizationName(e.target.value)}
              value={organizationName}
            />
            {/* Only render the error message when there is one */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              className="bg-green-600 mt-2 disabled:opacity-50"
              disabled={submitting || !organizationName.trim()}
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </div>

        {/* List of organizations the user belongs to */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your Organizations
          </h2>

          {/* State: still loading organizations */}
          {loadingOrganizations && (
            <p className="text-sm text-gray-400">Loading organizations...</p>
          )}

          {/* State: loading finished but there are no organizations */}
          {!loadingOrganizations && organizations.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No organizations yet. Create one above.
            </p>
          )}

          {/* State: organizations available */}
          <ul className="flex flex-col gap-2">
            {organizations.map((organization) => (
              <li key={organization.id}>
                {/* Clicking an organization navigates to its detail page */}
                <Link
                  href={`/dashboard/organization/${organization.id}`}
                  className="block bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow font-medium text-gray-800"
                >
                  {organization.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
