import { Suspense } from "react";
import { UserTable } from "@/components/admin/user-table";
import { UserFilters } from "@/components/admin/user-filters";
import { UserStats } from "@/components/admin/user-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, UserPlus } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  search?: string;
  role?: string;
  status?: string;
  joinedAfter?: string;
  joinedBefore?: string;
  page?: string;
  limit?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage users, roles, and permissions across the platform
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
          <Button asChild>
            <Link href="/admin/users/invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Link>
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <UserStats />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters />
        </CardContent>
      </Card>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading users...</div>}>
            <UserTable searchParams={resolvedSearchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
