// ./src/pages/workspace/components/WorkspaceOverview.tsx

import {
  GetStartedSection,
  OrganizationsPanel,
} from "@/src/domains/organization";

import type { Organization } from "@/src/domains/organization";

type WorkspaceOverviewProps = {
  organizations: Organization[];
  isLoading: boolean;
};

export default function WorkspaceOverview({
  organizations,
  isLoading,
}: WorkspaceOverviewProps) {
  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
      <GetStartedSection />

      <OrganizationsPanel organizations={organizations} isLoading={isLoading} />
    </section>
  );
}
