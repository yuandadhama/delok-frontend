// src/domains/organization/components/CreateOrganizationModal.tsx

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Modal from "@/src/components/ui/Modal";

import { organizationSchema } from "../schemas/organization.schema";
import { useOrganizations } from "../hooks/useOrganizations";

type CreateOrganizationModalProps = {
  /**
   * Customize the trigger element (e.g. render a card instead of a button).
   * Receives a function that opens the modal.
   */
  trigger?: (open: () => void) => React.ReactNode;
};

export function CreateOrganizationModal({
  trigger,
}: CreateOrganizationModalProps) {
  const [open, setOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");

  const { createOrganization } = useOrganizations();

  const handleOpen = () => {
    setOrganizationName("");
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (createOrganization.isPending) return;

    setOpen(false);
    setOrganizationName("");
    setError("");
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = organizationSchema.safeParse({
      name: organizationName,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError("");

    try {
      await createOrganization.mutateAsync(result.data);

      setOrganizationName("");
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <>
      {trigger ? (
        trigger(handleOpen)
      ) : (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleOpen}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Workspace
        </Button>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        title="Create Workspace"
        description="Create a new workspace for your projects."
      >
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-4">
          <Input
            label="Workspace Name"
            name="name"
            placeholder="e.g. Delok Inc."
            value={organizationName}
            onChange={(event) => {
              setOrganizationName(event.target.value);

              if (error) {
                setError("");
              }
            }}
            error={error}
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
              disabled={createOrganization.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={
                createOrganization.isPending || !organizationName.trim()
              }
            >
              {createOrganization.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
