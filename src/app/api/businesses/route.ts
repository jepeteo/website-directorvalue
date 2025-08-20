import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Schema for business search/filtering
const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  plan: z.enum(["BASIC", "PRO", "VIP"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchSchema.parse({
      q: searchParams.get("q"),
      category: searchParams.get("category"),
      location: searchParams.get("location"),
      status: searchParams.get("status"),
      plan: searchParams.get("plan"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    })

    const { q, category, location, status, plan, page, limit } = params
    const skip = (page - 1) * limit

    // Build where conditions
    const where: any = {}

    // Only show active businesses for public API (unless status filter is specified)
    if (!status) {
      where.status = "ACTIVE"
    } else {
      where.status = status
    }

    // Search query
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { addressLine1: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ]
    }

    // Category filter
    if (category) {
      where.category = { slug: category }
    }

    // Location filter
    if (location) {
      where.OR = [
        { addressLine1: { contains: location, mode: "insensitive" } },
        { city: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
      ]
    }

    // Plan filter
    if (plan) {
      where.planType = plan
    }

    // Get businesses with related data
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
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
            select: {
              id: true,
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: {
                where: { isHidden: false },
              },
            },
          },
        },
        orderBy: [
          { planType: "desc" }, // VIP first, then PRO, then BASIC
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.business.count({ where }),
    ])

    // Calculate average ratings
    const businessesWithRatings = businesses.map((business: any) => {
      const avgRating = business.reviews.length > 0
        ? business.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / business.reviews.length
        : 0

      return {
        ...business,
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: business._count.reviews,
        reviews: undefined, // Remove reviews array, keep only count and average
        _count: undefined,
      }
    })

    return NextResponse.json({
      businesses: businessesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching businesses:", error)
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    )
  }
}

// Schema for creating/updating businesses
const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("France"),
  phone: z.string().optional(),
  email: z.string().email("Valid email is required"),
  website: z.string().url("Valid website URL is required").optional(),
  categoryId: z.string().uuid("Valid category ID is required"),
  planType: z.enum(["FREE_TRIAL", "BASIC", "PRO", "VIP"]).default("FREE_TRIAL"),
  ownerId: z.string().uuid("Valid owner ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = businessSchema.parse(body)

    // Check if slug is unique
    const existingBusiness = await prisma.business.findUnique({
      where: { slug: data.slug },
    })

    if (existingBusiness) {
      return NextResponse.json(
        { error: "A business with this slug already exists" },
        { status: 400 }
      )
    }

    // Create business (status defaults to PENDING for approval)
    const business = await prisma.business.create({
      data: {
        ...data,
        status: "PENDING", // All new businesses need approval
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
      },
    })

    return NextResponse.json(business, { status: 201 })
  } catch (error) {
    console.error("Error creating business:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    )
  }
}
