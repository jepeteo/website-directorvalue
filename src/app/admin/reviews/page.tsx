import { Suspense } from "react";
import { ReviewTable } from "@/components/admin/review-table";
import { ReviewFilters } from "@/components/admin/review-filters";
import { ReviewStats } from "@/components/admin/review-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

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

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Review Moderation
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and moderate customer reviews
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Bulk Flag
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<ReviewStatsSkeleton />}>
        <ReviewStats />
      </Suspense>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Filters */}
            <ReviewFilters />

            {/* Table */}
            <Suspense fallback={<ReviewTableSkeleton />}>
              <ReviewTable searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeletons
function ReviewStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReviewTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-100 h-16 w-full rounded"
        ></div>
      ))}
    </div>
  );
}
