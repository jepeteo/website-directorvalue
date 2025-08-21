import { Metadata } from "next";
import {
  BarChart3,
  Users,
  Building2,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics - Admin Dashboard",
  description: "Platform analytics and insights",
};

export default function AdminAnalyticsPage() {
  // Mock analytics data - in production, this would come from your database
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      activeBusinesses: 342,
      totalReviews: 2891,
      averageRating: 4.2,
      monthlyRevenue: 15420,
      pageViews: 45692,
    },
    growth: {
      usersGrowth: 12.5,
      businessesGrowth: 8.3,
      reviewsGrowth: 15.7,
      revenueGrowth: 23.1,
    },
    topCategories: [
      { name: "Restaurants", count: 89, percentage: 26 },
      { name: "Services", count: 67, percentage: 20 },
      { name: "Retail", count: 54, percentage: 16 },
      { name: "Healthcare", count: 43, percentage: 13 },
      { name: "Education", count: 38, percentage: 11 },
    ],
    recentActivity: [
      {
        id: 1,
        type: "business_registration",
        description: "New business registered: Tech Solutions Pro",
        timestamp: "2025-08-20T14:30:00Z",
      },
      {
        id: 2,
        type: "review_submitted",
        description: "Review submitted for Café Central",
        timestamp: "2025-08-20T13:45:00Z",
      },
      {
        id: 3,
        type: "subscription_upgrade",
        description: "User upgraded to Pro plan",
        timestamp: "2025-08-20T12:15:00Z",
      },
    ],
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Platform insights and performance metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{analyticsData.growth.usersGrowth}% this month
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Businesses
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.activeBusinesses.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{analyticsData.growth.businessesGrowth}% this month
              </p>
            </div>
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalReviews.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{analyticsData.growth.reviewsGrowth}% this month
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.averageRating}
              </p>
              <p className="text-sm text-gray-500 mt-1">out of 5 stars</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{analyticsData.overview.monthlyRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{analyticsData.growth.revenueGrowth}% this month
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.pageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">this month</p>
            </div>
            <Eye className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Top Categories</h2>
          <div className="space-y-4">
            {analyticsData.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">
                    {category.count} businesses
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {category.percentage}%
                  </p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {activity.type === "business_registration" && (
                    <Building2 className="h-5 w-5 text-green-600" />
                  )}
                  {activity.type === "review_submitted" && (
                    <Star className="h-5 w-5 text-yellow-600" />
                  )}
                  {activity.type === "subscription_upgrade" && (
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
