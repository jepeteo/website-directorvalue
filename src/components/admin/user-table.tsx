import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Edit,
  Shield,
  UserX,
  UserCheck,
  Mail,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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

interface UserWithCounts {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  _count: {
    businesses: number;
    reviews: number;
  };
}

async function getUsers(searchParams: SearchParams) {
  try {
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (searchParams.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: "insensitive" } },
        { email: { contains: searchParams.search, mode: "insensitive" } },
      ];
    }

    if (searchParams.role) {
      where.role = searchParams.role;
    }

    if (searchParams.status === "verified") {
      where.emailVerified = { not: null };
    } else if (searchParams.status === "unverified") {
      where.emailVerified = null;
    }

    if (searchParams.joinedAfter) {
      where.createdAt = {
        ...((where.createdAt as Record<string, unknown>) || {}),
        gte: new Date(searchParams.joinedAfter),
      };
    }

    if (searchParams.joinedBefore) {
      where.createdAt = {
        ...((where.createdAt as Record<string, unknown>) || {}),
        lte: new Date(searchParams.joinedBefore),
      };
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              businesses: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function UserTable({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { users, pagination } = await getUsers(searchParams);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-100 text-red-800">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "BUSINESS_OWNER":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Building2 className="h-3 w-3 mr-1" />
            Business Owner
          </Badge>
        );
      case "USER":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <UserCheck className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="destructive">
            <UserX className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      case "VISITOR":
        return <Badge variant="secondary">Visitor</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getEmailStatusBadge = (emailVerified: Date | null) => {
    if (emailVerified) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };

  const getUserInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return email[0]?.toUpperCase() || "U";
  };

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {users.length} of {pagination.totalCount} users
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user: UserWithCounts) => (
                <TableRow key={user.id}>
                  {/* User Info */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-gray-100">
                          {getUserInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>{getRoleBadge(user.role)}</TableCell>

                  {/* Email Status */}
                  <TableCell>
                    {getEmailStatusBadge(user.emailVerified)}
                  </TableCell>

                  {/* Activity */}
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">
                            {user._count.businesses}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">
                            {user._count.reviews}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Joined */}
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  {/* Registration Date */}
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.role !== "SUSPENDED" ? (
                          <DropdownMenuItem className="text-orange-600">
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Restore User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    No users found. Try adjusting your filters.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              asChild={pagination.hasPrev}
            >
              {pagination.hasPrev ? (
                <Link
                  href={{
                    pathname: "/admin/users",
                    query: { ...searchParams, page: pagination.page - 1 },
                  }}
                >
                  Previous
                </Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              asChild={pagination.hasNext}
            >
              {pagination.hasNext ? (
                <Link
                  href={{
                    pathname: "/admin/users",
                    query: { ...searchParams, page: pagination.page + 1 },
                  }}
                >
                  Next
                </Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
