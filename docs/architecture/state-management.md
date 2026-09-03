# State Management Audit

## Mechanisms Found (by grep of imports and code)

| Mechanism | Where used | Why |
|-----------|------------|-----|
| **React `useState` / `useCallback` / `useRef`** | `useLogExplorer` (`src/domains/log-explorer/hooks/useLogExplorer.ts:23-54`), `useCooldown` | Local UI state: logs, pagination, filters, selectedLog, cooldown |
| **TanStack React Query** | `useOrganizations` (`src/domains/organization/hooks/useOrganizations.ts`), `useProjects`, `useProject`, `useProjectApiKeys` (`src/domains/api-key/hooks/useProjectApiKeys.ts:14-27`), `QueryProvider` | Server state: organizations, projects, api-keys. Caching, invalidation, background refetch |
| **Context (next-themes)** | `ThemeProvider` | Theme preference |
| **URL state (Next.js)** | `useParams` in `ProjectPage`, `searchParams` in `LogService` | Route params `organizationSlug`, `projectId`; log filters sent as query params |
| **localStorage** | `src/constants/storage.ts:4-51`, `AuthRoutingProvider`, `ProjectPage` | `lastOrganizationSlug`, `lastProjectByOrganization` (JSON map) |
| **WebSocket state** | `websocketManager` (`src/lib/websocket/websocket.ts:48-53`) singleton + realtime hooks | Realtime logs and `log_count` updates |
| **Cookies (implicit)** | `fetch(..., {credentials:"include"})` in all services, `better-auth` | Session cookie for authenticated API calls. No direct `document.cookie` usage found |
| **React Query cache as realtime store** | `useProjectsRealtime` (`src/domains/project/hooks/useProjectsRealtime.ts:38`) via `queryClient.setQueryData` | Updates `["projects", organizationSlug]` without refetch |

## Not Found

- No Redux, Zustand, Jotai, or global Context stores besides `next-themes`.
- No `localStorage` for auth tokens (cookie-based).
- No URL sync for log filters beyond API query params (filters live in `useState` in `useLogExplorer`, not in `searchParams`).

## Details

### TanStack Query Keys

- `["organizations"]` — `useOrganizations`
- `["organization", slug]` — `useOrganization`
- `["projects", organizationSlug]` — `useProjects`
- `["project", organizationSlug, projectId]` — `useProject`
- `["api-keys", projectId]` — `useProjectApiKeys`
- Invalidated on mutations (`invalidateQueries` in `useProjectApiKeys`).

### Log Explorer State

- `useLogExplorer` owns `logs`, `pagination`, `page`, `limit`, `filters`, `selectedLog`, `isLoading` in local state.
- Fetch is via `LogService.listByProject` (direct `fetch`, not React Query). Sequence guard (`fetchSequence` ref) prevents stale responses.
- Realtime overlay: `websocketManager` pushes `log.created` into `logs` if `matchesLogFilters` passes.

### Cooldown

- `useCooldown` (`src/hooks/useCooldown.ts:24`) is a local timer (default 3000ms) used to anti-spam mutations.

## Cookies vs. localStorage

- Auth: cookie (`credentials:"include"`). No token in `localStorage`.
- UX: `localStorage` only for last-visited org/project to drive `AuthRoutingProvider` redirects.
