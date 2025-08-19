import { auth } from "@/lib/auth";
import {
  getOwnerDashboardStats,
  getBusinessesByOwner,
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
import Link from "next/link";
import {
  Building2,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  // For development, use a mock user ID
  const userId = session?.user?.id || "mock-user-1";

  try {
    const [stats, businesses] = await Promise.all([
      getOwnerDashboardStats(userId),
      getBusinessesByOwner(userId),
    ]);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your businesses.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Businesses
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeBusinesses} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                Across all businesses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businesses.length > 0
                  ? (
                      businesses.reduce(
                        (sum: number, b: any) => sum + b.rating,
                        0
                      ) / businesses.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all businesses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Businesses */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Businesses</CardTitle>
                  <CardDescription>
                    Manage your business listings
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/dashboard/businesses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {businesses.length > 0 ? (
                <div className="space-y-4">
                  {businesses.slice(0, 3).map((business: any) => (
                    <div
                      key={business.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{business.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
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
                        <p className="text-sm text-muted-foreground mt-1">
                          {business.reviewCount} reviews • {business.rating}/5.0
                          rating
                        </p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/businesses/${business.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {businesses.length > 3 && (
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/businesses">
                        View All Businesses
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No businesses yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first business listing to get started.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/businesses/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Business
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and useful links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/businesses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Business
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/reviews">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Manage Reviews
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/pricing">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your business dashboard.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Create your first business listing to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Welcome to Director Value
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your business to our directory.
              </p>
              <Button asChild>
                <Link href="/dashboard/businesses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your Business
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
