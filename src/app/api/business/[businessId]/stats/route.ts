import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params

    // Get review statistics
    const reviewStats = await prisma.review.aggregate({
      where: {
        businessId,
        isHidden: false, // Only count visible reviews
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    })

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
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
    })

    // Format the distribution into a more usable structure
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const found = ratingDistribution.find(item => item.rating === rating)
      return {
        rating,
        count: found?._count.rating || 0,
      }
    })

    return NextResponse.json({
      averageRating: reviewStats._avg.rating || 0,
      totalReviews: reviewStats._count.id || 0,
      distribution,
    })
  } catch (error) {
    console.error("Error fetching business statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch business statistics" },
      { status: 500 }
    )
  }
}
