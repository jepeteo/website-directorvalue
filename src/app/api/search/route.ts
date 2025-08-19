import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchBusinesses, getCategories } from '@/lib/business-service'

const searchParamsSchema = z.object({
  query: z.string().optional().nullable().transform(val => val || undefined),
  categoryId: z.string().optional().nullable().transform(val => val || undefined),
  location: z.string().optional().nullable().transform(val => val || undefined),
  sortBy: z.string().optional().nullable().transform(val => val || 'relevance').pipe(z.enum(['relevance', 'rating', 'reviews', 'newest'])),
  page: z.string().optional().nullable().transform(val => val ? parseInt(val) : 1).pipe(z.number().min(1)),
  limit: z.string().optional().nullable().transform(val => val ? parseInt(val) : 12).pipe(z.number().min(1).max(50)),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchParamsSchema.parse({
      query: searchParams.get('query'),
      categoryId: searchParams.get('categoryId'),
      location: searchParams.get('location'),
      sortBy: searchParams.get('sortBy'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    // Use real database for Phase 2
    const result = await searchBusinesses({
      query: params.query,
      categoryId: params.categoryId,
      location: params.location,
      sortBy: params.sortBy,
      page: params.page,
      limit: params.limit,
    });

    // Get categories for filters
    const categories = await getCategories();

    return NextResponse.json({
      businesses: result.businesses,
      pagination: {
        page: result.page,
        limit: params.limit,
        total: result.total,
        pages: result.pages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      },
      categories,
      filters: {
        query: params.query,
        categoryId: params.categoryId,
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
