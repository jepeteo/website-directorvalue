import { auth } from "@/lib/auth";
import {
  getBusinessesByOwner,
  getOwnerDashboardStats,
} from "@/lib/business-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAnalytics } from "@/components/dashboard/business-analytics";
import { BusinessReviews } from "@/components/dashboard/business-reviews";
import { RatingDisplay } from "@/components/ui/rating-display";
import {
  Building2,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  TrendingUp,
  Settings,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

interface BusinessWithRating {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  createdAt: Date;
  rating: number;
  reviewCount: number;
  category?: {
    name: string;
  } | null;
}

export default async function DashboardPage() {
  const session = await auth();

  // For development, use a mock user ID
  const userId = session?.user?.id || "mock-user-1";

  try {
    const [stats, businesses] = await Promise.all([
      getOwnerDashboardStats(userId),
      getBusinessesByOwner(userId),
    ]);

    // Select the first business for detailed analytics
    const selectedBusiness = businesses[0];

    return (
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Dashboard</h1>
            <p className="text-gray-600">
              Manage your businesses and track performance
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/businesses/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Businesses
                  </p>
                  <p className="text-2xl font-bold">{stats.totalBusinesses}</p>
                  <p className="text-sm text-gray-500">
                    {stats.activeBusinesses} active
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  <p className="text-sm text-gray-500">From all businesses</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Profile Views
                  </p>
                  <p className="text-2xl font-bold">{stats.totalViews || 0}</p>
                  <p className="text-sm text-gray-500">Across all listings</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Performance
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalReviews > 0 ? "Good" : "New"}
                  </p>
                  <p className="text-sm text-gray-500">Overall rating</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business List or Detailed View */}
        {businesses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Businesses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first business listing to the
                directory.
              </p>
              <Button asChild>
                <Link href="/dashboard/businesses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Business
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : businesses.length === 1 ? (
          // Single business - show detailed analytics
          selectedBusiness ? (
            <Tabs defaultValue="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedBusiness.planType}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/l/${selectedBusiness.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Live
                    </Link>
                  </Button>
                </div>
              </div>

              <TabsContent value="analytics">
                <BusinessAnalytics
                  businessId={selectedBusiness.id}
                  businessName={selectedBusiness.name}
                />
              </TabsContent>

              <TabsContent value="reviews">
                <BusinessReviews businessId={selectedBusiness.id} />
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                    <CardDescription>
                      Manage your business information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button asChild>
                        <Link
                          href={`/dashboard/businesses/${selectedBusiness.id}/edit`}
                        >
                          Edit Business Information
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/pricing">Upgrade Plan</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div>Business not found</div>
          )
        ) : (
          // Multiple businesses - show overview list
          <Card>
            <CardHeader>
              <CardTitle>Your Businesses</CardTitle>
              <CardDescription>
                Manage all your business listings from one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businesses.map((business: BusinessWithRating) => (
                  <div
                    key={business.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{business.name}</h3>
                        <Badge
                          variant={
                            business.status === "ACTIVE"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {business.status}
                        </Badge>
                        <Badge variant="outline">{business.planType}</Badge>
                      </div>

                      {business.category && (
                        <p className="text-sm text-gray-600 mb-2">
                          {business.category.name}
                        </p>
                      )}

                      {business.reviewCount > 0 && (
                        <RatingDisplay
                          rating={business.rating}
                          totalReviews={business.reviewCount}
                          size="sm"
                        />
                      )}

                      {business.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {business.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/l/${business.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/businesses/${business.id}`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re having trouble loading your dashboard. Please try
              again.
            </p>
            <Button asChild>
              <Link href="/dashboard">Refresh</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
