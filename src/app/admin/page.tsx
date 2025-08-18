import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
  Flag,
  Activity,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getDashboardStats() {
  try {
    const [
      totalBusinesses,
      activeBusinesses,
      totalUsers,
      totalReviews,
      averageRating,
      pendingReports,
      recentBusinesses,
      recentUsers,
      recentReviews,
    ] = await Promise.all([
      // Total businesses
      prisma.business.count(),
      
      // Active businesses
      prisma.business.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total reviews
      prisma.review.count(),
      
      // Average rating across all businesses
      prisma.business.aggregate({
        _avg: { averageRating: true }
      }),
      
      // Pending abuse reports (mock for now)
      0, // Will implement when we add abuse reports
      
      // Recent businesses (last 7 days)
      prisma.business.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Recent users (last 7 days)  
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Recent reviews (last 7 days)
      prisma.review.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
    ]);

    return {
      totalBusinesses,
      activeBusinesses,
      totalUsers,
      totalReviews,
      averageRating: averageRating._avg.averageRating || 0,
      pendingReports,
      recentBusinesses,
      recentUsers,
      recentReviews,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalBusinesses: 0,
      activeBusinesses: 0,
      totalUsers: 0,
      totalReviews: 0,
      averageRating: 0,
      pendingReports: 0,
      recentBusinesses: 0,
      recentUsers: 0,
      recentReviews: 0,
    };
  }
}

async function getRecentActivity() {
  try {
    // Get recent businesses, users, and reviews for activity feed
    const [businesses, users, reviews] = await Promise.all([
      prisma.business.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          status: true,
          planType: true,
        }
      }),
      
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
        }
      }),
      
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: { name: true }
          },
          user: {
            select: { name: true, email: true }
          }
        }
      }),
    ]);

    return { businesses, users, reviews };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { businesses: [], users: [], reviews: [] };
  }
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  const statCards = [
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      change: `+${stats.recentBusinesses} this week`,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Businesses", 
      value: stats.activeBusinesses,
      change: `${Math.round((stats.activeBusinesses / Math.max(stats.totalBusinesses, 1)) * 100)}% active`,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: `+${stats.recentUsers} this week`,
      icon: Users,
      color: "text-purple-600", 
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      change: `+${stats.recentReviews} this week`,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      change: "across all businesses",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      change: "require attention",
      icon: Flag,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening on Director Value.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/search">
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/businesses">
              <Building2 className="h-4 w-4 mr-2" />
              Manage Businesses
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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
                {typeof stat.value === 'number' && stat.value > 999 
                  ? `${(stat.value / 1000).toFixed(1)}k`
                  : stat.value
                }
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Businesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Recent Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.businesses.length > 0 ? (
                activity.businesses.map((business: any) => (
                  <div key={business.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {business.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(business.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={business.status === 'ACTIVE' ? 'default' : 'secondary'}
                      >
                        {business.status}
                      </Badge>
                      <Badge variant="outline">
                        {business.planType}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent businesses
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/businesses">View All Businesses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.reviews.length > 0 ? (
                activity.reviews.map((review: any) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {review.business.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {review.user.name || review.user.email}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-600 truncate">
                        "{review.comment}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent reviews
                </p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/reviews">View All Reviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/businesses/new">
                <Building2 className="h-4 w-4 mr-2" />
                Add Business
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/reviews">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Queue
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
