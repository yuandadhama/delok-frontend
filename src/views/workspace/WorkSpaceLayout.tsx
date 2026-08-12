// ./src/pages/workspace/WorkspaceLayout.tsx

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/src/lib/auth/auth-client";
import { ROUTES } from "@/src/constants/routes";

import WorkspaceLoading from "@/src/views/workspace/components/WorkspaceLoading";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace(ROUTES.AUTH.SIGN_IN);
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <WorkspaceLoading />;
  }

  if (!session) {
    return null;
  }

  return children;
}
