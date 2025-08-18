import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

interface PrismaOrderBy {
  createdAt?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  planType?: 'asc' | 'desc';
  [key: string]: 'asc' | 'desc' | undefined;
}

const searchParamsSchema = z.object({
  query: z.string().optional().nullable().transform(val => val || undefined),
  category: z.string().optional().nullable().transform(val => val || undefined),
  location: z.string().optional().nullable().transform(val => val || undefined),
  country: z.string().optional().nullable().transform(val => val || undefined),
  city: z.string().optional().nullable().transform(val => val || undefined),
  minRating: z.string().optional().nullable().transform(val => val ? parseFloat(val) : undefined).pipe(z.number().min(1).max(5).optional()),
  minPrice: z.string().optional().nullable().transform(val => val ? parseFloat(val) : undefined).pipe(z.number().min(0).optional()),
  maxPrice: z.string().optional().nullable().transform(val => val ? parseFloat(val) : undefined).pipe(z.number().min(0).optional()),
  openNow: z.string().optional().nullable().transform(val => val === 'true'),
  tags: z.string().optional().nullable().transform(val => val || undefined), // Comma-separated tags
  sortBy: z.string().optional().nullable().transform(val => val || 'relevance').pipe(z.enum(['relevance', 'rating', 'reviews', 'newest', 'vip'])),
  page: z.string().optional().nullable().transform(val => val ? parseInt(val) : 1).pipe(z.number().min(1)),
  limit: z.string().optional().nullable().transform(val => val ? parseInt(val) : 12).pipe(z.number().min(1).max(50)),
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
      where.category = { 
        name: { equals: params.category, mode: 'insensitive' }
      }
    }

    // Location filters
    if (params.location) {
      where.OR = where.OR || []
      ;(where.OR as Array<Record<string, unknown>>).push(
        { country: { contains: params.location, mode: 'insensitive' } },
        { city: { contains: params.location, mode: 'insensitive' } },
        { addressLine1: { contains: params.location, mode: 'insensitive' } }
      )
    }

    if (params.country) {
      where.country = { equals: params.country, mode: 'insensitive' }
    }

    if (params.city) {
      where.city = { equals: params.city, mode: 'insensitive' }
    }

    // Rating filter - remove this since we don't have averageRating field
    // TODO: Calculate rating from reviews if needed
    // if (params.minRating) {
    //   where.averageRating = { gte: params.minRating }
    // }

    // Price range filters - remove this since we don't have priceRange field
    // TODO: Add priceRange field to schema if needed
    // if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    //   where.priceRange = {}
    //   if (params.minPrice !== undefined) {
    //     where.priceRange.gte = params.minPrice
    //   }
    //   if (params.maxPrice !== undefined) {
    //     where.priceRange.lte = params.maxPrice
    //   }
    // }

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
        // TODO: Add rating calculation from reviews
        orderBy = [
          { createdAt: 'desc' },
        ]
        break
      case 'reviews':
        // TODO: Add review count from reviews relation
        orderBy = [
          { createdAt: 'desc' },
        ]
        break
      case 'newest':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'vip':
        orderBy = [
          { planType: 'desc' }, // VIP > PRO > BASIC > TRIAL
          { createdAt: 'desc' },
        ]
        break
      case 'relevance':
      default:
        // For relevance, we'll boost VIP, then by creation date
        orderBy = [
          { planType: 'desc' },
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
          category: {
            select: {
              id: true,
              name: true,
            },
          },
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
          _count: {
            select: {
              reviews: true,
            },
          },
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
