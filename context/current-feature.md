# Current Feature

Dashboard Collections

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

Replace the dummy collection data displayed in the main area of the dashboard (right side), with actual data from the database. It should look how it does now with the 6 cards of recent collections, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

Do not add the items underneath yet. We will do that later.

- Create src/lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design. You can also reference the screenshot
- Update collection stats display

## Notes

Added `src/lib/db/collections.ts` with `getRecentCollections(limit = 6)`, which queries `Collection` (with `items.item.itemType` included) for the demo user, ordered by `createdAt desc`, and computes per-collection item counts and a type breakdown sorted by frequency (`dominantType` = most-used `ItemType`, used for the card's left border; `types` = full list, used for the row of small icons). No auth is wired up yet, so the query is scoped by the seeded demo user's email (`demo@devstash.io`) as a stand-in until NextAuth is in place. `CollectionsSection` became an async server component calling this directly (no client fetch/loading state needed), and `CollectionCard` now takes the richer `CollectionWithStats` shape instead of the old mock `Collection` + `itemTypesById` lookup. The sidebar's collection lists are unchanged (still mock data) — out of scope per the spec, which called out only the main-area cards. Verified with a Playwright screenshot against the dev server: all 5 seeded collections render with correct item counts, border colors, and type icons, no console errors; `npm run build` and `npm run lint` both pass.

References: @context/features/dashboard-collections-spec.md, @context/project-overview.md, @context/coding-standards.md

## Previous Feature: Seed Data Script

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos (see @context/features/seed-spec.md).

- Seed a demo User (demo@devstash.io / "Demo User", password hashed with bcryptjs at 12 rounds, isPro: false, emailVerified set to current date)
- Seed the 7 system ItemTypes (snippet, prompt, command, note, file, image, link) with their Lucide icon names and colors, all `isSystem: true`
- Seed 5 Collections with items as specified: React Patterns (3 TS snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 real doc links), Terminal Commands (4 commands), Design Resources (4 real links)

Added `prisma/seed.ts`, seeding the demo user (bcryptjs-hashed password, 12 rounds), the 7 system `ItemType`s, and 5 collections with 18 items total (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources). The script is safe to re-run: the user and item types are upserted, and the demo user's collections/items are deleted and recreated each run (cascades clean up `ItemCollection`/`ItemTag`). `ItemType`'s `[userId, name]` unique constraint can't be used in a Prisma upsert `where` when `userId` is `null` (Prisma rejects `null` in a compound-unique lookup), so system types use a `findFirst` + `create`/`update` pattern instead. Wired as `migrations.seed` in `prisma.config.ts` (so `prisma migrate reset` runs it) and as `npm run db:seed`. Added `bcryptjs` as a dependency.

References: @context/features/seed-spec.md, @context/project-overview.md, @context/coding-standards.md

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: initialized shadcn/ui, added /dashboard route with top bar (logo, search, New Item button), sidebar/main placeholders, and dark mode by default
- Dashboard UI Phase 2: replaced the sidebar placeholder with the shadcn sidebar block — collapsible Types/Collections navigation (type links to /items/TYPE, favorite and recent collections), user avatar footer, drawer-on-mobile behavior, and a sidebar toggle in the top bar. Added Playwright E2E setup (`npm run test:e2e`) with a first spec covering the sidebar.
- Dashboard UI Phase 3: replaced the main-area placeholder with 4 stats cards (items, collections, favorite items, favorite collections), a Collections grid (color-accented by each collection's dominant item type), a Pinned items list, and a Recent items list (top 10 by createdAt). Added shadcn Card/Badge components, a shared type-icon map, and expanded mock-data with enough sample items to populate the pinned/recent lists. Added an e2e spec covering the new main content.
- Prisma + Neon PostgreSQL Setup: added `prisma/schema.prisma` (User/ItemType/Item/Collection/ItemCollection/Tag/ItemTag plus NextAuth's Account/Session/VerificationToken), `prisma.config.ts`, and a `src/lib/prisma.ts` client singleton using `@prisma/adapter-neon`. Installed Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-neon`, `dotenv`) and worked through its breaking changes (custom `prisma-client` generator output, connection URLs moved out of `schema.prisma` into `prisma.config.ts`/the driver adapter). Mapped every table/column to singular snake_case via `@map`/`@@map` and replaced the implicit Item↔Tag many-to-many with an explicit `ItemTag` join model. Created and applied migrations against a real Neon database. Added `scripts/test-db.ts` (a standalone DB connectivity check, run via `npx tsx` since Prisma's generated client uses bundler-style extension-less imports plain `node` can't resolve) and a `db:studio` npm script.
- Seed Data Script: added `prisma/seed.ts`, seeding the demo user, 7 system item types, and 5 collections (18 items) per @context/features/seed-spec.md. Wired as `migrations.seed` in `prisma.config.ts` and as `npm run db:seed`. Added `bcryptjs` for password hashing.
- Dashboard Collections: added `src/lib/db/collections.ts` (`getRecentCollections`) and wired `CollectionsSection`/`CollectionCard` to fetch real Collection/Item/ItemType data from Neon via Prisma instead of `mock-data.ts`, computing item counts and a dominant-type border color + per-type icon row from actual seeded items. Scoped to the demo user by email until auth exists. Sidebar collection lists remain mock data (out of scope).
