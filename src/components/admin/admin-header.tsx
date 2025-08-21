"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Shield,
  HelpCircle,
  Home,
  LayoutDashboard,
} from "lucide-react";

interface AdminHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState(0); // Real notification count will be implemented

  // TODO: Implement real notification system
  useEffect(() => {
    // Placeholder for future notification fetching
    // This will be replaced with actual API call to get admin notifications
    setNotifications(0);
  }, []);

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email
    ? user.email[0]?.toUpperCase() || "A"
    : "A";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Title & Navigation */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <span>|</span>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Main Site
            </Link>
            <span>•</span>
            <Link
              href="/dashboard"
              className="hover:text-blue-600 transition-colors"
            >
              User Dashboard
            </Link>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-2 h-10"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:flex items-center space-x-2">
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 leading-none mb-0">
                      {user.name || user.email}
                    </p>
                  </div>
                  <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-green-700 uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Main Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  User Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onSelect={async (event) => {
                  event.preventDefault();
                  try {
                    await signOut({
                      callbackUrl: "/",
                      redirect: true,
                    });
                  } catch (error) {
                    console.error("Admin sign out error:", error);
                  }
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
