import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateLeadSchema = z.object({
  status: z.enum(["NEW", "VIEWED", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED_LOST"]),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { businessId: string; leadId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, leadId } = params

    // Verify user owns this business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const { status } = updateLeadSchema.parse(body)

    // Update the lead using raw SQL for now to handle new fields
    const updatedLead = await prisma.$executeRaw`
      UPDATE "Lead" 
      SET 
        "status" = ${status}::text::"LeadStatus",
        "viewedAt" = CASE WHEN ${status} = 'VIEWED' AND "viewedAt" IS NULL THEN NOW() ELSE "viewedAt" END,
        "respondedAt" = CASE WHEN ${status} = 'CONTACTED' THEN NOW() ELSE "respondedAt" END,
        "convertedAt" = CASE WHEN ${status} = 'CONVERTED' THEN NOW() ELSE "convertedAt" END,
        "updatedAt" = NOW()
      WHERE "id" = ${leadId} AND "businessId" = ${businessId}
    `

    if (updatedLead === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error("Error updating lead:", error)
    
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

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string; leadId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, leadId } = params

    // Verify user owns this business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: session.user.id,
      },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Get the specific lead
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        businessId: businessId,
      },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Mark as viewed if it's new using raw SQL
    const leadData = lead as any
    if (leadData.status === "NEW") {
      await prisma.$executeRaw`
        UPDATE "Lead" 
        SET 
          "status" = 'VIEWED'::"LeadStatus",
          "viewedAt" = NOW(),
          "updatedAt" = NOW()
        WHERE "id" = ${leadId}
      `
      leadData.status = "VIEWED"
      leadData.viewedAt = new Date()
    }

    return NextResponse.json(leadData)
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
