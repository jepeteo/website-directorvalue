import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Star,
  MessageSquare,
} from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Mock data - in production, this would come from your database
  const analyticsData = {
    totalViews: 1247,
    totalClicks: 89,
    totalReviews: 23,
    averageRating: 4.2,
    monthlyGrowth: {
      views: 12.5,
      clicks: 8.3,
      reviews: 15.2,
    },
    recentActivity: [
      { date: "2025-08-19", views: 45, clicks: 3, reviews: 1 },
      { date: "2025-08-18", views: 52, clicks: 4, reviews: 0 },
      { date: "2025-08-17", views: 38, clicks: 2, reviews: 2 },
      { date: "2025-08-16", views: 61, clicks: 6, reviews: 1 },
      { date: "2025-08-15", views: 43, clicks: 3, reviews: 0 },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your business performance and customer engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold">
                {analyticsData.totalViews.toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">
              +{analyticsData.monthlyGrowth.views}%
            </span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Clicks
              </p>
              <p className="text-2xl font-bold">{analyticsData.totalClicks}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">
              +{analyticsData.monthlyGrowth.clicks}%
            </span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </p>
              <p className="text-2xl font-bold">{analyticsData.totalReviews}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">
              +{analyticsData.monthlyGrowth.reviews}%
            </span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <p className="text-2xl font-bold">
                {analyticsData.averageRating}/5
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(analyticsData.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>Date</div>
            <div>Views</div>
            <div>Clicks</div>
            <div>Reviews</div>
          </div>

          {analyticsData.recentActivity.map((day, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-border/50"
            >
              <div className="font-medium">
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <div className="w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(day.views / 70) * 100}%` }}
                  />
                </div>
                {day.views}
              </div>
              <div className="flex items-center">
                <div className="w-16 bg-green-100 dark:bg-green-900/30 rounded-full h-2 mr-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(day.clicks / 10) * 100}%` }}
                  />
                </div>
                {day.clicks}
              </div>
              <div className="flex items-center">
                <div className="w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full h-2 mr-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(day.reviews / 3) * 100}%` }}
                  />
                </div>
                {day.reviews}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Get More Detailed Analytics
        </h3>
        <p className="text-blue-700 dark:text-blue-200 mb-4">
          Upgrade to Pro or VIP to access advanced analytics, conversion
          tracking, and detailed customer insights.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
