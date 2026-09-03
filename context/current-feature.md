# Current Feature: Auth UI - Sign In, Register & Sign Out (Phase 3)

## Status

In Progress

## Goals

- Replace NextAuth's default pages with a custom `/sign-in` page
- Add a custom `/register` page
- Update the bottom-of-sidebar user footer with avatar, name, a sign-out dropdown, and a link to `/profile`

## Notes

### Sign In Page (`/sign-in`)
- Email and password input fields
- "Sign in with GitHub" button
- Link to register page
- Form validation and error display

### Register Page (`/register`)
- Name, email, password, confirm password fields
- Form validation (passwords match, email format)
- Submit to `/api/auth/register`
- Redirect to sign-in on success

### Bottom of Sidebar
- Display user avatar (GitHub image or initials fallback)
- Display user name
- Dropdown/up on avatar click with "Sign out" link
- Clicking the icon should go to `/profile`

### Avatar Logic
- If user has `image` (from GitHub): use that
- Otherwise: generate initials from name (e.g., "Brad Traversy" → "BT")
- Create a reusable avatar component that handles both cases

Testing plan:
1. Go to `/sign-in` - verify custom page renders
2. Sign in with GitHub - verify flow works
3. Sign in with email/password - verify flow works
4. Verify avatar shows in top bar (GitHub image or initials)
5. Click avatar - verify dropdown appears
6. Click "Sign out" - verify logout and redirect
7. Go to `/register` - create new account - verify redirect to sign-in

References:
- @context/features/auth-phase-3-spec.md

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
- Current-User Helper + Collection Stats Aggregation: added `src/lib/current-user.ts` (`getCurrentUserId`, request-memoized via React `cache()`) to replace the `DEMO_USER_EMAIL` const duplicated in `src/lib/db/collections.ts`/`items.ts`, switched all queries in both files to filter on the indexed `userId` FK instead of `user: { email }`, and replaced `collections.ts`'s full-item-row fetch + in-JS tally with a single grouped `$queryRaw` (`getStatsByCollectionId`) that computes `itemCount`/`dominantType`/`types` in Postgres. No schema changes; exported types/signatures unchanged.
- Auth Setup - NextAuth + GitHub Provider (Phase 1): added `next-auth@beta` + `@auth/prisma-adapter` with the split edge-compatible config pattern — `src/auth.config.ts` (GitHub provider only, edge-safe) and `src/auth.ts` (adds `PrismaAdapter`, `session: { strategy: "jwt" }`, and `jwt`/`session` callbacks that copy the user id onto the token/session). Added `src/app/api/auth/[...nextauth]/route.ts` exporting the handlers, `src/proxy.ts` (a separate edge NextAuth instance wrapping `auth()`, matcher on `/dashboard/:path*`) redirecting unauthenticated requests to the default `/api/auth/signin` page with `callbackUrl` preserved, and `src/types/next-auth.d.ts` extending `Session.user` with `id`. Used NextAuth's default sign-in/callback pages (no custom `pages.signIn`). `Account`/`Session`/`VerificationToken` Prisma models and `AUTH_SECRET`/`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET` env vars already existed from earlier setup. Verified live in a browser: `/dashboard` redirects to sign-in with `callbackUrl` set, and clicking "Sign in with GitHub" redirects to GitHub's OAuth authorize endpoint with the correct `client_id`/`redirect_uri`. `npm run build` and `npm run lint` pass. `getCurrentUserId()` still hardcodes the demo user — wiring it to the real session is out of scope for this phase (credentials provider and custom UI land in phases 2-3).
- Auth Credentials - Email/Password Provider (Phase 2): added a `Credentials` provider alongside GitHub — a `authorize: () => null` placeholder in the edge-safe `src/auth.config.ts`, overridden in `src/auth.ts` with real validation (Zod-parsed credentials, `prisma.user.findUnique` by email, `bcrypt.compare` against the stored hash, returning only `{ id, name, email, image }` so the password hash never flows into the JWT/session). Added `src/app/api/auth/register/route.ts` (`POST /api/auth/register`) validating `name`/`email`/`password`/`confirmPassword` with Zod (including a password-match `.refine`), checking for an existing user, hashing with `bcryptjs` (12 rounds), and returning `{ success, data|error }` with 201/400/409 status codes; malformed JSON bodies are caught and return 400 instead of a raw 500. Installed `zod` (new dependency, per the project's input-validation standard) and used `z.email()` instead of the deprecated `.email()` string method (zod v4). `User.password` already existed on the schema from earlier setup, so no migration was needed. Verified live in a browser/curl: registration (success, duplicate email, mismatched passwords, malformed body), credentials sign-in redirecting to `/dashboard`, and GitHub OAuth still redirecting correctly to GitHub's authorize endpoint. `npm run build` and `npm run lint` pass.
