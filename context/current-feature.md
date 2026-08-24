# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

## Notes

## Previous Feature: Add Pro Badge to Sidebar

Add a pro badge to the files and images type in the sidebar.

- Use the shadcn/ui Badge component
- Make badge clean and subtle
- Make PRO all uppercase

Added a small `Badge` (outline variant) next to "File" and "Image" in the sidebar's item type list in `DashboardSidebar.tsx`, gated on a `PRO_ITEM_TYPES` set matching `type.name`. Styled subtly: `h-4`, `text-[0.6rem]`, muted `sidebar-foreground/50` text, sidebar-scoped border token, and hidden in collapsed icon-only sidebar mode (matching the existing count-badge pattern). Also added an explicit `truncate` class to the type name span — needed because inserting the badge after it would otherwise shift the button's `[&>span:last-child]:truncate` CSS rule onto the badge instead of the name. Verified with a Playwright screenshot against the dev server (badge renders clean, doesn't collide with the item count badge, no console errors); `npm run build`, `npm run lint`, and `npm run test:e2e` (4/4, unchanged) all pass.

References: @context/features/add-pro-badge-sidebar.md, @src/components/dashboard/DashboardSidebar.tsx, @context/coding-standards.md

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: initialized shadcn/ui, added /dashboard route with top bar (logo, search, New Item button), sidebar/main placeholders, and dark mode by default
- Dashboard UI Phase 2: replaced the sidebar placeholder with the shadcn sidebar block — collapsible Types/Collections navigation (type links to /items/TYPE, favorite and recent collections), user avatar footer, drawer-on-mobile behavior, and a sidebar toggle in the top bar. Added Playwright E2E setup (`npm run test:e2e`) with a first spec covering the sidebar.
- Dashboard UI Phase 3: replaced the main-area placeholder with 4 stats cards (items, collections, favorite items, favorite collections), a Collections grid (color-accented by each collection's dominant item type), a Pinned items list, and a Recent items list (top 10 by createdAt). Added shadcn Card/Badge components, a shared type-icon map, and expanded mock-data with enough sample items to populate the pinned/recent lists. Added an e2e spec covering the new main content.
- Prisma + Neon PostgreSQL Setup: added `prisma/schema.prisma` (User/ItemType/Item/Collection/ItemCollection/Tag/ItemTag plus NextAuth's Account/Session/VerificationToken), `prisma.config.ts`, and a `src/lib/prisma.ts` client singleton using `@prisma/adapter-neon`. Installed Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-neon`, `dotenv`) and worked through its breaking changes (custom `prisma-client` generator output, connection URLs moved out of `schema.prisma` into `prisma.config.ts`/the driver adapter). Mapped every table/column to singular snake_case via `@map`/`@@map` and replaced the implicit Item↔Tag many-to-many with an explicit `ItemTag` join model. Created and applied migrations against a real Neon database. Added `scripts/test-db.ts` (a standalone DB connectivity check, run via `npx tsx` since Prisma's generated client uses bundler-style extension-less imports plain `node` can't resolve) and a `db:studio` npm script.
- Seed Data Script: added `prisma/seed.ts`, seeding the demo user, 7 system item types, and 5 collections (18 items) per @context/features/seed-spec.md. Wired as `migrations.seed` in `prisma.config.ts` and as `npm run db:seed`. Added `bcryptjs` for password hashing.
- Dashboard Collections: added `src/lib/db/collections.ts` (`getRecentCollections`) and wired `CollectionsSection`/`CollectionCard` to fetch real Collection/Item/ItemType data from Neon via Prisma instead of `mock-data.ts`, computing item counts and a dominant-type border color + per-type icon row from actual seeded items. Scoped to the demo user by email until auth exists. Sidebar collection lists remain mock data (out of scope).
- Dashboard Items: added `src/lib/db/items.ts` (`getPinnedItems`, `getRecentItems`, `getItemStats`) and `getCollectionStats` in `collections.ts`, wiring `PinnedItemsSection`/`RecentItemsSection`/`StatsCards`/`ItemRow` to real Item/ItemType/Tag data from Neon instead of `mock-data.ts`. Pinned section still hides itself when empty (true of the current seed data). Updated `e2e/dashboard-main.spec.ts` to match real seeded data instead of mock titles.
- Stats & Sidebar: added `getSystemItemTypesWithCounts` in `items.ts` and `getSidebarCollections` in `collections.ts` (extracting a shared `toCollectionWithStats` helper), wiring `DashboardSidebar` to real ItemType/Collection data instead of `mock-data.ts` — item type links/counts, favorite collections (star icon) and recent collections (dominant-type colored circle), plus a new "View all collections" link to `/collections`. `DashboardLayout` became an async server component to fetch this data for the still-client-side `DashboardSidebar`. Main-area stats were already wired to real data in the prior feature. Updated `e2e/dashboard.spec.ts` for the new "View all collections" link and the empty Favorites group (no favorite collections in the seed).
- Add Pro Badge to Sidebar: added a subtle "PRO" `Badge` next to the File and Image item types in `DashboardSidebar.tsx`, gated on a `PRO_ITEM_TYPES` set. No data/schema changes.
