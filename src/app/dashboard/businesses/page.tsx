import { auth } from "@/lib/auth";
import { getBusinessesByOwner } from "@/lib/business-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Plus, Star, MessageSquare, Eye, Edit } from "lucide-react";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  createdAt: Date;
  rating?: number;
  reviewCount?: number;
  category?: {
    name: string;
  } | null;
  _count?: {
    reviews: number;
  };
}

export default async function BusinessesPage() {
  const session = await auth();

  // For development, use a mock user ID
  const userId = session?.user?.id || "mock-user-1";

  try {
    const businesses = await getBusinessesByOwner(userId);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Businesses</h1>
            <p className="text-muted-foreground">
              Manage all your business listings
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/businesses/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>

        {/* Businesses Grid */}
        {businesses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business: BusinessData) => (
              <Card key={business.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {business.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {business.description || "No description provided"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Badge
                        variant={
                          business.status === "ACTIVE" ? "default" : "secondary"
                        }
                      >
                        {business.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Plan Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <Badge variant="outline">{business.planType}</Badge>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Category
                    </span>
                    <span className="text-sm font-medium">
                      {business.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-yellow-500 mb-1">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {business.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center text-blue-500 mb-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {business.reviewCount || 0}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-500 mb-1">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/l/${business.slug}`}>View Public</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/dashboard/businesses/${business.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No businesses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven&apos;t created any business listings yet. Get
                  started by adding your first business to the directory.
                </p>
                <Button asChild>
                  <Link href="/dashboard/businesses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Business
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading businesses:", error);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Businesses</h1>
          <p className="text-muted-foreground">
            Manage all your business listings
          </p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Error loading businesses
              </h3>
              <p className="text-muted-foreground mb-6">
                There was an issue loading your business listings. Please try
                again.
              </p>
              <Button asChild>
                <Link href="/dashboard/businesses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Business
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
