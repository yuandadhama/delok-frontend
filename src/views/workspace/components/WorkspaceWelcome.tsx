// ./src/pages/workspace/components/WorkspaceWelcomeProps.tsx

type WorkspaceWelcomeProps = {
  name?: string | null;
};

export default function WorkspaceWelcome({ name }: WorkspaceWelcomeProps) {
  const firstName = name?.split(" ")[0] ?? "there";

  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Hello, <span className="text-primary">{firstName}</span>
      </h1>

      <p className="mt-1 text-lg text-muted-foreground">
        Welcome back to Delok!
      </p>
    </header>
  );
}
