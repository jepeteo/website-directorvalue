import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { z } from "zod"
import { createReview } from "@/lib/business-service"
import { prisma } from "@/lib/prisma"

const reviewSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment must be less than 1000 characters"),
  title: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication (optional for reviews - can be anonymous)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // Parse and validate request body
    const body = await req.json()
    const validatedData = reviewSchema.parse(body)

    // Create the review using business service
    const review = await createReview({
      businessId: validatedData.businessId,
      userId: token?.sub,
      rating: validatedData.rating,
      content: validatedData.comment,
      title: validatedData.title,
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully and is pending approval",
      reviewId: review.id,
    });
  } catch (error) {
    console.error("Review creation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Get reviews for the business
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: {
          businessId,
          isHidden: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          businessId,
          isHidden: false,
        },
      }),
    ])

    const totalPages = Math.ceil(totalReviews / limit)

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
