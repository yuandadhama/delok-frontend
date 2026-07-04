"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
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
