export type DocsNavItem = {
  title: string;
  href: string;
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export const DOCS_NAVIGATION: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "SDK",
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Logging", href: "/docs/logging" },
    ],
  },
  {
    title: "Reference",
    items: [{ title: "Log Event", href: "/docs/reference/log-event" }],
  },
];

export const ALL_DOCS_HREFS = DOCS_NAVIGATION.flatMap((s) =>
  s.items.map((i) => i.href),
);
