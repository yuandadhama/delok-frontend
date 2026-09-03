# Architectural Decisions

No `ADR` files or `decisions/` docs were found in the repository. Decisions below are inferred from implementation patterns. Where rationale is not in code/comments, it is marked **Unknown**.

| Decision | Evidence | Rationale |
|----------|----------|-----------|
| Next.js App Router | `app/layout.tsx`, `next.config.ts`, `package.json:18` | Unknown — not documented. Likely for file-based routing and server components. |
| Tailwind v4 with CSS tokens in `app/globals.css` | `app/globals.css:1-67`, `postcss.config.mjs:3` | Design system with dark default, semantic tokens, Tailwind bridge. Rationale: **Unknown**. |
| `better-auth` for authentication | `src/lib/auth/auth-client.ts:5`, `package.json:15` | Abstracted via `AuthService` for replaceability (comment in `auth.service.ts:1-13`). |
| TanStack Query for server state | `src/providers/QueryProvider.tsx:5`, domain hooks | Caching + invalidation for orgs/projects/api-keys. `staleTime 30s`, `retry 1`. |
| Native `fetch` over axios | All `*.service.ts` use `fetch` | Unknown. No wrapper abstraction found. |
| Singleton `WebSocketManager` | `src/lib/websocket/websocket.ts:48-229` | Single connection shared; manager owns reconnect + resubscription. Domain hooks only subscribe. Comment at `websocket.ts:42-47` explains separation. |
| `log-explorer` local state (not React Query) | `src/domains/log-explorer/hooks/useLogExplorer.ts:23-54` | Likely due to realtime prepending + sequence guard + filter sync. **Unknown** if deliberate. |
| `src/domains/<name>/` domain layer | `src/domains/*` folders | Separation by feature. Rationale: **Unknown** — no ADR. |
| `src/views/` separate from `app/` | `src/views/orgs/*` vs `app/(root)/orgs/*` | Thin `app` routes delegate to `views` for testability/reuse. **Unknown** if intentional pattern. |
| Cookie auth (`credentials:"include"`) | All services | Session via cookie, not token. Unknown backend detail. |
| `localStorage` for last org/project | `src/constants/storage.ts:4`, `AuthRoutingProvider` | UX: return to last visited. |
| `next-themes` with `attribute="class"` | `src/providers/ThemeProvider.tsx:10` | System theme support. |

## Gaps

- No documented decisions for: backend contract, error shape, realtime protocol, role/permissions.
- No commit history inspection performed.

If adding ADRs, place them as `docs/decisions/<number>-<title>.md` and link here.
