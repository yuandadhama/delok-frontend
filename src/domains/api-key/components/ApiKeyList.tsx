"use client";

import { useState } from "react";
import { KeyRound, Plus } from "lucide-react";

import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Skeleton from "@/src/components/ui/Skeleton";

import type { ApiKey } from "../types/api-key.type";
import { GenerateApiKeyModal } from "./GenerateApiKeyModal";

type ApiKeyListProps = {
  apiKeys: ApiKey[];
  isLoading?: boolean;
  onGenerate: (name: string) => Promise<string>;
  onRename: (id: string, name: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
};

const EYEBROW =
  "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";

const ICON_BTN =
  "inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

const FIELD =
  "rounded-md border border-border bg-surface text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors";

const formatDate = (iso: string) => {
  const date = new Date(iso);

  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export function ApiKeyList({
  apiKeys,
  isLoading = false,
  onGenerate,
  onRename,
  onRevoke,
}: ApiKeyListProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [editingApiKeyId, setEditingApiKeyId] = useState<string | null>(null);

  const [editingApiKeyName, setEditingApiKeyName] = useState("");

  const [renaming, setRenaming] = useState(false);

  const handleRename = async (id: string) => {
    const name = editingApiKeyName.trim();

    if (!name) return;

    setRenaming(true);

    try {
      await onRename(id, name);
      setEditingApiKeyId(null);
      setEditingApiKeyName("");
    } finally {
      setRenaming(false);
    }
  };

  const handleRevoke = async (id: string) => {
    const confirmed = window.confirm("Revoke this API key?");

    if (!confirmed) return;

    await onRevoke(id);
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className={EYEBROW}>API keys</h2>

        {!isLoading && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {apiKeys.length}
          </span>
        )}
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={() => setShowGenerateModal(true)}
        disabled={isLoading}
        className="w-full mb-3 flex items-center justify-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 active:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Generate API key
      </button>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : apiKeys.length === 0 ? (
        /* Empty */
        <EmptyState
          icon={<KeyRound className="h-5 w-5" />}
          description="No API key created yet"
          className="py-6"
        />
      ) : (
        /* API key list */
        <ul className="flex flex-col gap-1.5">
          {apiKeys.map((apiKey) => (
            <li
              key={apiKey.id}
              className="rounded-md border border-border px-2.5 py-2"
            >
              <div className="flex flex-col gap-1">
                {/* Rename */}
                {editingApiKeyId === apiKey.id ? (
                  <div className="flex gap-1.5">
                    <input
                      value={editingApiKeyName}
                      onChange={(e) => setEditingApiKeyName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void handleRename(apiKey.id);
                        }

                        if (e.key === "Escape") {
                          setEditingApiKeyId(null);
                          setEditingApiKeyName("");
                        }
                      }}
                      autoFocus
                      disabled={renaming}
                      className={`${FIELD} flex-1 px-2 py-1`}
                    />

                    <button
                      type="button"
                      onClick={() => void handleRename(apiKey.id)}
                      disabled={renaming || !editingApiKeyName.trim()}
                      className="rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                      {renaming ? "Saving..." : "Save"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium text-foreground">
                      {apiKey.name}
                    </span>

                    {!apiKey.revokedAt && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingApiKeyId(apiKey.id);
                          setEditingApiKeyName(apiKey.name);
                        }}
                        className={ICON_BTN}
                      >
                        Rename
                      </button>
                    )}
                  </div>
                )}

                {/* Key prefix */}
                <span className="font-mono text-[10px] text-muted-foreground">
                  {apiKey.keyPrefix}********
                </span>

                {/* Status */}
                {apiKey.revokedAt ? (
                  <span className="inline-flex w-fit items-center rounded-sm bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger">
                    Revoked {formatDate(apiKey.revokedAt)}
                  </span>
                ) : (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Last used:{" "}
                      {apiKey.lastUsedAt
                        ? formatDate(apiKey.lastUsedAt)
                        : "Never"}
                    </span>

                    <button
                      type="button"
                      onClick={() => void handleRevoke(apiKey.id)}
                      className={`${ICON_BTN} text-danger hover:bg-danger/10 hover:text-danger`}
                    >
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Generate modal */}
      <GenerateApiKeyModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={onGenerate}
      />
    </Card>
  );
}
