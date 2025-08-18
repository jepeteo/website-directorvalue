"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building2,
  Users,
  MessageSquare,
  Settings,
  Home,
  Search,
  Flag,
  CreditCard,
  TrendingUp,
  Shield,
  FileText,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Overview and key metrics",
  },
  {
    name: "Businesses",
    href: "/admin/businesses",
    icon: Building2,
    description: "Manage business listings",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "User management and roles",
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
    description: "Review moderation",
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: Flag,
    description: "Abuse reports and flags",
  },
  {
    name: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
    description: "Subscriptions and payments",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
    description: "Platform analytics",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration",
  },
];

const quickActions = [
  {
    name: "View Site",
    href: "/",
    icon: Home,
    description: "Visit public site",
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
    description: "Search businesses",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white shadow-sm border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            {!collapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
                <p className="text-xs text-gray-500">Director Value</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={collapsed ? item.description : undefined}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {!collapsed && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div className="pt-6">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="mt-2 space-y-1">
                {quickActions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <item.icon className="flex-shrink-0 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                    <span className="ml-3 truncate">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Collapse Toggle */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
          >
            <svg
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-180" : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {!collapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
