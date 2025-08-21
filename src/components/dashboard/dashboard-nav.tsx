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
  Users,
  Star,
  Crown,
  Shield,
} from "lucide-react";

type UserRole =
  | "VISITOR"
  | "BUSINESS_OWNER"
  | "ADMIN"
  | "MODERATOR"
  | "FINANCE"
  | "SUPPORT";
type PlanType = "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  plans?: PlanType[]; // For business owners, restrict by plan
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
    roles: [
      "VISITOR",
      "BUSINESS_OWNER",
      "ADMIN",
      "MODERATOR",
      "FINANCE",
      "SUPPORT",
    ],
  },
  // Visitor-specific items
  {
    name: "Write Reviews",
    href: "/dashboard/reviews",
    icon: Star,
    roles: ["VISITOR"],
    description: "Write and manage your reviews",
  },
  {
    name: "Upgrade Plan",
    href: "/pricing",
    icon: Crown,
    roles: ["VISITOR"],
    description: "Become a business owner",
  },
  // Business Owner items
  {
    name: "My Businesses",
    href: "/dashboard/businesses",
    icon: Building2,
    roles: ["BUSINESS_OWNER", "ADMIN"],
  },
  {
    name: "Add Business",
    href: "/dashboard/businesses/new",
    icon: PlusCircle,
    roles: ["BUSINESS_OWNER", "ADMIN"],
    plans: ["VIP"], // Only VIP can add multiple businesses
  },
  {
    name: "Leads",
    href: "/dashboard/leads",
    icon: Users,
    roles: ["BUSINESS_OWNER", "ADMIN"],
    plans: ["VIP"], // Only VIP gets lead management
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["BUSINESS_OWNER", "ADMIN"],
    plans: ["PRO", "VIP"], // PRO and VIP get analytics
  },
  {
    name: "Reviews",
    href: "/dashboard/reviews",
    icon: MessageSquare,
    roles: ["BUSINESS_OWNER", "ADMIN"],
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    roles: ["BUSINESS_OWNER", "ADMIN"],
  },
  // Admin items
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["ADMIN", "MODERATOR", "FINANCE", "SUPPORT"],
  },
  // Common items
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: [
      "VISITOR",
      "BUSINESS_OWNER",
      "ADMIN",
      "MODERATOR",
      "FINANCE",
      "SUPPORT",
    ],
  },
];

interface DashboardNavProps {
  userRole?: UserRole;
  userPlan?: PlanType;
}

export function DashboardNav({
  userRole = "VISITOR",
  userPlan = "FREE_TRIAL",
}: DashboardNavProps) {
  const pathname = usePathname();

  // Filter navigation items based on user role and plan
  const visibleItems = navigationItems.filter((item) => {
    // Check if user role is allowed
    if (!item.roles.includes(userRole)) {
      return false;
    }

    // For business owners, check plan restrictions
    if (userRole === "BUSINESS_OWNER" && item.plans) {
      return item.plans.includes(userPlan);
    }

    return true;
  });

  return (
    <nav className="flex flex-col space-y-1">
      {visibleItems.map((item) => {
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
            title={item.description}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        );
      })}

      {/* Plan upgrade hints for business owners */}
      {userRole === "BUSINESS_OWNER" &&
        (userPlan === "FREE_TRIAL" ||
          userPlan === "BASIC" ||
          userPlan === "PRO") && (
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {userPlan === "FREE_TRIAL"
                  ? "Upgrade to unlock"
                  : "Upgrade for more"}
              </span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              {userPlan === "FREE_TRIAL" && (
                <>
                  <p>• Analytics dashboard (PRO €12.99)</p>
                  <p>• Lead management (VIP €19.99)</p>
                  <p>• Multiple businesses (VIP €19.99)</p>
                </>
              )}
              {userPlan === "BASIC" && (
                <>
                  <p>• Analytics dashboard (PRO €12.99)</p>
                  <p>• Lead management (VIP €19.99)</p>
                  <p>• Multiple businesses (VIP €19.99)</p>
                </>
              )}
              {userPlan === "PRO" && (
                <>
                  <p>• Lead management (VIP €19.99)</p>
                  <p>• Multiple businesses (VIP €19.99)</p>
                  <p>• Priority placement</p>
                </>
              )}
            </div>
            <Link
              href="/pricing"
              className="inline-block mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}
    </nav>
  );
}
