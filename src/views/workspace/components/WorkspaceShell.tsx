// ./src/pages/workspace/components/WorkspcaeShell.tsx

import { ReactNode } from "react";

import { WorkspaceTopbar } from "@/src/components/layout/topbar/WorkspaceTopbar";

type WorkspaceShellProps = {
  children: ReactNode;
};

export default function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <WorkspaceTopbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
