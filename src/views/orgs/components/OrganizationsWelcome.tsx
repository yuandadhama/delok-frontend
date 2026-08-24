// ./src/views/orgs/components/OrganizationsWelcome.tsx

type OrganizationsWelcomeProps = {
  name?: string | null;
};

export default function OrganizationsWelcome({
  name,
}: OrganizationsWelcomeProps) {
  const firstName = name?.split(" ")[0] ?? "there";

  return (
    <header className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Hello, <span className="text-primary">{firstName}</span>
      </h1>

      <p className="mt-1 text-lg text-muted-foreground">
        Let’s get your organaization set up.
      </p>
    </header>
  );
}
