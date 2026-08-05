import Link from "next/link";
import { Pin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TYPE_ICONS } from "@/components/dashboard/type-icons";
import type { ItemWithType } from "@/lib/db/items";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ItemRow({ item }: { item: ItemWithType }) {
  const type = item.itemType;
  const Icon = TYPE_ICONS[type.icon];

  return (
    <Link href={`/items/${item.id}`}>
      <Card
        className="border-l-4 transition-colors hover:bg-muted/40"
        style={{ borderLeftColor: type.color }}
      >
        <CardContent className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${type.color}1a`, color: type.color }}
          >
            {Icon && <Icon className="size-4.5" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-medium">{item.title}</h3>
              {item.isPinned && <Pin className="size-3.5 shrink-0 text-muted-foreground" />}
              {item.isFavorite && (
                <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="truncate text-sm text-muted-foreground">{item.description}</p>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <span className="shrink-0 text-sm text-muted-foreground">
            {formatDate(item.createdAt)}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
