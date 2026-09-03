# Providers Audit

Source: `src/providers/*` + `app/layout.tsx:6,39`.

## Hierarchy

Mounted once in `app/layout.tsx:39`:

```
AppProvider (src/providers/AppProvider.tsx:11)
 └─ ThemeProvider (src/providers/ThemeProvider.tsx:8)
     └─ QueryProvider (src/providers/QueryProvider.tsx:12)
         └─ SocketProvider (src/providers/SocketProvider.tsx:9)
             └─ AuthRoutingProvider (src/providers/AuthRoutingProvider.tsx:12)
                 └─ {children}
```

## Provider Details

| Provider | File | What it provides | Consumers |
|----------|------|------------------|-----------|
| `ThemeProvider` | `src/providers/ThemeProvider.tsx:8` | `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem` | Any component using `useTheme()` or Tailwind dark mode `.light` class |
| `QueryProvider` | `src/providers/QueryProvider.tsx:12` | Single `QueryClient` (`staleTime: 30s`, `retry:1`, `refetchOnWindowFocus:false`) | All TanStack Query hooks: `useOrganizations`, `useProjects`, `useProject`, `useProjectApiKeys` |
| `SocketProvider` | `src/providers/SocketProvider.tsx:9` | Calls `websocketManager.connect()` on mount, `disconnect()` on unmount | Domain realtime hooks (`useLogExplorerRealtime`, `useProjectsRealtime`) via `websocketManager` |
| `AuthRoutingProvider` | `src/providers/AuthRoutingProvider.tsx:12` | Client redirect for authenticated users outside `/orgs` and `/docs` | Implicit — affects `usePathname()`, `useRouter()`, `authClient.useSession()` |

### AuthRoutingProvider Logic (`src/providers/AuthRoutingProvider.tsx:17-38`)

- Reads `authClient.useSession()` (`isPending`, `session.user.id`) and `usePathname()`.
- If pending, unauthenticated, or already on `/orgs/*` or `/docs/*`, does nothing.
- Otherwise redirects to `ROUTES.ORGANIZATION.PROJECTS(lastOrganizationSlug)` if `localStorage["lastOrganizationSlug"]` exists, else `/orgs`.

### Interactions

- `ThemeProvider` is outermost so theme class is available before queries/sockets initialize.
- `QueryProvider` must wrap `SocketProvider` consumers that call `queryClient.setQueryData` (`useProjectsRealtime`).
- `SocketProvider` owns the WebSocket lifecycle; it does not hold domain state — it delegates to `websocketManager` singleton.

## Unknown

- No `AuthProvider` context besides `better-auth` client. Session is accessed directly via `authClient.useSession()` wherever needed.
