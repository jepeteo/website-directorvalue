import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId } = params
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30d"

    // Verify business ownership
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found or access denied" }, { status: 404 })
    }

    // Calculate date ranges
    const now = new Date()
    const getDaysAgo = (days: number) => {
      const date = new Date(now)
      date.setDate(date.getDate() - days)
      return date
    }

    let daysBack = 30
    if (range === "7d") daysBack = 7
    else if (range === "90d") daysBack = 90

    const rangeStart = getDaysAgo(daysBack)
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get review statistics
    const [
      totalReviews,
      thisMonthReviews,
      reviewStats,
      reviewDistribution,
      recentReviews,
    ] = await Promise.all([
      // Total reviews
      prisma.review.count({
        where: {
          businessId,
          isHidden: false,
        },
      }),

      // This month reviews
      prisma.review.count({
        where: {
          businessId,
          isHidden: false,
          createdAt: {
            gte: thisMonthStart,
          },
        },
      }),

      // Average rating
      prisma.review.aggregate({
        where: {
          businessId,
          isHidden: false,
        },
        _avg: {
          rating: true,
        },
      }),

      // Rating distribution
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          businessId,
          isHidden: false,
        },
        _count: {
          rating: true,
        },
        orderBy: {
          rating: 'desc',
        },
      }),

      // Recent reviews for activity feed
      prisma.review.findMany({
        where: {
          businessId,
          isHidden: false,
          createdAt: {
            gte: getDaysAgo(30),
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ])

    // Format rating distribution
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const found = reviewDistribution.find(item => item.rating === rating)
      return {
        rating,
        count: found?._count.rating || 0,
      }
    })

    // Mock data for views and leads (to be replaced with real analytics later)
    const mockViews = {
      total: Math.floor(Math.random() * 1000) + 100,
      thisMonth: Math.floor(Math.random() * 100) + 20,
      lastMonth: Math.floor(Math.random() * 80) + 15,
      trend: Math.floor(Math.random() * 40) - 20, // -20 to +20
    }

    const mockLeads = {
      total: Math.floor(Math.random() * 50) + 5,
      thisMonth: Math.floor(Math.random() * 10) + 1,
      conversion: Math.random() * 15 + 5, // 5-20%
    }

    // Format recent activity
    const recentActivity: Array<{
      id: string
      type: "view" | "review" | "lead"
      description: string
      timestamp: Date
      rating?: number
    }> = recentReviews.map(review => ({
      id: review.id,
      type: "review",
      description: `New ${review.rating}-star review from ${review.user.name || "Anonymous"}`,
      timestamp: review.createdAt,
      rating: review.rating,
    }))

    // Add some mock view activities
    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 7) + 1
      recentActivity.push({
        id: `view-${i}`,
        type: "view",
        description: `Business profile viewed`,
        timestamp: getDaysAgo(daysAgo),
      })
    }

    // Sort by timestamp
    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const analytics = {
      views: mockViews,
      reviews: {
        total: totalReviews,
        thisMonth: thisMonthReviews,
        averageRating: reviewStats._avg.rating || 0,
        distribution,
      },
      leads: mockLeads,
      recentActivity: recentActivity.slice(0, 10),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
