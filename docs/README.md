# Delok Frontend Documentation

Source of truth: repository at `C:\Users\Yuan\OneDrive\Desktop\Codes\Delok\delok-frontend`. Everything here is traced to files that exist in `app/`, `src/`, `public/`, and config files.

## Structure

| Area | Path | What it answers |
|------|------|-----------------|
| Architecture | `docs/architecture/` | How the frontend is built: routing, providers, state, API, rendering |
| Design | `docs/design/` | Actual design tokens and styling conventions in `app/globals.css` |
| Application | `docs/application/` | What the product does today and how users move through it |
| Domains | `docs/domains/` | Per-domain implementation: purpose, files, API, consumers, status |
| Decisions | `docs/decisions/` | Traceable architectural decisions (or Unknown) |
| Guides | `docs/guides/` | How to work with the codebase based on existing conventions |

## Index

### Architecture
- [Overview](architecture/README.md)
- [Routing](architecture/routing.md)
- [Providers & Hierarchy](architecture/providers.md)
- [State Management](architecture/state-management.md)
- [API & Backend Integration](architecture/api-integration.md)

### Design
- [Design System](design/README.md)

### Application
- [Product Capabilities & Flows](application/README.md)

### Domains
- [Domains Overview](domains/README.md)
- [auth](domains/auth.md)
- [organization](domains/organization.md)
- [project](domains/project.md)
- [log](domains/log.md)
- [log-explorer](domains/log-explorer.md)
- [api-key](domains/api-key.md)

### Guides
- [Getting Started](guides/getting-started.md)
- [Conventions](guides/conventions.md)
- [Adding a Domain](guides/adding-a-domain.md)
- [Adding a Route](guides/adding-a-route.md)

### Decisions
- [ADRs](decisions/README.md)

## Maintenance

> Documentation follows the codebase.

When code changes, review the doc that maps to the change:

| Change | Review |
|--------|--------|
| Adding a domain (`src/domains/<name>`) | `docs/domains/README.md` + new `docs/domains/<name>.md` |
| Adding a route (`app/...`) | `docs/architecture/routing.md` and `docs/application/README.md` |
| Changing providers (`src/providers/`) | `docs/architecture/providers.md` |
| Changing design tokens (`app/globals.css`, Tailwind) | `docs/design/README.md` |
| Changing auth (`src/lib/auth/*`, `src/domains/auth/*`) | `docs/domains/auth.md` + `docs/architecture/api-integration.md` |
| Changing API client / base URL | `docs/architecture/api-integration.md` |
| Changing realtime (`src/lib/websocket/*`) | `docs/architecture/api-integration.md` + `docs/domains/log-explorer.md` |

Do not update every doc per change. Only the affected ones.
