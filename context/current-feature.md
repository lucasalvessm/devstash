# Current Feature

Dashboard Items

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

Replace the dummy item data displayed in the main area of the dashboard (right side), with actual data from the database. This includes both pinned and recent items. It should look how it does now, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

If there are no pinned items, nothing should display there.

- Create src/lib/db/items.ts with data fetching functions
- Fetch items directly in server component
- Item card icon/border derived from the item type
- Display item type tags and anything else currently there. You can also reference the screenshot if needed
- Update collection stats display

Check the @context/screenshots/dashboard-ui-main.png screenshot if needed, but layout and design is already there.

## Notes

Added `src/lib/db/items.ts` with `getPinnedItems()`, `getRecentItems(limit = 10)`, and `getItemStats()`, following the same pattern as `collections.ts` (scoped to the seeded demo user by email, `itemType` and `tags` included and mapped to a flat `ItemWithType` shape). Also added `getCollectionStats()` to `collections.ts` since the stats cards needed real collection counts too. `ItemRow` now takes `ItemWithType` instead of the mock `Item`, and `PinnedItemsSection`/`RecentItemsSection`/`StatsCards` became async server components calling these fetchers directly — `PinnedItemsSection` still returns `null` when there are no pinned items, matching the seed data (which has no items marked pinned or favorite, so that section and the favorite counts render empty/zero, which is correct). Sidebar remains mock data (still out of scope). Updated the existing `e2e/dashboard-main.spec.ts`, which asserted mock-data pinned items (`useAuth Hook`) that no longer exist in the real seed — it now asserts the Pinned heading is absent instead. Verified with a Playwright screenshot against the dev server (no console errors) and `npm run test:e2e` (4/4 passing); `npm run build` and `npm run lint` both pass.

References: @context/features/dashboard-items-spec.md, @context/project-overview.md, @context/coding-standards.md

## Previous Feature: Dashboard Collections

Replace the dummy collection data displayed in the main area of the dashboard (right side), with actual data from the database. It should look how it does now with the 6 cards of recent collections, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

Do not add the items underneath yet. We will do that later.

- Create src/lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design. You can also reference the screenshot
- Update collection stats display

Added `src/lib/db/collections.ts` with `getRecentCollections(limit = 6)`, which queries `Collection` (with `items.item.itemType` included) for the demo user, ordered by `createdAt desc`, and computes per-collection item counts and a type breakdown sorted by frequency (`dominantType` = most-used `ItemType`, used for the card's left border; `types` = full list, used for the row of small icons). No auth is wired up yet, so the query is scoped by the seeded demo user's email (`demo@devstash.io`) as a stand-in until NextAuth is in place. `CollectionsSection` became an async server component calling this directly (no client fetch/loading state needed), and `CollectionCard` now takes the richer `CollectionWithStats` shape instead of the old mock `Collection` + `itemTypesById` lookup. The sidebar's collection lists are unchanged (still mock data) — out of scope per the spec, which called out only the main-area cards. Verified with a Playwright screenshot against the dev server: all 5 seeded collections render with correct item counts, border colors, and type icons, no console errors; `npm run build` and `npm run lint` both pass.

References: @context/features/dashboard-collections-spec.md, @context/project-overview.md, @context/coding-standards.md

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
