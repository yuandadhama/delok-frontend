"use client";

import Button from "@/src/component/ui/Button";
import Input from "@/src/component/ui/Input";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");

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
      const data = response.json();
      console.log("response create org: " + data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <form onSubmit={handleSubmit}>
        <Input
          label="organization name"
          name="name"
          onChange={(e) => setOrganizationName(e.target.value)}
          value={organizationName}
        />
        <Button className="bg-green-600">create</Button>
      </form>
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
    </div>
  );
}
