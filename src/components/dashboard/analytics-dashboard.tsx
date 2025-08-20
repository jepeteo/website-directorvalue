"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Star,
  MessageSquare,
  Download,
} from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalReviews: number;
  averageRating: number;
  monthlyGrowth: {
    views: number;
    clicks: number;
    reviews: number;
  };
  recentActivity: Array<{
    date: string;
    views: number;
    clicks: number;
    reviews: number;
  }>;
}

interface AnalyticsDashboardProps {
  initialData: AnalyticsData;
}

export default function AnalyticsDashboard({
  initialData,
}: AnalyticsDashboardProps) {
  const [data, setData] = useState(initialData);
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<
    "views" | "clicks" | "reviews"
  >("views");

  const handleTimeRangeChange = async (range: string) => {
    setIsLoading(true);
    setTimeRange(range);

    // Simulate API call
    setTimeout(() => {
      // Mock data changes based on time range
      const multiplier = range === "30d" ? 1.5 : range === "90d" ? 2.2 : 1;
      setData({
        ...data,
        totalViews: Math.floor(data.totalViews * multiplier),
        totalClicks: Math.floor(data.totalClicks * multiplier),
        totalReviews: Math.floor(data.totalReviews * multiplier),
      });
      setIsLoading(false);
    }, 500);
  };

  const handleExportData = () => {
    const exportData = {
      timeRange,
      data,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your business performance and customer engagement
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`bg-card rounded-lg border p-6 cursor-pointer transition-all ${
            selectedMetric === "views"
              ? "ring-2 ring-blue-500"
              : "hover:shadow-md"
          }`}
          onClick={() => setSelectedMetric("views")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Views
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : data.totalViews.toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+{data.monthlyGrowth.views}%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div
          className={`bg-card rounded-lg border p-6 cursor-pointer transition-all ${
            selectedMetric === "clicks"
              ? "ring-2 ring-green-500"
              : "hover:shadow-md"
          }`}
          onClick={() => setSelectedMetric("clicks")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Clicks
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : data.totalClicks}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">
              +{data.monthlyGrowth.clicks}%
            </span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div
          className={`bg-card rounded-lg border p-6 cursor-pointer transition-all ${
            selectedMetric === "reviews"
              ? "ring-2 ring-purple-500"
              : "hover:shadow-md"
          }`}
          onClick={() => setSelectedMetric("reviews")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </p>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : data.totalReviews}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">
              +{data.monthlyGrowth.reviews}%
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
              <p className="text-2xl font-bold">{data.averageRating}/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.floor(data.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <span className="text-sm text-muted-foreground">
              (Showing {selectedMetric})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedMetric("views")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMetric === "views"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setSelectedMetric("clicks")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMetric === "clicks"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Clicks
            </button>
            <button
              onClick={() => setSelectedMetric("reviews")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMetric === "reviews"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>Date</div>
            <div>Views</div>
            <div>Clicks</div>
            <div>Reviews</div>
          </div>

          {data.recentActivity.map((day, index) => {
            const maxValue = Math.max(
              ...data.recentActivity.map((d) => d[selectedMetric])
            );
            const currentValue = day[selectedMetric];
            const percentage =
              maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

            return (
              <div
                key={index}
                className={`grid grid-cols-4 gap-4 text-sm py-2 border-b border-border/50 transition-all hover:bg-muted/50 rounded px-2 ${
                  selectedMetric === "views" &&
                  "hover:bg-blue-50 dark:hover:bg-blue-950/30"
                } ${
                  selectedMetric === "clicks" &&
                  "hover:bg-green-50 dark:hover:bg-green-950/30"
                } ${
                  selectedMetric === "reviews" &&
                  "hover:bg-purple-50 dark:hover:bg-purple-950/30"
                }`}
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
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          selectedMetric === "views"
                            ? percentage
                            : (day.views / 70) * 100
                        }%`,
                      }}
                    />
                  </div>
                  {day.views}
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-green-100 dark:bg-green-900/30 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          selectedMetric === "clicks"
                            ? percentage
                            : (day.clicks / 10) * 100
                        }%`,
                      }}
                    />
                  </div>
                  {day.clicks}
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-purple-100 dark:bg-purple-900/30 rounded-full h-2 mr-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          selectedMetric === "reviews"
                            ? percentage
                            : (day.reviews / 3) * 100
                        }%`,
                      }}
                    />
                  </div>
                  {day.reviews}
                </div>
              </div>
            );
          })}
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
