"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TYPE_ICONS } from "@/components/dashboard/type-icons";
import { collections, currentUser, itemTypeCounts, itemTypes } from "@/lib/mock-data";

function typeSlug(name: string) {
  return `${name.toLowerCase()}s`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const favoriteCollections = collections.filter((collection) => collection.isFavorite);
  const recentCollections = collections.filter((collection) => !collection.isFavorite);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              render={<CollapsibleTrigger />}
              className="flex w-full items-center justify-between text-xs tracking-wide uppercase"
            >
              <span>Types</span>
              <ChevronDown className="size-3.5 text-sidebar-foreground/50 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {itemTypes
                    .filter((type) => type.isSystem)
                    .map((type) => {
                      const Icon = TYPE_ICONS[type.icon];
                      const href = `/items/${typeSlug(type.name)}`;
                      return (
                        <SidebarMenuItem key={type.id}>
                          <SidebarMenuButton
                            render={<Link href={href} />}
                            isActive={pathname === href}
                            tooltip={type.name}
                          >
                            <Icon style={{ color: type.color }} />
                            <span>{type.name}</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>{itemTypeCounts[type.id] ?? 0}</SidebarMenuBadge>
                        </SidebarMenuItem>
                      );
                    })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              render={<CollapsibleTrigger />}
              className="flex w-full items-center justify-between text-xs tracking-wide uppercase"
            >
              <span>Collections</span>
              <ChevronDown className="size-3.5 text-sidebar-foreground/50 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              {favoriteCollections.length > 0 && (
                <SidebarGroupContent>
                  <SidebarGroupLabel className="h-6 text-[0.65rem] text-sidebar-foreground/50">
                    Favorites
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {favoriteCollections.map((collection) => (
                      <SidebarMenuItem key={collection.id}>
                        <SidebarMenuButton
                          render={<Link href={`/collections/${collection.id}`} />}
                          isActive={pathname === `/collections/${collection.id}`}
                          tooltip={collection.name}
                        >
                          <span>{collection.name}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}

              {recentCollections.length > 0 && (
                <SidebarGroupContent>
                  <SidebarGroupLabel className="h-6 text-[0.65rem] text-sidebar-foreground/50">
                    Recent
                  </SidebarGroupLabel>
                  <SidebarMenu>
                    {recentCollections.map((collection) => (
                      <SidebarMenuItem key={collection.id}>
                        <SidebarMenuButton
                          render={<Link href={`/collections/${collection.id}`} />}
                          isActive={pathname === `/collections/${collection.id}`}
                          tooltip={collection.name}
                        >
                          <span>{collection.name}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-md p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar size="sm">
            <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{currentUser.name}</span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {currentUser.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <Settings />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
