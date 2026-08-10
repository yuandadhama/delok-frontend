// src/domains/project/components/ProjectSettings.tsx

"use client";

import { useState } from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";

type ProjectSettingsProps = {
  projectName: string;
  onUpdate: (name: string) => Promise<void>;
};

export function ProjectSettings({
  projectName,
  onUpdate,
}: ProjectSettingsProps) {
  const [editingName, setEditingName] = useState(projectName);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingName.trim()) return;

    setUpdating(true);
    setUpdateError("");
    try {
      await onUpdate(editingName.trim());
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">General</h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Change the name of your project or manage the API Keys
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="">
          <Input
            label="Project name"
            name="projectName"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            placeholder="Project name"
          />
        </div>

        {updateError && (
          <p className="w-fit rounded-md bg-danger/10 px-2 py-1.5 text-xs text-danger">
            {updateError}
          </p>
        )}

        <Button type="submit" disabled={updating || !editingName.trim()}>
          {updating ? "Renaming…" : "Rename project"}
        </Button>
      </form>
    </section>
  );
}
