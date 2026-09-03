# API & Backend Integration Audit

## HTTP Client

No axios/fetch wrapper library. All services use native `fetch` with `credentials:"include"` (cookie auth). Each service resolves base URL via:

```ts
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") throw new Error("...");
  return "http://localhost:8000";
}
```

This pattern appears identically in `auth.service.ts:12`, `organization.service.ts:12`, `project.service.ts:10`, `log.service.ts:5`, `api-key.service.ts:5`.

Backend repository: **Not inspected** (out of scope). Contracts inferred from frontend code only.

## Authentication

- Client: `better-auth` `createAuthClient({ baseURL: getAuthBaseURL() })` (`src/lib/auth/auth-client.ts:16`).
- Session: `authClient.useSession()` (React hook) and `authClient.signIn/signUp` via `AuthService`.
- Custom endpoint: `POST /api/auth/resend-verification` is called via raw `fetch`, not `authClient` (`src/domains/auth/api/auth.service.ts:45`).
- Social: `authClient.signIn.social({provider:"google"|"github", callbackURL:...})`.

## API Structure (from service files)

| Domain | Method | Endpoint | File |
|--------|--------|----------|------|
| Org | GET | `/api/organization` | `organization.service.ts:30` |
| Org | POST | `/api/organization` | `organization.service.ts:42` |
| Org | GET | `/api/organization/:slug` | `organization.service.ts:70` |
| Org | PATCH | `/api/organization/:slug` | `organization.service.ts:88` |
| Org | DELETE | `/api/organization/:slug` | `organization.service.ts:118` |
| Project | GET | `/api/organizations/:organizationSlug/projects` | `project.service.ts:32` |
| Project | POST | `/api/organizations/:organizationSlug/projects` | `project.service.ts:50` |
| Project | GET | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts:76` |
| Project | PATCH | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts:103` |
| Project | DELETE | `/api/organizations/:organizationSlug/projects/:projectId` | `project.service.ts:131` |
| Log | GET | `/api/projects/:projectId/logs?page=&limit=&search=&level=&environment=&from=&to=` | `log.service.ts:23` |
| API Key | GET | `/api/projects/:projectId/api-keys` | `api-key.service.ts:12` |
| API Key | POST | `/api/projects/:projectId/api-keys` | `api-key.service.ts:26` |
| API Key | PATCH | `/api/api-key/:id` (rename) | `api-key.service.ts:50` |
| API Key | PATCH | `/api/api-key/:id/revoke` | `api-key.service.ts:68` |

Response shape assumed: `{ data: T }` on success; errors are `{ error:{code,message}}` or `{errors:[...]}` — see `src/utils/api-error.ts:5-13`.

## Request / Response Handling

- Requests: `Content-Type: application/json` for POST/PATCH, no custom headers. API keys are **not** sent by the frontend; they are for SDK ingestion.
- Responses: `response.json()` then `normalize*` helpers map `created_at/updated_at` -> `createdAt/updatedAt` (`organization.service.ts:18`, `project.service.ts:18`).
- Org list/maps: `(data.data ?? []).map(normalizeX)`.

## Error Handling & Validation

- `getApiErrorMessage` / `getApiErrorCode` (`src/utils/api-error.ts:15-33`) extract `error.message`, `errorDetail.message`, `errors[0].message`.
- Domain-specific: `ORGANIZATION_SLUG_ALREADY_EXISTS` mapped to `"Organization name is unavailable"` (`organization.service.ts:60`).
- Form validation: `zod` schemas in `src/domains/*/schemas/*` with `react-hook-form` + `@hookform/resolvers` (`SignInForm`, `CreateOrganizationModal`, etc.). No backend schema sharing verified.
- No global error boundary; per-hook `console.error` and `throw new Error(...)` surfaced via toasts or inline UI.

## WebSocket (Realtime)

- Manager: `src/lib/websocket/websocket.ts:48` — singleton `websocketManager`.
- URL: `NEXT_PUBLIC_WS_URL` (fallback `ws://localhost:8000`), with `wss://` enforcement on https/production.
- Connection: `SocketProvider` calls `connect()` on mount. Exponential backoff reconnect (`1s * 2^attempt`, cap 30s). Auto-resubscribes on `onopen`.
- Protocol:
  - Subscribe: `{type:"project.subscribe", data:{projectId}}`
  - Unsubscribe: `{type:"project.unsubscribe", data:{projectId}}`
  - Events: `{type, data}` dispatched to handlers registered via `websocketManager.on(type, handler)`.
- Event types (`src/lib/websocket/realtime.types.ts:5`):
  - `log.created` -> `LogEvent`
  - `project.log_count.updated` -> `{projectId, logCount}`
- Consumers: `useLogExplorerRealtime` (filters via `matchesLogFilters`) and `useProjectsRealtime` (updates React Query cache).

## Frontend vs Backend Responsibility

- **Frontend:** Auth UI, org/project CRUD UI, log filtering/pagination UI, realtime subscription, local UX state (last org/project).
- **Backend:** Session/cookie management, slug generation, permission checks (OWNER role), log storage/search, API key generation/revocation, WebSocket fan-out per project.

## Environment Variables

- `NEXT_PUBLIC_API_URL` — HTTP API base (fallback `http://localhost:8000`, required in production)
- `NEXT_PUBLIC_WS_URL` — WebSocket URL (fallback `ws://localhost:8000`, required `wss://` on https/production)
- `NEXT_PUBLIC_APP_URL` — used for password reset `redirectTo` and OAuth `callbackURL`
