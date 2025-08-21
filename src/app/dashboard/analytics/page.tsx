import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AnalyticsDashboard from "@/components/dashboard/analytics-dashboard";

async function getAnalyticsData(userId: string) {
  try {
    // Get user's businesses with more detailed information
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        planType: true,
        createdAt: true,
        reviews: {
          select: {
            rating: true,
            createdAt: true,
          },
        },
        leads: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            leads: true,
          },
        },
      },
    });

    // Calculate actual review statistics
    const allReviews = businesses.flatMap((b) => b.reviews);
    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    // Calculate actual lead statistics
    const allLeads = businesses.flatMap((b) => b.leads);
    const totalLeads = allLeads.length;

    // Calculate real growth metrics based on recent data
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentReviews = allReviews.filter(
      (r) => new Date(r.createdAt) >= thirtyDaysAgo
    ).length;
    const previousReviews = allReviews.filter(
      (r) =>
        new Date(r.createdAt) >= sixtyDaysAgo &&
        new Date(r.createdAt) < thirtyDaysAgo
    ).length;

    const recentLeads = allLeads.filter(
      (l) => new Date(l.createdAt) >= thirtyDaysAgo
    ).length;
    const previousLeads = allLeads.filter(
      (l) =>
        new Date(l.createdAt) >= sixtyDaysAgo &&
        new Date(l.createdAt) < thirtyDaysAgo
    ).length;

    // Calculate growth percentages
    const reviewsGrowth =
      previousReviews > 0
        ? ((recentReviews - previousReviews) / previousReviews) * 100
        : recentReviews > 0
        ? 100
        : 0;

    const leadsGrowth =
      previousLeads > 0
        ? ((recentLeads - previousLeads) / previousLeads) * 100
        : recentLeads > 0
        ? 100
        : 0;

    // Estimate views and clicks based on business activity (more realistic than random)
    const baseViews = Math.max(totalReviews * 50, totalLeads * 20, 100); // Reviews and leads indicate visibility
    const totalViews = baseViews + Math.floor(Math.random() * 500);
    const totalClicks =
      Math.floor(totalViews * 0.05) + Math.floor(Math.random() * 20); // ~5% CTR

    const monthlyGrowth = {
      views: Number((Math.random() * 20 - 5).toFixed(2)), // Still mock as we don't track views yet
      clicks: Number((Math.random() * 15 - 2).toFixed(2)), // Still mock as we don't track clicks yet
      reviews: Number(reviewsGrowth.toFixed(2)),
      leads: Number(leadsGrowth.toFixed(2)),
    };

    // Generate recent activity with real review and lead data (last 7 days)
    const recentActivity: Array<{
      date: string;
      views: number;
      clicks: number;
      reviews: number;
      leads?: number;
    }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Count actual reviews for this date
      const dailyReviews = allReviews.filter((review) => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate.toDateString() === date.toDateString();
      }).length;

      // Count actual leads for this date
      const dailyLeads = allLeads.filter((lead) => {
        const leadDate = new Date(lead.createdAt);
        return leadDate.toDateString() === date.toDateString();
      }).length;

      recentActivity.push({
        date: date.toISOString().split("T")[0] || date.toDateString(),
        views: Math.floor(Math.random() * 80) + 20, // Mock
        clicks: Math.floor(Math.random() * 10) + 1, // Mock
        reviews: dailyReviews,
        leads: dailyLeads,
      });
    }

    return {
      totalViews,
      totalClicks,
      totalReviews,
      totalLeads,
      averageRating: Number(averageRating.toFixed(2)),
      monthlyGrowth,
      recentActivity,
      businesses: businesses.map((b) => {
        const businessData: {
          id: string;
          name: string;
          status?: string;
          planType?: string;
          reviewCount: number;
          leadCount?: number;
          averageRating: number;
          memberSince?: string;
        } = {
          id: b.id,
          name: b.name,
          reviewCount: b.reviews.length,
          averageRating:
            b.reviews.length > 0
              ? Number(
                  (
                    b.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    b.reviews.length
                  ).toFixed(2)
                )
              : 0,
        };

        if (b.status) businessData.status = b.status;
        if (b.planType) businessData.planType = b.planType;
        if (b.leads.length > 0) businessData.leadCount = b.leads.length;

        const memberSinceDate = b.createdAt.toISOString().split("T")[0];
        if (memberSinceDate) businessData.memberSince = memberSinceDate;

        return businessData;
      }),
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    // Fallback data
    return {
      totalViews: 0,
      totalClicks: 0,
      totalReviews: 0,
      totalLeads: 0,
      averageRating: 0,
      monthlyGrowth: {
        views: 0,
        clicks: 0,
        reviews: 0,
        leads: 0,
      },
      recentActivity: [],
      businesses: [],
    };
  }
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const analyticsData = await getAnalyticsData(session.user.id);

  return <AnalyticsDashboard initialData={analyticsData} />;
}
