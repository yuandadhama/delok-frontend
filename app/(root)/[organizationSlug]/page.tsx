// app/[organizationSlug] - Workspace Overview
"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
      <p className="text-sm font-medium text-foreground">Workspace overview</p>
      <p className="text-xs text-muted-foreground">
        This page is under development for {organizationSlug}.
      </p>
    </div>
  );
};

export default Page;
