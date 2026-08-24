# Current Feature: Add Pro Badge to Sidebar

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Add a "PRO" badge to the File and Image item types in the sidebar
- Use the shadcn/ui Badge component
- Badge text is uppercase ("PRO")
- Keep the badge visually clean and subtle (not loud/attention-grabbing)

## Notes

File and Image are the two Pro-only item types (per @context/project-overview.md monetization section — file/image uploads are gated behind Pro). The badge should mark them in the sidebar's item type list, styled subtly rather than as a strong call-to-action.

References: @context/features/add-pro-badge-sidebar.md, @src/components/dashboard/DashboardSidebar.tsx, @context/coding-standards.md

## Previous Feature: Stats & Sidebar

Show the stats in the main area from the data in the database instead of the @src/lib/mock-data.ts file.

Show the system item types in the sidebar and the actual collection data from the database.

- Display stats pertaining to database data, keeping the current design/layout
- Display item types in sidebar with their icons, linking to /items/[typename]
- Add "View all collections" link under the collections list that goes to /collections
- Keep the star icons for favorite collections but for recents, each collection should show a colored circle based on the most-used item type in that collection
- Create @src/lib/db/items.ts and add the database functions. Use the collections file for reference if needed

The main-area stats cards were already wired to real data as part of the previous Dashboard Items feature (`getItemStats`/`getCollectionStats`), so this feature's remaining scope was the sidebar. Added `getSystemItemTypesWithCounts()` to `src/lib/db/items.ts` (system `ItemType`s with a per-type item count scoped to the demo user) and `getSidebarCollections()` to `src/lib/db/collections.ts` (favorite collections plus the 5 most recent non-favorite ones), refactoring the existing per-collection type-breakdown logic in `collections.ts` into a shared `toCollectionWithStats` helper reused by both `getRecentCollections` and the new function. `DashboardSidebar` changed from reading `mock-data.ts` to receiving `itemTypes`/`favoriteCollections`/`recentCollections` as props (it stays a client component for `usePathname` active-link state, so `DashboardLayout` became an async server component that fetches this data and passes it down). Item type names are stored lowercase in the seed (`"snippet"`, not `"Snippet"`), so the sidebar now capitalizes them for display. Favorite collections keep the amber star icon; recent (non-favorite) collections show a small circle colored by their dominant item type instead. Added a "View all collections" link below the list, pointing to `/collections` (that page doesn't exist yet — out of scope here, same as the per-type `/items/[typename]` pages, both currently 404). The seeded demo data has zero favorite collections, so the sidebar's Favorites group renders empty/hidden, matching the same empty-state pattern already used for pinned items. `currentUser` in the sidebar footer remains mock data (not mentioned in the spec). `getSystemItemTypesWithCounts()` also sorts the results by an explicit `SYSTEM_ITEM_TYPE_ORDER` list (snippet, prompt, command, note, file, image, link) instead of relying on incidental DB row order, per a follow-up request to guarantee that display order in the sidebar. Updated `e2e/dashboard.spec.ts`, which asserted a "Favorites" group and a text match on "Collections" that became ambiguous once the "View all collections" link was added — switched to a role-scoped locator for the section heading and asserted "Recent" instead of "Favorites". Verified with a Playwright screenshot against the dev server (no console errors, item type counts sum to the total items stat, colored dots match each collection's dominant type) and `npm run test:e2e` (4/4 passing); `npm run build` and `npm run lint` both pass.

References: @context/features/stats-sidebar-spec.md, @src/lib/db/collections.ts, @context/project-overview.md, @context/coding-standards.md

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
