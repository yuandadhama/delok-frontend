// ./src/views/orgs/components/OrganizationsLoading.tsx

export default function OrganizationsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground animate-pulse">
        Loading organizations...
      </p>
    </div>
  );
}
