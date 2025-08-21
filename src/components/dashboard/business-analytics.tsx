"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingDisplay } from "@/components/ui/rating-display";
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  Star,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface BusinessAnalyticsProps {
  businessId: string;
  businessName: string;
}

interface AnalyticsData {
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    trend: number;
  };
  reviews: {
    total: number;
    thisMonth: number;
    averageRating: number;
    distribution: Array<{ rating: number; count: number }>;
  };
  leads: {
    total: number;
    thisMonth: number;
    conversion: number;
  };
  recentActivity: Array<{
    id: string;
    type: "view" | "review" | "lead";
    description: string;
    timestamp: Date;
    rating?: number;
  }>;
}

export function BusinessAnalytics({
  businessId,
  businessName,
}: BusinessAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard/analytics/${businessId}?range=${timeRange}`
        );
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessId, timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No analytics data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  const viewsTrend = formatTrend(
    analytics.views.thisMonth,
    analytics.views.lastMonth
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{businessName} Analytics</h2>
          <p className="text-gray-600">Track your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "7d" | "30d" | "90d")
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Profile Views
                </p>
                <p className="text-2xl font-bold">
                  {analytics.views.total.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {viewsTrend.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      viewsTrend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {viewsTrend.value.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
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
                <p className="text-2xl font-bold">{analytics.reviews.total}</p>
                <div className="mt-1">
                  <RatingDisplay
                    rating={analytics.reviews.averageRating}
                    showReviewCount={false}
                    size="sm"
                  />
                </div>
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
                  Leads Generated
                </p>
                <p className="text-2xl font-bold">{analytics.leads.total}</p>
                <p className="text-sm text-gray-600">
                  {analytics.leads.conversion.toFixed(1)}% conversion
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {analytics.views.thisMonth}
                </p>
                <p className="text-sm text-gray-600">
                  +{analytics.reviews.thisMonth} reviews
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.reviews.distribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <span className="w-8 text-sm">{item.rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            analytics.reviews.total > 0
                              ? (item.count / analytics.reviews.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm text-gray-600">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className="mt-1">
                        {activity.type === "view" && (
                          <Eye className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === "review" && (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === "lead" && (
                          <Users className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                        {activity.rating && (
                          <div className="mt-1">
                            <RatingDisplay
                              rating={activity.rating}
                              showReviewCount={false}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="font-semibold">
                      {analytics.views.thisMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Reviews</span>
                    <span className="font-semibold">
                      {analytics.reviews.thisMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Leads Generated
                    </span>
                    <span className="font-semibold">
                      {analytics.leads.thisMonth}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {analytics.reviews.averageRating < 4 && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-800">
                        Improve Your Rating
                      </p>
                      <p className="text-yellow-700">
                        Focus on customer service to increase your average
                        rating
                      </p>
                    </div>
                  )}
                  {analytics.reviews.total < 5 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">
                        Get More Reviews
                      </p>
                      <p className="text-blue-700">
                        Ask satisfied customers to leave reviews
                      </p>
                    </div>
                  )}
                  {analytics.views.thisMonth < analytics.views.lastMonth && (
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="font-medium text-orange-800">
                        Boost Visibility
                      </p>
                      <p className="text-orange-700">
                        Update your business information and add photos
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
