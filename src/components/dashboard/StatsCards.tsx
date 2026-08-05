import { Boxes, Folder, Heart, Star, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats } from "@/lib/db/items";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
}

function StatTile({ icon: Icon, label, value, color }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon className="size-4.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold">{value.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export async function StatsCards() {
  const [itemStats, collectionStats] = await Promise.all([getItemStats(), getCollectionStats()]);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile icon={Boxes} label="Items" value={itemStats.total} color="#3b82f6" />
      <StatTile icon={Folder} label="Collections" value={collectionStats.total} color="#10b981" />
      <StatTile icon={Star} label="Favorite items" value={itemStats.favorite} color="#f59e0b" />
      <StatTile
        icon={Heart}
        label="Favorite collections"
        value={collectionStats.favorite}
        color="#ec4899"
      />
    </div>
  );
}
