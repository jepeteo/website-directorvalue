import { NextRequest, NextResponse } from 'next/server'
import { getBusinesses, getCategories, getBusinessStats } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        const stats = await getBusinessStats()
        return NextResponse.json(stats)
      
      case 'categories':
        const categories = await getCategories()
        return NextResponse.json(categories)
      
      case 'businesses':
        const query = searchParams.get('query') || undefined
        const category = searchParams.get('category') || undefined
        const location = searchParams.get('location') || undefined
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const businessOptions: {
          category?: string;
          location?: string;
          query?: string;
          page?: number;
          limit?: number;
        } = {
          page,
          limit,
        }

        if (query !== undefined) {
          businessOptions.query = query
        }
        if (category !== undefined) {
          businessOptions.category = category
        }
        if (location !== undefined) {
          businessOptions.location = location
        }

        const result = await getBusinesses(businessOptions)
        
        return NextResponse.json(result)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: stats, categories, or businesses' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Database API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
