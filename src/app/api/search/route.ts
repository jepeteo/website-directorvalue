import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchSampleBusinesses, getSampleCategories } from '@/lib/sample-data'

const searchParamsSchema = z.object({
  query: z.string().optional().nullable().transform(val => val || undefined),
  category: z.string().optional().nullable().transform(val => val || undefined),
  location: z.string().optional().nullable().transform(val => val || undefined),
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
      sortBy: searchParams.get('sortBy'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    // Use sample data for Phase 1 MVP
    const businesses = searchSampleBusinesses(
      params.query || '',
      params.category,
      params.location
    )

    // Apply sorting - create a sorted copy
    const sortedBusinesses = [...businesses];
    switch (params.sortBy) {
      case 'rating':
        sortedBusinesses.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        break
      case 'reviews':
        sortedBusinesses.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
      case 'vip':
        sortedBusinesses.sort((a, b) => {
          if (a.planType === 'VIP' && b.planType !== 'VIP') return -1
          if (a.planType !== 'VIP' && b.planType === 'VIP') return 1
          return (b.averageRating || 0) - (a.averageRating || 0)
        })
        break
      case 'newest':
        // For sample data, we'll just reverse the order
        sortedBusinesses.reverse()
        break
      default: // relevance
        // VIP businesses first, then by rating
        sortedBusinesses.sort((a, b) => {
          if (a.planType === 'VIP' && b.planType !== 'VIP') return -1
          if (a.planType !== 'VIP' && b.planType === 'VIP') return 1
          return (b.averageRating || 0) - (a.averageRating || 0)
        })
        break
    }

    // Pagination
    const totalCount = sortedBusinesses.length
    const offset = (params.page - 1) * params.limit
    const paginatedBusinesses = sortedBusinesses.slice(offset, offset + params.limit)

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / params.limit)
    const hasNextPage = params.page < totalPages
    const hasPrevPage = params.page > 1

    // Get categories for filters
    const categories = getSampleCategories()

    return NextResponse.json({
      businesses: paginatedBusinesses,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      categories,
      filters: {
        query: params.query,
        category: params.category,
        location: params.location,
        sortBy: params.sortBy,
      }
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
