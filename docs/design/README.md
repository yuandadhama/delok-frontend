# Design System Audit

Source: `app/globals.css:1-252`, Tailwind v4 (`@import "tailwindcss"`, `@theme inline`).

## Tokens — `app/globals.css:6-27`

Dark is default (no `.dark` class needed). Light is opted via `.light`.

| Token | Dark (`:root`) | Light (`.light`) | Usage |
|-------|----------------|------------------|-------|
| `--background` | `#09090b` | `#ffffff` | Page background |
| `--surface` | `#121215` | `#f4f4f5` | Cards, panels |
| `--surface-hover` | `#1c1c21` | `#e4e4e7` | Hover for surface |
| `--foreground` | `#fafafa` | `#09090b` | Primary text |
| `--muted-foreground` | `#a1a1aa` | `#71717a` | Secondary text |
| `--border` | `#27272a` | `#e4e4e7` | Borders, scrollbar |
| `--primary` | `#6366f1` (indigo) | same | Brand / CTA |
| `--primary-foreground` | `#ffffff` | same | Text on primary |
| `--success` | `#22c55e` | same | OK / Healthy |
| `--warning` | `#f59e0b` | same | WARN level |
| `--danger` | `#ef4444` | same | ERROR/FATAL level |
| `--info` | `#06b6d4` | same | INFO level |
| `--radius` | `0.5rem` (8px) | same | Base radius |

Tailwind bridge (`@theme inline` `app/globals.css:42-67`) maps these to `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-success`, etc., plus `font-sans`, `font-mono`, `radius-sm/md/lg`.

- `radius-sm: calc(var(--radius) - 2px)` = 6px
- `radius-md: var(--radius)` = 8px
- `radius-lg: calc(var(--radius) + 4px)` = 12px

## Typography

- Fonts: `Space_Grotesk` (`--font-space-grotesk`) for sans, `JetBrains_Mono` (`--font-jetbrains-mono`) for mono. Loaded in `app/layout.tsx:9-19` via `next/font/google` with `variable` and `subsets: ["latin"]`.
- `app/globals.css:60-61`: `--font-sans: var(--font-space-grotesk), Inter, sans-serif`; `--font-mono: var(--font-jetbrains-mono), JetBrains Mono, monospace`.
- No explicit `font-size` scale in globals; components use Tailwind text utilities (`text-sm`, `text-xs`, etc.).

## Spacing / Radius Conventions

- Radius system is 8pt grid based (comment in `app/globals.css:25`).
- Components consistently use `rounded-md` / `rounded-lg` / `rounded-full` mapped to the tokens above.
- Cards and modals: `border border-border bg-surface rounded-lg`.

## Scrollbar

- Thin, rounded, theme-aware (`app/globals.css:72-101`): Firefox `scrollbar-width: thin; scrollbar-color: var(--border) transparent`; WebKit `::-webkit-scrollbar` 8px with `border-radius: 9999px`.

## Animations

- Toast progress: `toast-progress` scaleX 1->0 (`app/globals.css:106-113`).
- Loader: 3-bar `delok-loader-bar` (`app/globals.css:118-145`) used by `src/components/ui/Loader.tsx`.
- Log stream: `log-enter` translateY -8px + opacity (`app/globals.css:155-168`) — `animate-log-enter` on new rows.
- Landing demos: `detail-crossfade`, `cursor-click-pulse` (`app/globals.css:173-199`), hero/section reveals `hero-reveal` / `section-reveal` (`app/globals.css:204-252`).

## Component Styling Conventions

- UI primitives in `src/components/ui/*` use `clsx` for conditional classes, Tailwind tokens, and no CSS modules.
- Variants are props-driven (e.g., `Button` variants), not separate files.
- Dark/light behavior: `next-themes` with `attribute="class"`; dark is default via `:root`, light via `.light` (not `.dark`).

## Unknown / Not Found

- No design tokens file besides `app/globals.css`.
- No Figma link or token export.
- Accessibility patterns: not explicitly documented; no `axe` or `aria-*` conventions found beyond semantic HTML.
