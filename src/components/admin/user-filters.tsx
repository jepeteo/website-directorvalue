"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Calendar } from "lucide-react";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [joinedAfter, setJoinedAfter] = useState(
    searchParams.get("joinedAfter") || ""
  );
  const [joinedBefore, setJoinedBefore] = useState(
    searchParams.get("joinedBefore") || ""
  );

  const updateFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    if (joinedAfter) params.set("joinedAfter", joinedAfter);
    if (joinedBefore) params.set("joinedBefore", joinedBefore);
    params.set("page", "1"); // Reset to first page

    router.push(`/admin/users?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setJoinedAfter("");
    setJoinedBefore("");
    router.push("/admin/users");
  };

  const hasActiveFilters =
    search || role || status || joinedAfter || joinedBefore;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={role || "all"}
            onValueChange={(value) => setRole(value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="VISITOR">Visitor</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email Verification Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Email Status</Label>
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Joined After */}
        <div className="space-y-2">
          <Label htmlFor="joinedAfter">Joined After</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="joinedAfter"
              type="date"
              value={joinedAfter}
              onChange={(e) => setJoinedAfter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Joined Before */}
        <div className="space-y-2">
          <Label htmlFor="joinedBefore">Joined Before</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="joinedBefore"
              type="date"
              value={joinedBefore}
              onChange={(e) => setJoinedBefore(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button onClick={updateFilters}>Apply Filters</Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
