import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

interface PrismaOrderBy {
  averageRating?: 'asc' | 'desc';
  totalReviews?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  planType?: 'asc' | 'desc';
  [key: string]: 'asc' | 'desc' | undefined;
}

const searchParamsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  openNow: z.coerce.boolean().optional(),
  tags: z.string().optional(), // Comma-separated tags
  sortBy: z.enum(['relevance', 'rating', 'reviews', 'newest', 'vip']).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchParamsSchema.parse({
      query: searchParams.get('query'),
      category: searchParams.get('category'),
      location: searchParams.get('location'),
      country: searchParams.get('country'),
      city: searchParams.get('city'),
      minRating: searchParams.get('minRating'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      openNow: searchParams.get('openNow'),
      tags: searchParams.get('tags'),
      sortBy: searchParams.get('sortBy'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const offset = (params.page - 1) * params.limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      status: 'ACTIVE',
    }

    // Text search in name and description
    if (params.query) {
      where.OR = [
        { name: { contains: params.query, mode: 'insensitive' } },
        { description: { contains: params.query, mode: 'insensitive' } },
        { services: { contains: params.query, mode: 'insensitive' } },
      ]
    }

    // Category filter
    if (params.category) {
      where.category = { equals: params.category, mode: 'insensitive' }
    }

    // Location filters
    if (params.location) {
      where.OR = where.OR || []
      ;(where.OR as Array<Record<string, unknown>>).push(
        { country: { contains: params.location, mode: 'insensitive' } },
        { city: { contains: params.location, mode: 'insensitive' } },
        { address: { contains: params.location, mode: 'insensitive' } }
      )
    }

    if (params.country) {
      where.country = { equals: params.country, mode: 'insensitive' }
    }

    if (params.city) {
      where.city = { equals: params.city, mode: 'insensitive' }
    }

    // Rating filter (only include businesses with rating >= minRating)
    if (params.minRating) {
      where.averageRating = { gte: params.minRating }
    }

    // Price range filters
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.priceRange = {}
      if (params.minPrice !== undefined) {
        where.priceRange.gte = params.minPrice
      }
      if (params.maxPrice !== undefined) {
        where.priceRange.lte = params.maxPrice
      }
    }

    // Tags filter (if any of the provided tags match)
    if (params.tags) {
      const tagArray = params.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      if (tagArray.length > 0) {
        where.tags = {
          hasSome: tagArray
        }
      }
    }

    // Open now filter (basic implementation - would need working hours data)
    if (params.openNow) {
      // For now, we'll assume businesses with workingHours data are "open"
      // In a real implementation, you'd check actual hours against current time
      where.workingHours = { not: null }
    }

    // Build orderBy clause
    let orderBy: PrismaOrderBy[] = []

    switch (params.sortBy) {
      case 'rating':
        orderBy = [
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
        ]
        break
      case 'reviews':
        orderBy = [
          { totalReviews: 'desc' },
          { averageRating: 'desc' },
        ]
        break
      case 'newest':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'vip':
        orderBy = [
          { planType: 'desc' }, // VIP > PRO > BASIC > TRIAL
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
        ]
        break
      case 'relevance':
      default:
        // For relevance, we'll boost VIP, then by rating and reviews
        orderBy = [
          { planType: 'desc' },
          { averageRating: 'desc' },
          { totalReviews: 'desc' },
          { createdAt: 'desc' },
        ]
        break
    }

    // Execute search query
    const [businesses, totalCount] = await Promise.all([
      prisma.business.findMany({
        where,
        orderBy,
        skip: offset,
        take: params.limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: true,
          addressLine1: true,
          city: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          logo: true,
          planType: true,
          tags: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.business.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / params.limit)

    return NextResponse.json({
      businesses,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalCount,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1,
      },
      filters: {
        query: params.query,
        category: params.category,
        location: params.location,
        country: params.country,
        city: params.city,
        minRating: params.minRating,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        openNow: params.openNow,
        tags: params.tags,
        sortBy: params.sortBy,
      },
    })
  } catch (error) {
    console.error('Search API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
