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
import { prisma } from "@/lib/prisma";

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
import {
  Building2,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  TrendingUp,
  Users,
  Crown,
  Star,
  Shield,
} from "lucide-react";

// Component for Visitor Dashboard
function VisitorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Director Value
          </h1>
          <p className="text-muted-foreground">
            Start by writing reviews or upgrade to become a business owner
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Write Reviews Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Write Reviews
            </CardTitle>
            <CardDescription>
              Help other customers by sharing your experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your honest reviews about businesses you&apos;ve visited
                or used.
              </p>
              <Button asChild className="w-full">
                <Link href="/search">Find Businesses to Review</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Card */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Crown className="h-5 w-5" />
              Become a Business Owner
            </CardTitle>
            <CardDescription className="text-amber-700">
              List your business and start getting customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="text-sm space-y-2 text-amber-800">
                <li>• List your business</li>
                <li>• Get customer reviews</li>
                <li>• Manage inquiries</li>
                <li>• Access analytics</li>
              </ul>
              <Button
                asChild
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Link href="/pricing">View Plans & Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Reviews</CardTitle>
          <CardDescription>
            Reviews you&apos;ve written recently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <Button asChild className="mt-4">
              <Link href="/search">Write Your First Review</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for Admin Dashboard
async function AdminDashboard() {
  // Get admin stats
  const [totalUsers, totalBusinesses, pendingReviews] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.review.count({ where: { isHidden: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and management tools
          </p>
        </div>
        <Button asChild>
          <Link href="/admin">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBusinesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reviews
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/businesses">
                <Building2 className="h-4 w-4 mr-2" />
                Manage Businesses
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/reviews">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Management
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Service</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment System</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  // For development, use a mock user ID
  const userId = session?.user?.id || "mock-user-1";
  const userRole =
    (
      session?.user as {
        role?:
          | "VISITOR"
          | "BUSINESS_OWNER"
          | "ADMIN"
          | "MODERATOR"
          | "FINANCE"
          | "SUPPORT";
      }
    )?.role || "VISITOR";

  // Route based on user role
  if (
    userRole === "ADMIN" ||
    userRole === "MODERATOR" ||
    userRole === "FINANCE" ||
    userRole === "SUPPORT"
  ) {
    return <AdminDashboard />;
  }

  if (userRole === "VISITOR") {
    return <VisitorDashboard />;
  }

  // Business Owner Dashboard (existing logic)
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
            Welcome back! Here&apos;s what&apos;s happening with your
            businesses.
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
                        (sum: number, b: BusinessWithRating) => sum + b.rating,
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
                  {businesses
                    .slice(0, 3)
                    .map((business: BusinessWithRating) => (
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
                            {business.reviewCount} reviews • {business.rating}
                            /5.0 rating
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
                  <Link href="/dashboard/leads">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Leads
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
