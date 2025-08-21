import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId } = await params

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

    // Get leads for this business
    const leads = await prisma.lead.findMany({
      where: {
        businessId,
      },
      orderBy: [
        { createdAt: "desc" },
      ],
    })

    // Calculate basic stats
    const stats = {
      total: leads.length,
      new: leads.filter((lead: { status: string }) => lead.status === "NEW").length,
      viewed: leads.filter((lead: { status: string }) => lead.status === "VIEWED").length,
      contacted: leads.filter((lead: { status: string }) => lead.status === "CONTACTED").length,
      qualified: leads.filter((lead: { status: string }) => lead.status === "QUALIFIED").length,
      converted: leads.filter((lead: { status: string }) => lead.status === "CONVERTED").length,
      closedLost: leads.filter((lead: { status: string }) => lead.status === "CLOSED_LOST").length,
      conversionRate: leads.length > 0 
        ? Math.round((leads.filter((lead: { status: string }) => lead.status === "CONVERTED").length / leads.length) * 100)
        : 0,
    }

    // Group leads by status
    const leadsByStatus = {
      new: leads.filter((lead: { status: string }) => lead.status === "NEW"),
      viewed: leads.filter((lead: { status: string }) => lead.status === "VIEWED"),
      contacted: leads.filter((lead: { status: string }) => lead.status === "CONTACTED"),
      qualified: leads.filter((lead: { status: string }) => lead.status === "QUALIFIED"),
      converted: leads.filter((lead: { status: string }) => lead.status === "CONVERTED"),
      closedLost: leads.filter((lead: { status: string }) => lead.status === "CLOSED_LOST"),
    }

    // Recent activity for dashboard
    const recentLeads = leads.slice(0, 5)

    return NextResponse.json({
      leads,
      stats,
      leadsByStatus,
      recentLeads,
    })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
