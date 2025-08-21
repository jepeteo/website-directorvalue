import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateReviewSchema = z.object({
  isHidden: z.boolean().optional(),
  adminNote: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    // Check for admin role or development mode
    const isDevelopment = process.env.NODE_ENV === "development"
    if (!session?.user && !isDevelopment) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session?.user?.role !== "ADMIN" && !isDevelopment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateReviewSchema.parse(body)

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: validatedData,
      include: {
        business: {
          select: {
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Log admin action
    if (session?.user?.id) {
      await prisma.adminActionLog.create({
        data: {
          adminId: session.user.id,
          action: validatedData.isHidden ? "REVIEW_HIDE" : "REVIEW_SHOW",
          targetType: "REVIEW",
          targetId: id,
          details: {
            previousState: { isHidden: !validatedData.isHidden },
            newState: validatedData,
            adminNote: validatedData.adminNote,
          },
        },
      })
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    // Check for admin role or development mode
    const isDevelopment = process.env.NODE_ENV === "development"
    if (!session?.user && !isDevelopment) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session?.user?.role !== "ADMIN" && !isDevelopment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get review details for logging
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        business: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    })

    // Log admin action
    if (session?.user?.id) {
      await prisma.adminActionLog.create({
        data: {
          adminId: session.user.id,
          action: "REVIEW_DELETE",
          targetType: "REVIEW",
          targetId: id,
          details: {
            deletedReview: {
              businessName: review.business.name,
              userName: review.user.name || review.user.email,
              rating: review.rating,
              content: review.content,
            },
          },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}