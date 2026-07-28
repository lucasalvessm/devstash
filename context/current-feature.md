# Current Feature

Dashboard UI Phase 2

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

Phase 2 of 3 for the dashboard UI layout (see @context/features/dashboard-phase-2-spec.md).

- Collapsible sidebar
- Items/types with links to /items/TYPE (eg. items/snippets)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

## Notes

References: @context/screenshots/dashboard-ui-main.png, @context/project-overview.md, @src/lib/mock-data.ts, @context/features/dashboard-phase-1-spec.md, @context/features/dashboard-phase-3-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: initialized shadcn/ui, added /dashboard route with top bar (logo, search, New Item button), sidebar/main placeholders, and dark mode by default
- Dashboard UI Phase 2: replaced the sidebar placeholder with the shadcn sidebar block — collapsible Types/Collections navigation (type links to /items/TYPE, favorite and recent collections), user avatar footer, drawer-on-mobile behavior, and a sidebar toggle in the top bar. Added Playwright E2E setup (`npm run test:e2e`) with a first spec covering the sidebar.
