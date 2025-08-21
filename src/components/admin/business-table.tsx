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
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface BusinessWithStats {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  logo: string | null;
  city: string | null;
  country: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  status: string;
  planType: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    reviews: number;
  };
  reviews: {
    rating: number;
  }[];
}

interface SearchParams {
  search?: string;
  status?: string;
  plan?: string;
  category?: string;
  page?: string;
  limit?: string;
}

async function getBusinesses(searchParams: SearchParams) {
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
        { description: { contains: searchParams.search, mode: "insensitive" } },
      ];
    }

    if (searchParams.status) {
      where.status = searchParams.status;
    }

    if (searchParams.plan) {
      where.planType = searchParams.plan;
    }

    if (searchParams.category) {
      where.category = { equals: searchParams.category, mode: "insensitive" };
    }

    const [businesses, totalCount] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          phone: true,
          category: true,
          city: true,
          country: true,
          status: true,
          planType: true,
          logo: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              reviews: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.business.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      businesses,
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
    console.error("Error fetching businesses:", error);
    return {
      businesses: [],
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

export async function BusinessTable({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { businesses, pagination } = await getBusinesses(searchParams);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case "VIP":
        return <Badge className="bg-yellow-500 text-white">VIP</Badge>;
      case "PRO":
        return <Badge className="bg-blue-500 text-white">Pro</Badge>;
      case "BASIC":
        return <Badge variant="outline">Basic</Badge>;
      case "FREE_TRIAL":
        return <Badge variant="secondary">Trial</Badge>;
      default:
        return <Badge variant="secondary">{planType}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {businesses.length} of {pagination.totalCount} businesses
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
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.length > 0 ? (
              businesses.map((business: BusinessWithStats) => (
                <TableRow key={business.id}>
                  {/* Business Info */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={business.logo || undefined} />
                        <AvatarFallback className="bg-gray-100">
                          {business.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {business.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {business.category?.name || "Uncategorized"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">{business.email}</div>
                      {business.phone && (
                        <div className="text-gray-500">{business.phone}</div>
                      )}
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {[business.city, business.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(business.status)}</TableCell>

                  {/* Plan */}
                  <TableCell>{getPlanBadge(business.planType)}</TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {business.reviews.length > 0
                          ? (
                              business.reviews.reduce(
                                (sum, review) => sum + review.rating,
                                0
                              ) / business.reviews.length
                            ).toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({business._count.reviews})
                      </span>
                    </div>
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString()}
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
                          <Link href={`/admin/businesses/${business.id}`}>
                            <Building2 className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/l/${business.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View Public
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/businesses/${business.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">
                    No businesses found. Try adjusting your filters.
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
                    pathname: "/admin/businesses",
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
                    pathname: "/admin/businesses",
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
