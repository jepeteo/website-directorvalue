import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment must be less than 1000 characters"),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = reviewSchema.parse(body)

    // Check if business exists and is active
    const business = await prisma.business.findUnique({
      where: {
        id: validatedData.businessId,
        status: "ACTIVE"
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    // Check if user already reviewed this business
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: token.sub!,
        businessId: validatedData.businessId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this business" },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: validatedData.rating,
        content: validatedData.comment,
        userId: token.sub!,
        businessId: validatedData.businessId,
        isHidden: false, // Auto-approve for now, can add moderation later
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    return NextResponse.json(review)
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get("businessId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        businessId,
        isHidden: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: limit
    })

    const totalReviews = await prisma.review.count({
      where: {
        businessId,
        isHidden: false
      }
    })

    const totalPages = Math.ceil(totalReviews / limit)

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error("Reviews fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
