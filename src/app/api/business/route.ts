import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().default("United States"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional().or(z.literal("")),
  hours: z.object({
    monday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    tuesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    wednesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    thursday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    friday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
  }),
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
    const validatedData = businessSchema.parse(body)

    // Create slug from business name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { slug }
    })

    let finalSlug = slug
    if (existingBusiness) {
      // Append a number to make it unique
      const count = await prisma.business.count({
        where: {
          slug: {
            startsWith: slug
          }
        }
      })
      finalSlug = `${slug}-${count + 1}`
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: getCategoryName(validatedData.categoryId) }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: getCategoryName(validatedData.categoryId),
          slug: getCategoryName(validatedData.categoryId)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        }
      })
    }

    // Create the business
    const business = await prisma.business.create({
      data: {
        name: validatedData.name,
        slug: finalSlug,
        description: validatedData.description,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        country: validatedData.country,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        website: validatedData.website || null,
        hours: validatedData.hours,
        categoryId: category.id,
        ownerId: token.sub!,
        status: "PENDING", // Requires admin approval
        isActive: false,
      },
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(business)
  } catch (error) {
    console.error("Business registration error:", error)
    
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

function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    "1": "Restaurants & Food",
    "2": "Health & Medical",
    "3": "Professional Services",
    "4": "Retail & Shopping",
    "5": "Automotive",
    "6": "Home & Garden",
    "7": "Beauty & Wellness",
    "8": "Education",
    "9": "Entertainment",
    "10": "Technology",
  }
  
  return categories[categoryId] || "Other"
}
