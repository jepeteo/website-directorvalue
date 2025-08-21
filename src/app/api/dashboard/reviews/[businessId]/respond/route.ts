import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const responseSchema = z.object({
  reviewId: z.string(),
  response: z.string().min(1).max(1000),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId } = await params

    const body = await request.json()
    const { reviewId, response: responseContent } = responseSchema.parse(body)

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

    // Verify the review belongs to this business
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        businessId,
      },
      include: {
        ownerResponse: true,
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.ownerResponse) {
      return NextResponse.json({ error: "Response already exists for this review" }, { status: 400 })
    }

    // Create the owner response
    const ownerResponse = await prisma.reviewResponse.create({
      data: {
        content: responseContent,
        reviewId,
        ownerId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      response: ownerResponse,
    })
  } catch (error) {
    console.error("Error creating review response:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    )
  }
}
