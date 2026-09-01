type TocItem = {
  id: string;
  title: string;
};

export function DocsTOC({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-18">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </h4>
        <ul className="mt-3 space-y-2 border-l border-border pl-4">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
