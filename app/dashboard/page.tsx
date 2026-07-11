// /app/dashboard

"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Organization = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const fetchOrganization = async () => {
    const response = await fetch("http://localhost:8000/api/organization", {
      credentials: "include",
    });
    const data = await response.json();
    setOrganizations(data.data);
    console.log("fetched organization data: " + JSON.stringify(data));
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchOrganization();
  }, [session]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in</div>;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const response = await fetch(
        "http://localhost:8000/api/organization/create",
        {
          method: "post",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: organizationName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setOrganizationName("");
        await fetchOrganization();
      }
      console.log("response create org: " + JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center  w-full h-screen">
      <div className="w-full container flex flex-col gap-4 p-8">
        <header className="flex justify-between">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome {session.user.name}</p>
          </div>

          <button
            className="bg-red-500 text-white p-2 rounded hover:opacity-80 cursor-pointer"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Log out
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <Input
            label="Create New Organization"
            name="name"
            placeholder="organization name"
            onChange={(e) => setOrganizationName(e.target.value)}
            value={organizationName}
          />
          <Button className="bg-green-600 mt-4">create</Button>
        </form>

        <h2 className="text-2xl font-bold">Your Organization</h2>
        <ul>
          {organizations.map((organization) => (
            <li key={organization.id}>{organization.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
