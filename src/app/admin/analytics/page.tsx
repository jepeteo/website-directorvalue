import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

async function getAdminAnalytics() {
  try {
    const [
      totalUsers,
      activeBusinesses,
      totalReviews,
      averageRating,
      recentUsers,
      recentBusinesses,
      recentReviews,
      categoryStats,
      userGrowthLastMonth,
      businessGrowthLastMonth,
      reviewGrowthLastMonth,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active businesses
      prisma.business.count({
        where: { status: "ACTIVE" },
      }),

      // Total reviews
      prisma.review.count(),

      // Average rating
      prisma.review.aggregate({
        _avg: { rating: true },
      }),

      // Recent users (current month)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Recent businesses (current month)
      prisma.business.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Recent reviews (current month)
      prisma.review.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }), // Category statistics
      prisma.business.groupBy({
        by: ["categoryId"],
        _count: {
          categoryId: true,
        },
        where: {
          status: "ACTIVE",
          categoryId: {
            not: null,
          },
        },
        orderBy: {
          _count: {
            categoryId: "desc",
          },
        },
        take: 5,
      }),

      // User growth last month
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Business growth last month
      prisma.business.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Review growth last month
      prisma.review.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Calculate growth percentages (current month vs last month)
    const usersGrowth =
      userGrowthLastMonth > 0
        ? Number(
            (
              ((recentUsers - userGrowthLastMonth) / userGrowthLastMonth) *
              100
            ).toFixed(2)
          )
        : recentUsers > 0
        ? 100
        : 0;

    const businessesGrowth =
      businessGrowthLastMonth > 0
        ? Number(
            (
              ((recentBusinesses - businessGrowthLastMonth) /
                businessGrowthLastMonth) *
              100
            ).toFixed(2)
          )
        : recentBusinesses > 0
        ? 100
        : 0;

    const reviewsGrowth =
      reviewGrowthLastMonth > 0
        ? Number(
            (
              ((recentReviews - reviewGrowthLastMonth) /
                reviewGrowthLastMonth) *
              100
            ).toFixed(2)
          )
        : recentReviews > 0
        ? 100
        : 0;

    // Get category names for the stats
    const categoryIds = categoryStats
      .map((stat) => stat.categoryId)
      .filter(Boolean);
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds as string[],
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topCategories = categoryStats.map((stat) => {
      const category = categories.find((cat) => cat.id === stat.categoryId);
      const percentage =
        activeBusinesses > 0
          ? Math.round((stat._count.categoryId / activeBusinesses) * 100)
          : 0;

      return {
        name: category?.name || "Unknown",
        count: stat._count.categoryId,
        percentage,
      };
    });

    return {
      overview: {
        totalUsers,
        activeBusinesses,
        totalReviews,
        averageRating: Number(averageRating._avg.rating?.toFixed(2)) || 0,
        monthlyRevenue: 0, // Will implement when Stripe integration is added
        pageViews: 0, // Will implement when analytics tracking is added
      },
      growth: {
        usersGrowth,
        businessesGrowth,
        reviewsGrowth,
        revenueGrowth: 0, // Will implement with Stripe
      },
      topCategories,
      recentCounts: {
        recentUsers,
        recentBusinesses,
        recentReviews,
      },
    };
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return {
      overview: {
        totalUsers: 0,
        activeBusinesses: 0,
        totalReviews: 0,
        averageRating: 0,
        monthlyRevenue: 0,
        pageViews: 0,
      },
      growth: {
        usersGrowth: 0,
        businessesGrowth: 0,
        reviewsGrowth: 0,
        revenueGrowth: 0,
      },
      topCategories: [],
      recentCounts: {
        recentUsers: 0,
        recentBusinesses: 0,
        recentReviews: 0,
      },
    };
  }
}

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const analyticsData = await getAdminAnalytics();

  // Get recent activity (last 10 actions)
  const recentActivity = await prisma.adminActionLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      admin: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

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
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              +{analyticsData.growth.usersGrowth}%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
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
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              +{analyticsData.growth.businessesGrowth}%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalReviews.toLocaleString()}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">
              +{analyticsData.growth.reviewsGrowth}%
            </span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.averageRating}/5
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Platform average</span>
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
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Stripe integration pending</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.pageViews.toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Analytics tracking pending</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Categories
          </h3>
          <div className="space-y-4">
            {analyticsData.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {category.count} businesses
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      by {activity.admin.name || activity.admin.email} •{" "}
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent admin activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Overview
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <p>Charts and detailed analytics coming soon</p>
            <p className="text-sm">
              Integration with analytics tracking planned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
