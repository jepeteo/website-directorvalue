import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { z } from "zod"
import { createReview } from "@/lib/business-service"

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
      comment: validatedData.comment,
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

// Reviews are now loaded with business data in business-service.ts
// This GET endpoint is kept for potential future use
export async function GET() {
  return NextResponse.json(
    { message: "Reviews are loaded with business data" },
    { status: 200 }
  );
}
