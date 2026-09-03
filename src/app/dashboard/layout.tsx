import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSystemItemTypesWithCounts } from "@/lib/db/items";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, itemTypes, { favorites: favoriteCollections, recent: recentCollections }] =
    await Promise.all([auth(), getSystemItemTypesWithCounts(), getSidebarCollections()]);

  const user = {
    name: session?.user?.name ?? "Unknown",
    email: session?.user?.email ?? "",
    image: session?.user?.image ?? null,
  };

  return (
    <SidebarProvider className="min-h-full flex-1">
      <DashboardSidebar
        itemTypes={itemTypes}
        favoriteCollections={favoriteCollections}
        recentCollections={recentCollections}
        user={user}
      />
      <SidebarInset>
        <TopBar />
        <div className="flex-1 p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
