import { ItemRow } from "@/components/dashboard/ItemRow";
import { items } from "@/lib/mock-data";

const RECENT_ITEMS_LIMIT = 10;

export function RecentItemsSection() {
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Recent items</h2>
      <div className="flex flex-col gap-3">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
