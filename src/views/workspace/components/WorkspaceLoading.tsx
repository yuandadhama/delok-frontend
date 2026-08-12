// ./src/pages/workspace/components/WorkspaceLoading.tsx

export default function WorkspaceLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading workspace...
      </p>
    </div>
  );
}
