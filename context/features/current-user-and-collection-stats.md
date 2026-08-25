# Current-user helper + collection stats aggregation

## Overview

Fixes 3 issues found by a code-scanner audit of `src/lib/db/collections.ts` and `src/lib/db/items.ts`:

1. Collection queries over-fetch full `Item`/`ItemType` rows just to compute `itemCount` and the dominant type in JS.
2. `DEMO_USER_EMAIL` is duplicated (copy-pasted) across `collections.ts` and `items.ts`.
3. Every query filters via the `user: { email: DEMO_USER_EMAIL }` relation instead of the indexed `userId` foreign key.

## Requirements

- Add a single shared helper (e.g. `src/lib/current-user.ts`) that resolves the demo user's `id` once. This is the one place that will need to change when NextAuth is wired up (swap for `session.user.id`). Remove the duplicated `DEMO_USER_EMAIL` const from `collections.ts` and `items.ts`.
- Update every query in `collections.ts` and `items.ts` to filter with `userId: <id>` instead of `user: { email: DEMO_USER_EMAIL }`.
- Replace `COLLECTION_WITH_ITEMS_INCLUDE` + `toCollectionWithStats` (which loads every related item row) with a Prisma aggregation — e.g. `groupBy` on `ItemCollection`/`Item` by `itemTypeId` with `_count`, or a raw `_count` per collection plus a grouped count query — so `itemCount` and `dominantType`/`types` are computed in the database, not by loading full rows into JS.
- Keep the existing exported shapes (`CollectionWithStats`, `ItemWithType`, etc.) and function signatures (`getRecentCollections`, `getSidebarCollections`, `getCollectionStats`, `getPinnedItems`, `getRecentItems`, `getItemStats`, `getSystemItemTypesWithCounts`) unchanged so calling components need no changes.
- No schema/migration changes expected — this is a query-layer refactor only.

## Out of scope

- Real authentication (NextAuth session wiring) — the helper still resolves the seeded demo user, just in one place instead of two.
- Any UI/component changes.
