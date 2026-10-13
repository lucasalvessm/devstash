import { Boxes, Folder } from "lucide-react";

import { TYPE_ICONS } from "@/components/dashboard/type-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ItemTypeWithCount } from "@/lib/db/items";

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

interface ProfileStatsProps {
  totalItems: number;
  totalCollections: number;
  itemTypes: ItemTypeWithCount[];
}

export function ProfileStats({ totalItems, totalCollections, itemTypes }: ProfileStatsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f61a] text-[#3b82f6]">
              <Boxes className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{totalItems.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Items</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#10b9811a] text-[#10b981]">
              <Folder className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">{totalCollections.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">Collections</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items by type</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {itemTypes.map((type) => {
            const Icon = TYPE_ICONS[type.icon];
            return (
              <div key={type.id} className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${type.color}1a`, color: type.color }}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{type.itemCount}</span>
                  <span className="text-xs text-muted-foreground">{capitalize(type.name)}s</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
