import { Prisma } from "@/generated/prisma/client";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export interface CollectionItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface CollectionWithStats {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantType: CollectionItemType | null;
  types: CollectionItemType[];
}

interface CollectionBase {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
}

interface CollectionStats {
  itemCount: number;
  dominantType: CollectionItemType | null;
  types: CollectionItemType[];
}

interface CollectionTypeCountRow {
  collectionId: string;
  typeId: string;
  typeName: string;
  typeIcon: string;
  typeColor: string;
  count: number;
}

const EMPTY_STATS: CollectionStats = { itemCount: 0, dominantType: null, types: [] };

const COLLECTION_SELECT = {
  id: true,
  name: true,
  description: true,
  isFavorite: true,
} as const;

// Computes itemCount + per-type breakdown for a batch of collections via a
// grouped count query, instead of loading every item row into JS to tally them.
async function getStatsByCollectionId(
  collectionIds: string[],
): Promise<Map<string, CollectionStats>> {
  if (collectionIds.length === 0) return new Map();

  const rows = await prisma.$queryRaw<CollectionTypeCountRow[]>(Prisma.sql`
    SELECT
      ic.collection_id AS "collectionId",
      it.id AS "typeId",
      it.name AS "typeName",
      it.icon AS "typeIcon",
      it.color AS "typeColor",
      COUNT(*)::int AS "count"
    FROM item_collection ic
    JOIN item i ON i.id = ic.item_id
    JOIN item_type it ON it.id = i.item_type_id
    WHERE ic.collection_id IN (${Prisma.join(collectionIds)})
    GROUP BY ic.collection_id, it.id, it.name, it.icon, it.color
  `);

  const rowsByCollection = new Map<string, CollectionTypeCountRow[]>();
  for (const row of rows) {
    const list = rowsByCollection.get(row.collectionId);
    if (list) {
      list.push(row);
    } else {
      rowsByCollection.set(row.collectionId, [row]);
    }
  }

  const stats = new Map<string, CollectionStats>();
  for (const [collectionId, typeRows] of rowsByCollection) {
    const types = [...typeRows]
      .sort((a, b) => b.count - a.count)
      .map((row) => ({ id: row.typeId, name: row.typeName, icon: row.typeIcon, color: row.typeColor }));

    stats.set(collectionId, {
      itemCount: typeRows.reduce((sum, row) => sum + row.count, 0),
      dominantType: types[0] ?? null,
      types,
    });
  }

  return stats;
}

function toCollectionsWithStats(
  collections: CollectionBase[],
  stats: Map<string, CollectionStats>,
): CollectionWithStats[] {
  return collections.map((collection) => ({
    ...collection,
    ...(stats.get(collection.id) ?? EMPTY_STATS),
  }));
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithStats[]> {
  const userId = await getCurrentUserId();

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: COLLECTION_SELECT,
  });

  const stats = await getStatsByCollectionId(collections.map((collection) => collection.id));

  return toCollectionsWithStats(collections, stats);
}

export async function getSidebarCollections(
  recentLimit = 5,
): Promise<{ favorites: CollectionWithStats[]; recent: CollectionWithStats[] }> {
  const userId = await getCurrentUserId();

  const [favorites, recent] = await Promise.all([
    prisma.collection.findMany({
      where: { userId, isFavorite: true },
      orderBy: { createdAt: "desc" },
      select: COLLECTION_SELECT,
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: false },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
      select: COLLECTION_SELECT,
    }),
  ]);

  const stats = await getStatsByCollectionId([
    ...favorites.map((collection) => collection.id),
    ...recent.map((collection) => collection.id),
  ]);

  return {
    favorites: toCollectionsWithStats(favorites, stats),
    recent: toCollectionsWithStats(recent, stats),
  };
}

export async function getCollectionStats(): Promise<{ total: number; favorite: number }> {
  const userId = await getCurrentUserId();

  const [total, favorite] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorite };
}
