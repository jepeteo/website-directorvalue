import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeBusinessCount = searchParams.get("includeCount") === "true"

    const categories = await prisma.category.findMany({
      include: {
        children: {
          orderBy: { sortOrder: "asc" },
          ...(includeBusinessCount && {
            include: {
              _count: {
                select: {
                  businesses: {
                    where: { status: "ACTIVE" },
                  },
                },
              },
            },
          }),
        },
        ...(includeBusinessCount && {
          _count: {
            select: {
              businesses: {
                where: { status: "ACTIVE" },
              },
            },
          },
        }),
      },
      where: {
        parentId: null, // Only root categories
      },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
