"use client";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { useOrganization } from "@/src/domains/organization";
import { delok } from "@/src/lib/delok";
import { ROUTES } from "@/src/constants/routes";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  const {
    organization,
    isPending: loadingOrg,
    isError: orgError,
    updateOrganization,
    deleteOrganization,
  } = useOrganization(organizationSlug);

  // Organization update form
  const [organizationName, setOrganizationName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete organization
  const [deleting, setDeleting] = useState(false);

  const name = organization?.name ?? "";

  const handleUpdateOrganization = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!organizationName.trim()) return;

    setUpdating(true);

    try {
      const updated = await updateOrganization.mutateAsync({
        name: organizationName,
      });

      delok.info({
        event: "organization_updated",
        message: "Organization updated",
        payload: {
          organizationSlug,
          name: updated.name,
        },
      });

      if (updated.slug && updated.slug !== organizationSlug) {
        router.replace(ROUTES.WORKSPACE.ORGANIZATION(updated.slug));
      }
      setOrganizationName("");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteOrganization = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organization?",
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteOrganization.mutateAsync();

      delok.info({
        event: "organization_deleted",
        message: "Organization deleted",
        payload: {
          organizationSlug,
        },
      });

      window.location.href = ROUTES.WORKSPACE.ROOT;
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingOrg) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[50vh] bg-background text-sm text-muted-foreground">
        Loading organization...
      </div>
    );
  }

  if (orgError || !organization) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-[50vh] bg-background text-sm text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 px-6 py-8">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Organization Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your workspace settings
        </p>
      </div>

      {/* Update organization name */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-foreground mb-3 tracking-wide uppercase">
          General
        </h3>
        <form
          onSubmit={handleUpdateOrganization}
          className="flex flex-col gap-3"
        >
          <Input
            label="Organization Name"
            name="organizationName"
            value={organizationName || organization.name}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Organization name"
          />
          <Button
            disabled={updating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs py-2 rounded-md font-medium transition-colors disabled:opacity-50 w-fit"
          >
            {updating ? "Updating..." : "Update Organization"}
          </Button>
        </form>
      </div>

      {/* Danger zone: delete organization */}
      <div className="bg-surface border border-danger/20 rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-danger mb-1 tracking-wide uppercase">
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Deleting this organization will permanently remove all projects, API
          keys, and data.
        </p>
        <Button
          onClick={handleDeleteOrganization}
          disabled={deleting}
          variant="danger"
        >
          {deleting ? "Deleting..." : "Delete Organization"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
