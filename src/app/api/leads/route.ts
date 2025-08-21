import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  businessId: z.string(),
  source: z.string().default("contact_form"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLeadSchema.parse(body)

    // Verify business exists and is active
    const business = await prisma.business.findFirst({
      where: {
        id: validatedData.businessId,
        status: "ACTIVE",
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found or inactive" },
        { status: 404 }
      )
    }

    // Determine lead priority based on business plan and content
    let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
    
    if (business.planType === "VIP") {
      priority = "HIGH"
    } else if (business.planType === "PRO") {
      priority = "MEDIUM"
    }

    // Check for urgent keywords in message
    const urgentKeywords = ["urgent", "asap", "immediately", "emergency", "rush"]
    if (urgentKeywords.some(keyword => 
      validatedData.message.toLowerCase().includes(keyword)
    )) {
      priority = "URGENT"
    }

    // Create the lead
    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        message: validatedData.message,
        businessId: validatedData.businessId,
        source: validatedData.source,
        budget: validatedData.budget || null,
        timeline: validatedData.timeline || null,
        location: validatedData.location || null,
        priority,
        status: "NEW",
      },
      include: {
        business: {
          select: {
            name: true,
            planType: true,
          },
        },
      },
    })

    // TODO: Send email notification to business owner
    // For VIP plans, we should send immediate notifications
    // For other plans, we can batch notifications

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: "Lead submitted successfully",
      responseTime: business.planType === "VIP" ? "4 hours" : "24 hours",
    })
  } catch (error) {
    console.error("Error creating lead:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      )
    }

    // Get lead statistics for the business
    const [totalLeads, newLeads, convertedLeads, recentLeads] = await Promise.all([
      prisma.lead.count({
        where: { businessId },
      }),
      prisma.lead.count({
        where: {
          businessId,
          status: "NEW",
        },
      }),
      prisma.lead.count({
        where: {
          businessId,
          status: "CONVERTED",
        },
      }),
      prisma.lead.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      }),
    ])

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    return NextResponse.json({
      stats: {
        total: totalLeads,
        new: newLeads,
        converted: convertedLeads,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
      recentLeads,
    })
  } catch (error) {
    console.error("Error fetching lead stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch lead statistics" },
      { status: 500 }
    )
  }
}
