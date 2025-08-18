import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Star,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getReviewStats() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalReviews,
      pendingReviews,
      approvedReviews,
      flaggedReviews,
      averageRating,
      recentReviews,
      previousReviews,
      ratingDistribution,
    ] = await Promise.all([
      // Total reviews
      prisma.review.count(),

      // Pending reviews (using a placeholder approach since we don't have status)
      0, // Will implement when we add review moderation status

      // Approved reviews (visible reviews)
      prisma.review.count({
        where: { isHidden: false },
      }),

      // Flagged reviews (hidden reviews)
      prisma.review.count({
        where: { isHidden: true },
      }),

      // Average rating
      prisma.review.aggregate({
        _avg: { rating: true },
        where: { isHidden: false },
      }),

      // Recent reviews (last 30 days)
      prisma.review.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Previous 30 days reviews
      prisma.review.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),

      // Rating distribution
      prisma.$queryRaw<{ rating: number; count: bigint }[]>`
        SELECT rating, COUNT(*) as count
        FROM "Review"
        WHERE "isHidden" = false
        GROUP BY rating
        ORDER BY rating DESC
      `,
    ]);

    // Calculate growth percentage
    const growthPercentage =
      previousReviews > 0
        ? ((recentReviews - previousReviews) / previousReviews) * 100
        : recentReviews > 0
        ? 100
        : 0;

    return {
      totalReviews,
      pendingReviews,
      approvedReviews,
      flaggedReviews,
      averageRating: averageRating._avg.rating || 0,
      recentReviews,
      growthPercentage,
      ratingDistribution: ratingDistribution.map(
        (item: { rating: number; count: bigint }) => ({
          rating: item.rating,
          count: Number(item.count),
        })
      ),
    };
  } catch (error) {
    console.error("Error fetching review stats:", error);
    return {
      totalReviews: 0,
      pendingReviews: 0,
      approvedReviews: 0,
      flaggedReviews: 0,
      averageRating: 0,
      recentReviews: 0,
      growthPercentage: 0,
      ratingDistribution: [],
    };
  }
}

export async function ReviewStats() {
  const stats = await getReviewStats();

  const statCards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      description: `${stats.recentReviews} in last 30 days`,
      icon: MessageSquare,
      trend: stats.growthPercentage >= 0 ? "up" : "down",
      trendValue: `${Math.abs(stats.growthPercentage).toFixed(1)}%`,
      color: "bg-blue-500",
    },
    {
      title: "Pending Review",
      value: stats.pendingReviews.toLocaleString(),
      description: "Awaiting moderation",
      icon: Clock,
      urgent: stats.pendingReviews > 10,
      color: "bg-orange-500",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      description: "From approved reviews",
      icon: Star,
      color: "bg-yellow-500",
    },
    {
      title: "Flagged Reviews",
      value: stats.flaggedReviews.toLocaleString(),
      description: "Require attention",
      icon: AlertTriangle,
      urgent: stats.flaggedReviews > 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className={stat.urgent ? "border-red-200 bg-red-50" : ""}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                <IconComponent
                  className={`h-4 w-4 ${stat.color.replace("bg-", "text-")}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                {stat.trend && (
                  <div
                    className={`flex items-center ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{stat.trendValue}</span>
                  </div>
                )}
                <span>{stat.description}</span>
              </div>
              {stat.urgent && (
                <div className="mt-2 text-xs text-red-600 font-medium flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
