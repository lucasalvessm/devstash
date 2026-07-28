import { Layers, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border px-4">
      <div className="flex items-center gap-2 font-semibold">
        <Layers className="size-5 text-primary" />
        <span>DevStash</span>
      </div>

      <SidebarTrigger />

      <div className="relative mx-auto w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search items..." className="pl-8" />
      </div>

      <Button size="sm">
        <Plus />
        New Item
      </Button>
    </header>
  );
}
