// ./src/domains/project/components/ProjectSettings.tsx

"use client";

import { useState } from "react";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import { projectSchema } from "../schemas/project.schema";

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

  const isUnchanged = editingName.trim() === projectName;

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updating || isUnchanged) return;

    const result = projectSchema.safeParse({ name: editingName });

    if (!result.success) {
      setUpdateError(result.error.issues[0].message);
      return;
    }

    setUpdating(true);
    setUpdateError("");
    try {
      await onUpdate(result.data.name);
      setEditingName(result.data.name);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
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
            onChange={(e) => {
              setEditingName(e.target.value);

              if (updateError) {
                setUpdateError("");
              }
            }}
            placeholder="Project name"
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
          {updating ? "Renaming…" : "Rename project"}
        </Button>
      </form>
    </section>
  );
}
