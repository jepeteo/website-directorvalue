import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AnalyticsDashboard from "@/components/dashboard/analytics-dashboard";

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

  return <AnalyticsDashboard initialData={analyticsData} />;
}
