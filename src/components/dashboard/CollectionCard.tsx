import Link from "next/link";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TYPE_ICONS } from "@/components/dashboard/type-icons";
import type { CollectionWithStats } from "@/lib/db/collections";

export function CollectionCard({ collection }: { collection: CollectionWithStats }) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card
        className="h-full border-l-4 transition-colors hover:bg-muted/40"
        style={{ borderLeftColor: collection.dominantType?.color }}
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
            {collection.types.map((type) => {
              const Icon = TYPE_ICONS[type.icon];
              if (!Icon) return null;
              return <Icon key={type.id} className="size-3.5" style={{ color: type.color }} />;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
