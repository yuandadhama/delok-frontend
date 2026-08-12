// ./app/(root)/workspace/[organizationSlug]/settings/page.tsx

"use client";

import Button from "@/src/components/ui/Button";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import Input from "@/src/components/ui/Input";
import {
  organizationSchema,
  useOrganization,
} from "@/src/domains/organization";
import { delok } from "@/src/lib/delok";
import { ROUTES } from "@/src/constants/routes";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ organizationSlug: string }>();
  const organizationSlug = params.organizationSlug;

  const { organization, updateOrganization, deleteOrganization } =
    useOrganization(organizationSlug);

  const [editingName, setEditingName] = useState(organization?.name ?? "");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const name = organization?.name ?? "";
  const isUnchanged = editingName.trim() === name;

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updating || isUnchanged) return;

    const result = organizationSchema.safeParse({ name: editingName });

    if (!result.success) {
      setUpdateError(result.error.issues[0].message);
      return;
    }

    setUpdating(true);
    setUpdateError("");
    try {
      const updated = await updateOrganization.mutateAsync(result.data);

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

      setEditingName(updated.name);
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    await deleteOrganization.mutateAsync();

    delok.info({
      event: "organization_deleted",
      message: "Organization deleted",
      payload: {
        organizationSlug,
      },
    });

    window.location.href = ROUTES.WORKSPACE.ROOT;
  };

  return (
    <div className="w-full max-w-4xl flex flex-col p-4 sm:p-6">
      <div className="space-y-10 sm:space-y-12">
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">General</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Change the name of your workspace.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Input
                label="Workspace name"
                name="organizationName"
                value={editingName}
                onChange={(e) => {
                  setEditingName(e.target.value);

                  if (updateError) {
                    setUpdateError("");
                  }
                }}
                placeholder="Acme Inc."
              />
            </div>

            {updateError && (
              <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
                {updateError}
              </p>
            )}

            <Button
              type="submit"
              disabled={updating || isUnchanged || !editingName.trim()}
            >
              {updating ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </section>
      </div>

      <div className="mt-10 border-t border-border pt-6 sm:mt-12 sm:pt-8">
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-danger">Danger zone</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Irreversible and destructive actions.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 rounded-lg border border-danger/25 bg-danger/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Delete organization
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Permanently delete this workspace and all of its projects, API
                keys, and data. This action cannot be undone.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              className="shrink-0"
            >
              Delete organization
            </Button>
          </div>
        </section>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete organization"
          description="This action is permanent and cannot be undone."
          expectedText={name}
          inputLabel="Organization name"
          helperText={`Type "${name}" to confirm deletion.`}
          confirmLabel="Delete"
          busyLabel="Deleting…"
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default Page;
