import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getUserStats() {
  try {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      businessOwners,
      recentUsers,
      suspendedUsers,
      userGrowth,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users (placeholder - would require login tracking)
      0, // Will implement when we add user activity tracking

      // Admin users
      prisma.user.count({
        where: { role: "ADMIN" },
      }),

      // Business owners (users with businesses)
      prisma.user.count({
        where: {
          businesses: {
            some: {},
          },
        },
      }),

      // Recent users (last 7 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Suspended users (placeholder - would require user status tracking)
      0, // Will implement when we add user suspension functionality

      // User growth (last 30 days vs previous 30 days)
      Promise.all([
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]).then(([current, previous]) => {
        const growth =
          previous > 0 ? ((current - previous) / previous) * 100 : 0;
        return { current, previous, growth };
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      businessOwners,
      recentUsers,
      suspendedUsers,
      userGrowth,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      businessOwners: 0,
      recentUsers: 0,
      suspendedUsers: 0,
      userGrowth: { current: 0, previous: 0, growth: 0 },
    };
  }
}

export async function UserStats() {
  const stats = await getUserStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: `+${stats.recentUsers} this week`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: `${Math.round(
        (stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100
      )}% of total`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Business Owners",
      value: stats.businessOwners,
      change: "users with businesses",
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      change: "platform administrators",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "30-Day Growth",
      value: `${
        stats.userGrowth.growth >= 0 ? "+" : ""
      }${stats.userGrowth.growth.toFixed(1)}%`,
      change: `${stats.userGrowth.current} new users`,
      icon: TrendingUp,
      color: stats.userGrowth.growth >= 0 ? "text-green-600" : "text-red-600",
      bgColor: stats.userGrowth.growth >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Suspended Users",
      value: stats.suspendedUsers,
      change: "require attention",
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {typeof stat.value === "number" && stat.value > 999
                ? `${(stat.value / 1000).toFixed(1)}k`
                : stat.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
