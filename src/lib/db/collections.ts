import { prisma } from "@/lib/prisma";

// No auth is wired up yet, so every query is scoped to the seeded demo user for now.
// Swap this for the authenticated user's id once NextAuth is in place.
const DEMO_USER_EMAIL = "demo@devstash.io";

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

type CollectionWithItems = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  items: { item: { itemType: CollectionItemType } }[];
};

function toCollectionWithStats(collection: CollectionWithItems): CollectionWithStats {
  const typeCounts = new Map<string, { type: CollectionItemType; count: number }>();

  for (const { item } of collection.items) {
    const existing = typeCounts.get(item.itemType.id);
    if (existing) {
      existing.count += 1;
    } else {
      typeCounts.set(item.itemType.id, {
        type: {
          id: item.itemType.id,
          name: item.itemType.name,
          icon: item.itemType.icon,
          color: item.itemType.color,
        },
        count: 1,
      });
    }
  }

  const types = [...typeCounts.values()]
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.type);

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    isFavorite: collection.isFavorite,
    itemCount: collection.items.length,
    dominantType: types[0] ?? null,
    types,
  };
}

const COLLECTION_WITH_ITEMS_INCLUDE = {
  items: {
    include: {
      item: {
        include: { itemType: true },
      },
    },
  },
} as const;

export async function getRecentCollections(limit = 6): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: COLLECTION_WITH_ITEMS_INCLUDE,
  });

  return collections.map(toCollectionWithStats);
}

export async function getSidebarCollections(
  recentLimit = 5,
): Promise<{ favorites: CollectionWithStats[]; recent: CollectionWithStats[] }> {
  const [favorites, recent] = await Promise.all([
    prisma.collection.findMany({
      where: { user: { email: DEMO_USER_EMAIL }, isFavorite: true },
      orderBy: { createdAt: "desc" },
      include: COLLECTION_WITH_ITEMS_INCLUDE,
    }),
    prisma.collection.findMany({
      where: { user: { email: DEMO_USER_EMAIL }, isFavorite: false },
      orderBy: { createdAt: "desc" },
      take: recentLimit,
      include: COLLECTION_WITH_ITEMS_INCLUDE,
    }),
  ]);

  return {
    favorites: favorites.map(toCollectionWithStats),
    recent: recent.map(toCollectionWithStats),
  };
}

export async function getCollectionStats(): Promise<{ total: number; favorite: number }> {
  const [total, favorite] = await Promise.all([
    prisma.collection.count({ where: { user: { email: DEMO_USER_EMAIL } } }),
    prisma.collection.count({ where: { user: { email: DEMO_USER_EMAIL }, isFavorite: true } }),
  ]);

  return { total, favorite };
}
