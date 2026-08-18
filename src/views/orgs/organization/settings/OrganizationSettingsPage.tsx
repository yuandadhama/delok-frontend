"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Button from "@/src/components/ui/Button";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import Input from "@/src/components/ui/Input";

import {
  organizationSchema,
  useOrganization,
} from "@/src/domains/organization";

import { useCooldown } from "@/src/hooks/useCooldown";
import { showToast } from "@/src/components/ui/toast";
import { ROUTES } from "@/src/constants/routes";
import { delok } from "@/src/lib/delok";

export default function OrganizationSettingsPage() {
  const router = useRouter();

  const { organizationSlug } = useParams<{
    organizationSlug: string;
  }>();

  const { organization, updateOrganization, deleteOrganization } =
    useOrganization(organizationSlug);

  const [editingName, setEditingName] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initializedRef = useRef(false);

  // Tracks whether the component is still mounted so async callbacks that
  // resolve after navigation/logout do not touch stale UI or show stale toasts.
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const name = organization?.name ?? "";

  const isUpdating = updateOrganization.isPending;
  const isDeleting = deleteOrganization.isPending;

  const { isCooldownActive, startCooldown } = useCooldown();

  const isUnchanged = editingName.trim() === name;

  /**
   * Initialize the form once the organization
   * has been loaded.
   *
   * We intentionally use a ref instead of state because
   * initialization is not UI state.
   */
  useEffect(() => {
    if (!organization || initializedRef.current) {
      return;
    }

    setEditingName(organization.name);
    initializedRef.current = true;
  }, [organization]);

  const handleUpdate = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUpdating || isCooldownActive || isUnchanged) {
      return;
    }

    const result = organizationSchema.safeParse({
      name: editingName,
    });

    if (!result.success) {
      setUpdateError(result.error.issues[0].message);
      return;
    }

    setUpdateError("");

    try {
      // The API mutation owns the loading state and, on success, synchronizes
      // the organization cache. Only the page-local side effects below depend
      // on this component still being mounted.
      const updated = await updateOrganization.mutateAsync(result.data);

      if (!isMountedRef.current) {
        return;
      }

      delok.info({
        event: "organization_updated",
        message: "Organization updated",
        payload: {
          organizationSlug,
          name: updated.name,
        },
      });

      setEditingName(updated.name);

      showToast({ message: "Organization renamed", type: "success" });

      // Short anti-spam lock: the cache/UI/toast above already applied
      // immediately. The cooldown only blocks another rename for a moment.
      startCooldown();

      if (updated.slug && updated.slug !== organizationSlug) {
        router.replace(ROUTES.ORGANIZATION.BASE(updated.slug));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setUpdateError(
          error instanceof Error
            ? error.message
            : "Failed to update organization.",
        );
      }
    }
  };

  const handleDelete = async () => {
    setDeleteError("");

    try {
      await deleteOrganization.mutateAsync();

      delok.info({
        event: "organization_deleted",
        message: "Organization deleted",
        payload: {
          organizationSlug,
        },
      });

      if (isMountedRef.current) {
        showToast({ message: "Organization deleted", type: "success" });
      }

      router.replace(ROUTES.ORGANIZATION.ROOT);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete organization.",
      );
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 sm:p-6">
      <div className="space-y-10 sm:space-y-12">
        {/* General */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">General</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Change the name of your organization.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              id="organizationName"
              label="Organization name"
              name="organizationName"
              value={editingName}
              onChange={(event) => {
                setEditingName(event.target.value);

                if (updateError) {
                  setUpdateError("");
                }
              }}
              placeholder="Acme Inc."
              disabled={isUpdating || isCooldownActive}
            />

            {updateError && (
              <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
                {updateError}
              </p>
            )}

            <Button
              type="submit"
              disabled={
                isUpdating || isCooldownActive || isUnchanged || !editingName.trim()
              }
            >
              {isUpdating ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 border-t border-border pt-6 sm:pt-8">
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
                Permanently delete this organization and all of its projects,
                API keys, and data. This action cannot be undone.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              disabled={isDeleting}
              onClick={() => {
                setDeleteError("");
                setShowDeleteConfirm(true);
              }}
              className="shrink-0"
            >
              Delete organization
            </Button>
          </div>

          {deleteError && (
            <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
              {deleteError}
            </p>
          )}
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
          onClose={() => {
            if (!isDeleting) {
              setShowDeleteConfirm(false);
            }
          }}
        />
      )}
    </div>
  );
}
