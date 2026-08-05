import { ItemRow } from "@/components/dashboard/ItemRow";
import { getRecentItems } from "@/lib/db/items";

const RECENT_ITEMS_LIMIT = 10;

export async function RecentItemsSection() {
  const recentItems = await getRecentItems(RECENT_ITEMS_LIMIT);

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
