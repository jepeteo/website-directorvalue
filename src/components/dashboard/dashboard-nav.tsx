"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  BarChart3,
  Settings,
  CreditCard,
  MessageSquare,
  PlusCircle,
  Home,
} from "lucide-react";

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Businesses",
    href: "/dashboard/businesses",
    icon: Building2,
  },
  {
    name: "Add Business",
    href: "/dashboard/businesses/new",
    icon: PlusCircle,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: MessageSquare,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
