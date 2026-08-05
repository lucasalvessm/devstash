import { prisma } from "@/lib/prisma";

// No auth is wired up yet, so every query is scoped to the seeded demo user for now.
// Swap this for the authenticated user's id once NextAuth is in place.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface ItemItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ItemWithType {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: ItemItemType;
  tags: string[];
}

function toItemWithType(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  itemType: ItemItemType;
  tags: { tag: { name: string } }[];
}): ItemWithType {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    itemType: item.itemType,
    tags: item.tags.map(({ tag }) => tag.name),
  };
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL }, isPinned: true },
    orderBy: { createdAt: "desc" },
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export async function getItemStats(): Promise<{ total: number; favorite: number }> {
  const [total, favorite] = await Promise.all([
    prisma.item.count({ where: { user: { email: DEMO_USER_EMAIL } } }),
    prisma.item.count({ where: { user: { email: DEMO_USER_EMAIL }, isFavorite: true } }),
  ]);

  return { total, favorite };
}
