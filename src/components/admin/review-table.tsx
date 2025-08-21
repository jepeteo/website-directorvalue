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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewActions } from "./review-actions";
import {
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface SearchParams {
  search?: string;
  rating?: string;
  status?: string;
  business?: string;
  createdAfter?: string;
  createdBefore?: string;
  page?: string;
  limit?: string;
}

interface ReviewWithRelations {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  business: {
    id: string;
    name: string;
    slug: string;
  };
}

async function getReviews(searchParams: SearchParams) {
  try {
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (searchParams.search) {
      where.OR = [
        { content: { contains: searchParams.search, mode: "insensitive" } },
        {
          user: {
            name: { contains: searchParams.search, mode: "insensitive" },
          },
        },
        {
          user: {
            email: { contains: searchParams.search, mode: "insensitive" },
          },
        },
        {
          business: {
            name: { contains: searchParams.search, mode: "insensitive" },
          },
        },
      ];
    }

    if (searchParams.rating) {
      where.rating = parseInt(searchParams.rating);
    }

    if (searchParams.status) {
      if (searchParams.status === "hidden") {
        where.isHidden = true;
      } else if (searchParams.status === "visible") {
        where.isHidden = false;
      }
    }

    if (searchParams.business) {
      where.business = {
        name: { contains: searchParams.business, mode: "insensitive" },
      };
    }

    if (searchParams.createdAfter) {
      where.createdAt = {
        ...((where.createdAt as Record<string, unknown>) || {}),
        gte: new Date(searchParams.createdAfter),
      };
    }

    if (searchParams.createdBefore) {
      where.createdAt = {
        ...((where.createdAt as Record<string, unknown>) || {}),
        lte: new Date(searchParams.createdBefore),
      };
    }

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      reviews,
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
    console.error("Error fetching reviews:", error);
    return {
      reviews: [],
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

export async function ReviewTable({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { reviews, pagination } = await getReviews(searchParams);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "HIDDEN":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Hidden
          </Badge>
        );
      case "VISIBLE":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Visible
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
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

  const truncateComment = (comment: string, maxLength: number = 100) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {reviews.length} of {pagination.totalCount} reviews
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
              <TableHead>Review</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 ? (
              reviews.map((review: ReviewWithRelations) => (
                <TableRow key={review.id}>
                  {/* Review Content */}
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">
                            {truncateComment(review.content || "")}
                          </p>
                          {(review.content || "").length > 100 && (
                            <button className="text-xs text-blue-600 hover:underline mt-1">
                              Read more
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Rating */}
                  <TableCell>{getRatingStars(review.rating)}</TableCell>

                  {/* User */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.image || undefined} />
                        <AvatarFallback className="bg-gray-100 text-xs">
                          {getUserInitials(review.user.name, review.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {review.user.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Business */}
                  <TableCell>
                    <Link
                      href={`/l/${review.business.slug}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {review.business.name}
                    </Link>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {getStatusBadge(review.isHidden ? "HIDDEN" : "VISIBLE")}
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <ReviewActions
                      reviewId={review.id}
                      isHidden={review.isHidden}
                      businessSlug={review.business.slug}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    No reviews found. Try adjusting your filters.
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
                    pathname: "/admin/reviews",
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
                    pathname: "/admin/reviews",
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
