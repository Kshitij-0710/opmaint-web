"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Clipboard, Send, GitBranch, CheckSquare, BarChart2, 
  Package, Archive, Tag, MapPin, Users, User, MessageCircle, 
  DownloadCloud, Trash2, Zap, Settings, ChevronRight, ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// REMOVED: import { ScrollArea } from "@/components/ui/scroll-area"; 

// Menu Configuration matching your Flutter implementation
const menuItems = [
  { title: "Home", icon: Home, href: "/" },
  {
    title: "Work Orders",
    icon: Clipboard,
    children: [
      { title: "All Work Orders", href: "/work-orders" },
      { title: "Upcoming", href: "/work-orders/upcoming" },
      { title: "Recurrence", href: "/work-orders/recurrence" },
      { title: "Calendar View", href: "/work-orders/calendar" },
      { title: "Asset Monitoring", href: "/work-orders/monitoring" },
    ],
  },
  { title: "Requests", icon: Send, href: "/requests" },
  { title: "Workflows", icon: GitBranch, href: "/workflows" },
  {
    title: "Inspection",
    icon: CheckSquare,
    children: [
      { title: "Templates", href: "/inspections/templates" },
      { title: "Completed", href: "/inspections/completed" },
    ],
  },
  { title: "Meters", icon: BarChart2, href: "/meters" },
  {
    title: "Parts & Inventory",
    icon: Package,
    children: [
      { title: "Area", href: "/parts/area" },
      { title: "Parts", href: "/parts/list" },
      { title: "Part Types", href: "/parts/types" },
      { title: "Vendors", href: "/parts/vendors" },
    ],
  },
  {
    title: "Assets",
    icon: Archive,
    children: [
      { title: "Assets", href: "/assets/list" },
      { title: "Asset Types", href: "/assets/types" },
    ],
  },
  { title: "Category", icon: Tag, href: "/categories" },
  {
    title: "Location & Zones",
    icon: MapPin,
    children: [
      { title: "Location", href: "/locations" },
      { title: "Zones", href: "/locations/zones" },
      { title: "Sub Zones", href: "/locations/sub-zones" },
    ],
  },
  { title: "Teams", icon: Users, href: "/teams" },
  { title: "Users", icon: User, href: "/users" },
  { title: "Otto AI", icon: MessageCircle, href: "/otto" },
  { title: "Download Centre", icon: DownloadCloud, href: "/downloads" },
  { title: "Archive", icon: Trash2, href: "/archive" },
  { title: "Subscriptions", icon: Zap, href: "/subscriptions" },
  { title: "Profile", icon: Settings, href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-deepTeal text-white flex flex-col border-r border-sageGreen/30 shadow-xl z-50">
      {/* Logo Section - Fixed Height */}
      <div className="h-[120px] shrink-0 flex items-center justify-center border-b border-sageGreen/30">
        <h1 className="text-2xl font-bold text-limeGreen tracking-wider scale-125">OPMAINT</h1>
      </div>

      {/* SCROLL FIX:
         1. Used native <div> instead of ScrollArea component to allow your CSS scrollbars to work.
         2. overflow-y-auto: Enables vertical scrolling.
         3. flex-1: Takes up remaining space.
         4. min-h-0: CRITICAL. Prevents the flex child from forcing the parent to expand beyond the screen.
      */}
      <div className="flex-1 overflow-y-auto min-h-0 py-4">
        <div className="px-3 space-y-1">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} pathname={pathname} />
          ))}
        </div>
      </div>

      {/* Support Button (Pinned to bottom) - Fixed Height */}
      <div className="p-4 border-t border-sageGreen/30 bg-deepTeal shrink-0">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-sageGreen/50 transition-colors text-white/90">
          <MessageCircle className="mr-3 h-5 w-5" />
          Support
        </button>
      </div>
    </div>
  );
}

function MenuItem({ item, pathname }: { item: any; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;
  const isChildActive = hasChildren && item.children.some((child: any) => child.href === pathname);

  if (hasChildren) {
    return (
      <Collapsible open={isOpen || isChildActive} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors group select-none",
              isChildActive ? "bg-sageGreen/40 text-limeGreen" : "hover:bg-white/5 text-white/80"
            )}
          >
            <item.icon className={cn("mr-3 h-5 w-5", isChildActive ? "text-limeGreen" : "text-white/60")} />
            <span className="flex-1 text-left">{item.title}</span>
            {isOpen || isChildActive ? (
              <ChevronDown className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronRight className="h-4 w-4 opacity-50" />
            )}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-1">
          {item.children.map((child: any, index: number) => {
             const isSubActive = child.href === pathname;
             return (
              <Link
                key={index}
                href={child.href}
                className={cn(
                  "flex items-center w-full pl-11 pr-3 py-2 text-sm rounded-md transition-colors block", 
                  isSubActive 
                    ? "bg-sageGreen text-white font-semibold" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full mr-3",
                  isSubActive ? "bg-limeGreen" : "bg-white/30"
                )} />
                {child.title}
              </Link>
             )
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
        isActive 
          ? "bg-sageGreen text-limeGreen" 
          : "text-white/80 hover:bg-white/5 hover:text-white"
      )}
    >
      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-limeGreen" : "text-white/60")} />
      {item.title}
    </Link>
  );
}