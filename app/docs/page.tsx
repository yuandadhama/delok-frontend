import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Everything you need to start sending and understanding logs with Delok.",
};

const SECTIONS = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs/introduction",
        description: "Understand what Delok does and how logs move through the system.",
      },
      {
        title: "Quickstart",
        href: "/docs/quickstart",
        description: "Send your first log with the Delok SDK.",
      },
    ],
  },
  {
    title: "SDK",
    items: [
      {
        title: "Installation",
        href: "/docs/installation",
        description: "Install the SDK and prepare your application.",
      },
      {
        title: "Logging",
        href: "/docs/logging",
        description: "Learn how to send info, warning, error, and fatal logs.",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Log Event",
        href: "/docs/reference/log-event",
        description: "Understand the structure of a log event sent to Delok.",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Documentation
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Everything you need to start sending and understanding logs with Delok.
        </p>
        <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search documentation</span>
          <span className="ml-auto hidden rounded bg-background px-1.5 py-0.5 font-mono text-[11px] sm:inline">
            /
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
