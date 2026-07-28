import Link from "next/link";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TYPE_ICONS } from "@/components/dashboard/type-icons";
import { itemTypesById, type Collection } from "@/lib/mock-data";

export function CollectionCard({ collection }: { collection: Collection }) {
  const dominantType = itemTypesById[collection.itemTypeIds[0]];

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card
        className="h-full border-l-4 transition-colors hover:bg-muted/40"
        style={{ borderLeftColor: dominantType?.color }}
      >
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium">{collection.name}</h3>
            {collection.isFavorite && (
              <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">{collection.itemCount} items</span>
          <p className="text-sm text-muted-foreground">{collection.description}</p>
          <div className="flex items-center gap-2 pt-1">
            {collection.itemTypeIds.map((typeId) => {
              const type = itemTypesById[typeId];
              const Icon = type ? TYPE_ICONS[type.icon] : null;
              if (!type || !Icon) return null;
              return <Icon key={typeId} className="size-3.5" style={{ color: type.color }} />;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
