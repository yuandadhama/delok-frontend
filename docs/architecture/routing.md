# Routing Audit

Source: `app/` directory listing via `glob app/**/*` + `src/constants/routes.ts:1-45`.

## Route Table

| Route | File | Type | Notes |
|-------|------|------|-------|
| `/` | `app/page.tsx:14` | Page | Marketing home. Wrapped in `<HomeGate>` |
| `/docs` | `app/docs/page.tsx:38` | Page | Docs index. Uses `DocsLayout` |
| `/docs/introduction` | `app/docs/introduction/page.tsx` | Page |  |
| `/docs/quickstart` | `app/docs/quickstart/page.tsx` | Page |  |
| `/docs/installation` | `app/docs/installation/page.tsx` | Page |  |
| `/docs/logging` | `app/docs/logging/page.tsx` | Page |  |
| `/docs/reference/log-event` | `app/docs/reference/log-event/page.tsx` | Page |  |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | Page | Route group `(auth)` — URL is `/sign-in` |
| `/sign-in/forgot-password` | `app/(auth)/sign-in/forgot-password/page.tsx` | Page |  |
| `/sign-in/reset-password` | `app/(auth)/sign-in/reset-password/page.tsx` | Page | Expects `?token=` search param (see `ResetPasswordForm`) |
| `/sign-up` | `app/(auth)/sign-up/page.tsx` | Page |  |
| `/sign-up/verify-email` | `app/(auth)/sign-up/verify-email/page.tsx` | Page |  |
| `/sign-up/verified` | `app/(auth)/sign-up/verified/page.tsx` | Page | Email verification success |
| `/auth/error` | `app/(auth)/auth/error/page.tsx` | Page | Auth error display |
| `/orgs` | `app/(root)/orgs/page.tsx` | Page | Organizations list. Layout: `app/(root)/orgs/layout.tsx` |
| `/orgs/:organizationSlug` | `app/(root)/orgs/[organizationSlug]/page.tsx` | Dynamic | Org overview |
| `/orgs/:organizationSlug/settings` | `app/(root)/orgs/[organizationSlug]/settings/page.tsx` | Dynamic | Org settings |
| `/orgs/:organizationSlug/projects` | `app/(root)/orgs/[organizationSlug]/projects/page.tsx` | Dynamic | Projects list |
| `/orgs/:organizationSlug/projects/:projectId` | `app/(root)/orgs/[organizationSlug]/projects/[projectId]/page.tsx` | Dynamic nested | Log Explorer |
| `/orgs/:organizationSlug/projects/:projectId/settings` | `app/(root)/orgs/[organizationSlug]/projects/[projectId]/settings/page.tsx` | Dynamic nested | Project settings |

Special files:
- `app/layout.tsx:27` — root layout (fonts `Space_Grotesk`, `JetBrains_Mono`, `AppProvider`, `Toaster`)
- `app/not-found.tsx:10` — global 404 (link to `ROUTES.HOME`)
- `app/docs/layout.tsx:12` — docs segment layout wrapping `DocsLayout`

## Layout Hierarchy

```
app/layout.tsx (RootLayout)
 ├─ app/page.tsx (Home - no org layout)
 ├─ app/docs/layout.tsx (DocsLayout -> DocsNavbar + DocsSidebar)
 ├─ app/(auth)/* (AuthLayout via views/auth)
 └─ app/(root)/orgs/layout.tsx (OrganizationsLayout)
     └─ app/(root)/orgs/[organizationSlug]/layout.tsx (OrganizationLayout -> Sidebar + Topbar)
```

- `src/views/orgs/OrganizationsLayout.tsx` and `src/views/orgs/organization/OrganizationLayout.tsx` provide the authenticated shell.
- `Sidebar` (`src/components/layout/sidebar/Sidebar.tsx`) and `Topbar` (`src/components/layout/topbar/Topbar.tsx`) are only mounted inside the org layout.

## Navigation

- All route strings are centralized in `src/constants/routes.ts:3-45` (`ROUTES`). No hardcoded paths in components except fallback handling.
- `Sidebar` config in `src/components/layout/sidebar/sidebar.config.ts` derives items from `ROUTES`.
- `HomeGate` (`src/components/landing/HomeGate.tsx`) gates `/` for authenticated users (redirects via `AuthRoutingProvider` logic).
- `AuthRoutingProvider` (`src/providers/AuthRoutingProvider.tsx:23-37`) auto-redirects authenticated users from `/` or `/docs` is excluded; any other non-`/orgs` path redirects to `ROUTES.ORGANIZATION.PROJECTS(lastOrg)` or `/orgs`.
- Docs navigation is defined in `src/components/docs/navigation.ts`.

## Protected Routes

No `middleware.ts` found. Protection is client-side:
- `authClient.useSession()` is checked in `AuthRoutingProvider` and individual views (e.g., `ProjectPage` handles `isError`/not-found).
- Unknown: server-side guard or middleware — **Not found**.

## Loading / Error States

- No `loading.tsx` / `error.tsx` files in `app/`. Verified via glob.
- Per-view loading: `Loader` (`src/components/ui/Loader.tsx`) and skeletons (`ProjectListSkeleton`, `OrganizationListSkeleton`, `OrganizationsLoading`).
- Error handling in `ProjectPage` (`src/views/orgs/organization/projects/project/ProjectPage.tsx:31-44`) and `not-found.tsx`.

## Route Groups

- `(auth)` and `(root)` are Next.js route groups — they do not affect the URL. They organize auth vs. authenticated org areas.
