import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId } = await params

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

    // Fetch reviews for this business (including hidden ones for owner to see)
    const reviews = await prisma.review.findMany({
      where: {
        businessId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        ownerResponse: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching business reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
