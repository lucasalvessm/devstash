import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

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
  const userId = await getCurrentUserId();

  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { createdAt: "desc" },
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const userId = await getCurrentUserId();

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { itemType: true, tags: { include: { tag: true } } },
  });

  return items.map(toItemWithType);
}

export async function getItemStats(): Promise<{ total: number; favorite: number }> {
  const userId = await getCurrentUserId();

  const [total, favorite] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);

  return { total, favorite };
}

export interface ItemTypeWithCount {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

const SYSTEM_ITEM_TYPE_ORDER = ["snippet", "prompt", "command", "note", "file", "image", "link"];

export async function getSystemItemTypesWithCounts(): Promise<ItemTypeWithCount[]> {
  const userId = await getCurrentUserId();

  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      _count: {
        select: { items: { where: { userId } } },
      },
    },
  });

  types.sort(
    (a, b) => SYSTEM_ITEM_TYPE_ORDER.indexOf(a.name) - SYSTEM_ITEM_TYPE_ORDER.indexOf(b.name),
  );

  return types.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon,
    color: type.color,
    itemCount: type._count.items,
  }));
}
