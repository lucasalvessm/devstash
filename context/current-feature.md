# Current Feature

Seed Data Script

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos (see @context/features/seed-spec.md).

- Seed a demo User (demo@devstash.io / "Demo User", password hashed with bcryptjs at 12 rounds, isPro: false, emailVerified set to current date)
- Seed the 7 system ItemTypes (snippet, prompt, command, note, file, image, link) with their Lucide icon names and colors, all `isSystem: true`
- Seed 5 Collections with items as specified: React Patterns (3 TS snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 real doc links), Terminal Commands (4 commands), Design Resources (4 real links)

## Notes

References: @context/features/seed-spec.md, @context/project-overview.md, @context/coding-standards.md

## Previous Feature: Prisma + Neon PostgreSQL Setup

We will have a development branch that we work on (in DATABASE_URL) and then a production branch. We ALWAYS create migrations and never push directly unless specified.

IMPORTANT! Use Prisma 7, which has some breaking changes. Read the entire upgrade guide at https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7 to get a good idea of the changes. Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres

Prisma 7 specifics that shaped this setup: the generator is `prisma-client` (not `prisma-client-js`) with a required custom `output` path (`src/generated/prisma`, gitignored); the datasource `url`/`directUrl` fields are no longer allowed in `schema.prisma` at all — the connection URL lives only in `prisma.config.ts` (used by the CLI) and in the driver adapter passed to `PrismaClient` at runtime (used by the app). We use `@prisma/adapter-neon`: the app connects via the pooled `DATABASE_URL` (`src/lib/prisma.ts`), while `prisma.config.ts` and thus `prisma migrate`/`studio`/`db pull` use the unpooled `DIRECT_URL` — Neon's pooler doesn't reliably support the advisory locks/DDL that migrations need.

Schema implemented as drafted in project-overview.md (User/ItemType/Item/Collection/ItemCollection/Tag), plus the NextAuth v5 required models (Account, Session, VerificationToken). The open questions from project-overview.md (Tag global vs. per-user, contentType possibly derivable from ItemType) were intentionally left as-is per the draft — to revisit later, not blocking this setup.

All models/fields use `@map`/`@@map` so Postgres gets idiomatic singular snake_case tables/columns (`user`, `item_type`, `stripe_customer_id`, ...) while the Prisma schema and generated TS client stay camelCase/PascalCase — NextAuth's already-snake_case `Account` OAuth fields (`refresh_token`, etc.) were left untouched since that's the Auth.js-documented shape, not our convention. The implicit Item↔Tag many-to-many (which Prisma would otherwise manage as `_ItemTags` with fixed `A`/`B` columns) was converted to an explicit `ItemTag` join model, mirroring `ItemCollection`, so there's no naming exception.

A real Neon database is now connected and the initial migration (`prisma/migrations/20260804063105_init`) has been applied. Note: `DIRECT_URL` in `.env` currently points at the same pooled (`-pooler`) host as `DATABASE_URL` rather than Neon's unpooled endpoint — worked fine for this migration, but if a future migration hits pooler-related errors (advisory locks/prepared statements), swap `DIRECT_URL` for Neon's direct connection string from the Neon console.

References: @context/project-overview.md, @context/coding-standards.md, @context/features/database-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: initialized shadcn/ui, added /dashboard route with top bar (logo, search, New Item button), sidebar/main placeholders, and dark mode by default
- Dashboard UI Phase 2: replaced the sidebar placeholder with the shadcn sidebar block — collapsible Types/Collections navigation (type links to /items/TYPE, favorite and recent collections), user avatar footer, drawer-on-mobile behavior, and a sidebar toggle in the top bar. Added Playwright E2E setup (`npm run test:e2e`) with a first spec covering the sidebar.
- Dashboard UI Phase 3: replaced the main-area placeholder with 4 stats cards (items, collections, favorite items, favorite collections), a Collections grid (color-accented by each collection's dominant item type), a Pinned items list, and a Recent items list (top 10 by createdAt). Added shadcn Card/Badge components, a shared type-icon map, and expanded mock-data with enough sample items to populate the pinned/recent lists. Added an e2e spec covering the new main content.
- Prisma + Neon PostgreSQL Setup: added `prisma/schema.prisma` (User/ItemType/Item/Collection/ItemCollection/Tag/ItemTag plus NextAuth's Account/Session/VerificationToken), `prisma.config.ts`, and a `src/lib/prisma.ts` client singleton using `@prisma/adapter-neon`. Installed Prisma 7 (`prisma`, `@prisma/client`, `@prisma/adapter-neon`, `dotenv`) and worked through its breaking changes (custom `prisma-client` generator output, connection URLs moved out of `schema.prisma` into `prisma.config.ts`/the driver adapter). Mapped every table/column to singular snake_case via `@map`/`@@map` and replaced the implicit Item↔Tag many-to-many with an explicit `ItemTag` join model. Created and applied migrations against a real Neon database. Added `scripts/test-db.ts` (a standalone DB connectivity check, run via `npx tsx` since Prisma's generated client uses bundler-style extension-less imports plain `node` can't resolve) and a `db:studio` npm script.
