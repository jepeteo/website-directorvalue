import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's businesses
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        reviews: {
          select: {
            rating: true,
            createdAt: true,
          },
        },
      },
    });

    // Calculate actual review statistics
    const allReviews = businesses.flatMap(b => b.reviews);
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Mock views and clicks for now (in production, these would come from analytics service)
    const totalViews = Math.floor(Math.random() * 2000) + 500;
    const totalClicks = Math.floor(Math.random() * 200) + 50;

    // Calculate growth metrics (mock for now)
    const monthlyGrowth = {
      views: (Math.random() * 20) - 5, // -5% to +15%
      clicks: (Math.random() * 15) - 2, // -2% to +13%
      reviews: totalReviews > 0 ? (Math.random() * 25) : 0, // 0% to +25%
    };

    // Generate recent activity (last 7 days)
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Count actual reviews for this date
      const dailyReviews = allReviews.filter(review => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate.toDateString() === date.toDateString();
      }).length;

      recentActivity.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 80) + 20, // Mock
        clicks: Math.floor(Math.random() * 10) + 1, // Mock
        reviews: dailyReviews,
      });
    }

    const analyticsData = {
      totalViews,
      totalClicks,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      monthlyGrowth: {
        views: Number(monthlyGrowth.views.toFixed(1)),
        clicks: Number(monthlyGrowth.clicks.toFixed(1)),
        reviews: Number(monthlyGrowth.reviews.toFixed(1)),
      },
      recentActivity,
      businesses: businesses.map(b => ({
        id: b.id,
        name: b.name,
        reviewCount: b.reviews.length,
        averageRating: b.reviews.length > 0 
          ? Number((b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length).toFixed(1))
          : 0,
      })),
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
