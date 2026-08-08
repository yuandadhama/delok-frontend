// src/domains/organization/components/CreateOrganizationModal.tsx

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Modal from "@/src/components/ui/Modal";

import { organizationSchema } from "../schemas/organization.schema";
import { useOrganizations } from "../hooks/useOrganizations";

export function CreateOrganizationModal() {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      <Button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add Workspace
      </Button>

      <Modal open={open} onClose={handleClose} title="Create Workspace">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Create a new workspace for your projects.
          </p>

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
              onClick={handleClose}
              disabled={createOrganization.isPending}
              className="border border-border bg-surface text-foreground hover:bg-surface-hover"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createOrganization.isPending || !organizationName.trim()
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createOrganization.isPending
                ? "Creating..."
                : "Create Workspace"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
