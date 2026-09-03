# Architecture Overview

## Stack (verified from `package.json:11-25`)

- **Framework:** Next.js `16.2.9` (App Router), React `19.2.4`
- **Language:** TypeScript `^5` (`tsconfig.json:7` strict)
- **Styling:** Tailwind CSS `^4` (`postcss.config.mjs:3`, `app/globals.css:1`)
- **State/Server:** `@tanstack/react-query` `^5.101.4`
- **Auth:** `better-auth` `^1.6.23` via `src/lib/auth/auth-client.ts:5`
- **Forms/Validation:** `react-hook-form` `^7.84`, `zod` `^4.4.3`, `@hookform/resolvers`
- **Theming:** `next-themes` `^0.4.6` (`src/providers/ThemeProvider.tsx:5`)
- **UI:** `clsx`, `lucide-react`, `sonner` (toasts in `app/layout.tsx:5`)

## Folder Structure

```
app/                      # Next.js App Router — routes, layouts
  (auth)/                 # route group (no URL segment)
  (root)/orgs/            # authenticated organization area
  docs/                   # public documentation pages
  globals.css             # design tokens + Tailwind bridge
  layout.tsx              # root layout, fonts, providers
  not-found.tsx           # global 404
src/
  components/             # shared UI and layout
    ui/                   # primitives: Button, Input, Modal, etc.
    landing/              # marketing / home page sections
    docs/                 # DocsLayout, DocsNavbar, DocsSidebar, ...
    layout/               # Sidebar, Topbar
  domains/                # feature domains (see docs/domains/)
    auth/ organization/ project/ log/ log-explorer/ api-key/
  lib/
    auth/auth-client.ts   # better-auth client
    websocket/            # WebSocketManager + realtime types
  providers/              # AppProvider hierarchy
  constants/              # routes, assets, storage, external-links
  hooks/                  # useCooldown
  utils/                  # api-error, format-date
  views/                  # page-level view components (consumed by app/)
public/                   # static assets (logos .webp, view-two.mp4)
next.config.ts            # empty NextConfig
eslint.config.mjs         # next/core-web-vitals + next/typescript
```

Path alias: `@/* -> ./*` (`tsconfig.json:22`), so `@/src/...` and `@/app/...` are valid.

## Rendering

- Root layout `app/layout.tsx:27` is a Server Component that mounts `AppProvider` (client) and `Toaster`.
- All domain views under `src/views/` are `"use client"` components.
- No `loading.tsx` / `error.tsx` files were found in `app/**/`. Loading states are handled per-view with `Loader` (`src/components/ui/Loader.tsx`) and skeletons.
- Route groups `(auth)` and `(root)` are organizational only, not in URL.

## Dependency Direction

```
app/page or app/(root)/.../page.tsx
  -> src/views/...              (page composition)
    -> src/domains/...          (hooks, components, services)
      -> src/lib/*              (auth-client, websocket)
      -> src/constants/*        (ROUTES, STORAGE_KEYS)
      -> src/utils/*            (api-error, format-date)
      -> src/components/ui/*    (presentational)
providers/ wraps everything via AppProvider
```

No domain imports another domain's internals except `log-explorer -> log` (explicit). This is the only cross-domain import verified.

## Build / Lint

- `npm run dev` -> `next dev`
- `npm run build` -> `next build`
- `npm run lint` -> `eslint` with `eslint-config-next`
