"use client";

import { useState } from "react";
import Link from "next/link";
import { DocsNavbar } from "./DocsNavbar";
import { DocsSidebar } from "./DocsSidebar";

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DocsNavbar
        menuOpen={mobileOpen}
        onMenuToggle={() => setMobileOpen((v) => !v)}
      />

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-background lg:hidden">
          <div className="h-14" />
          <div className="overflow-y-auto border-t border-border bg-background p-4">
            <div onClick={() => setMobileOpen(false)}>
              <DocsSidebar />
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Delok
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="hidden w-[240px] shrink-0 border-r border-border lg:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-4 py-8">
            <DocsSidebar />
            <div className="mt-8 border-t border-border pt-6">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Delok
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper for pages that want a right TOC column
export function DocsPageWithTOC({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc: { id: string; title: string }[];
}) {
  if (toc.length === 0) return <>{children}</>;

  return (
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">{children}</div>
      <aside className="hidden w-45 shrink-0 xl:block">
        <div className="sticky top-24">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            On this page
          </p>
          <ul className="mt-3 space-y-2 border-l border-border pl-4">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
