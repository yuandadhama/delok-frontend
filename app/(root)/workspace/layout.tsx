// app/(root)/workspace/layout.tsx

import WorkspaceLayout from "@/src/views/workspace/WorkSpaceLayout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
