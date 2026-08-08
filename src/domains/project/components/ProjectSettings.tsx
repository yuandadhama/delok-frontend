// src/domains/project/components/ProjectSettings.tsx

"use client";

import { useState } from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Card from "@/src/components/ui/Card";

type ProjectSettingsProps = {
  projectName: string;
  onUpdate: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function ProjectSettings({
  projectName,
  onUpdate,
  onDelete,
}: ProjectSettingsProps) {
  const [editingName, setEditingName] = useState(projectName);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingName.trim()) return;

    setUpdating(true);
    setError("");
    try {
      await onUpdate(editingName.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  };

  return (
    <Card className="p-3.5">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2.5">
        Project settings
      </h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-2.5">
        <Input
          label="Project name"
          name="projectName"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          placeholder="Project name"
        />

        {error && (
          <p className="rounded-md bg-danger/10 px-2 py-1.5 text-[11px] text-danger">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={updating || !editingName.trim()}
          className="bg-primary text-primary-foreground text-xs font-medium py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? "Updating…" : "Update project"}
        </Button>
      </form>

      <div className="mt-3 border-t border-border pt-3">
        <Button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full border border-danger/30 bg-danger/10 text-danger text-xs font-medium py-2 rounded-md hover:bg-danger/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? "Deleting…" : "Delete project"}
        </Button>
      </div>
    </Card>
  );
}
