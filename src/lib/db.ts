import { prisma } from '@/lib/prisma'

// Business utilities
export async function getBusinesses({
  category,
  location,
  query,
  page = 1,
  limit = 10,
}: {
  category?: string
  location?: string
  query?: string
  page?: number
  limit?: number
} = {}) {
  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: 'ACTIVE',
  }

  if (category) {
    where.category = {
      slug: category,
    }
  }

  if (location) {
    where.OR = [
      { city: { contains: location, mode: 'insensitive' } },
      { country: { contains: location, mode: 'insensitive' } },
    ]
  }

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { services: { hasSome: [query] } },
      { tags: { hasSome: [query] } },
    ]
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: [
        { planType: 'desc' }, // VIP first
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.business.count({ where }),
  ])

  // Calculate average ratings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const businessesWithRating = businesses.map((business: any) => {
    const reviews = business.reviews
    const avgRating = reviews.length > 0 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0

    return {
      ...business,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: business._count.reviews,
    }
  })

  return {
    businesses: businessesWithRating,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export async function getBusinessBySlug(slug: string) {
  const business = await prisma.business.findUnique({
    where: { slug },
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
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          isHidden: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })

  if (!business) return null

  // Calculate average rating
  const reviews = business.reviews
  const avgRating = reviews.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0

  return {
    ...business,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: business._count.reviews,
  }
}

// Category utilities
export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: {
          businesses: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return categories.map((category: any) => ({
    ...category,
    businessCount: category._count.businesses,
  }))
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          businesses: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  })
}

// Review utilities
export async function getReviewsForBusiness(businessId: string) {
  return prisma.review.findMany({
    where: {
      businessId,
      isHidden: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function createReview({
  businessId,
  userId,
  rating,
  title,
  content,
}: {
  businessId: string
  userId: string
  rating: number
  title?: string
  content?: string
}) {
  return prisma.review.create({
    data: {
      businessId,
      userId,
      rating,
      ...(title && { title }),
      ...(content && { content }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

// User utilities
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      businesses: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

// Business analytics
export async function getBusinessStats() {
  const [
    totalBusinesses,
    activeBusinesses,
    totalReviews,
    totalUsers,
    vipBusinesses,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: 'ACTIVE' } }),
    prisma.review.count(),
    prisma.user.count(),
    prisma.business.count({ where: { planType: 'VIP' } }),
  ])

  return {
    totalBusinesses,
    activeBusinesses,
    totalReviews,
    totalUsers,
    vipBusinesses,
  }
}
