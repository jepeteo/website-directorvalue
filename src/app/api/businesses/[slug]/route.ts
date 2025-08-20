import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const business = await prisma.business.findUnique({
      where: { 
        slug,
        status: "ACTIVE", // Only show active businesses
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          where: { isHidden: false },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: {
              where: { isHidden: false },
            },
          },
        },
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = business.reviews.length > 0
      ? business.reviews.reduce((sum, review) => sum + review.rating, 0) / business.reviews.length
      : 0

    // Calculate rating distribution
    const ratingDistribution = {
      1: business.reviews.filter(r => r.rating === 1).length,
      2: business.reviews.filter(r => r.rating === 2).length,
      3: business.reviews.filter(r => r.rating === 3).length,
      4: business.reviews.filter(r => r.rating === 4).length,
      5: business.reviews.filter(r => r.rating === 5).length,
    }

    const businessWithStats = {
      ...business,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: business._count.reviews,
      ratingDistribution,
      _count: undefined,
    }

    return NextResponse.json(businessWithStats)
  } catch (error) {
    console.error("Error fetching business:", error)
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    )
  }
}
