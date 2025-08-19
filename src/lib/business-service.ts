import { prisma } from './prisma';

// Type definitions matching actual Prisma schema
export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  logo?: string | null;
  images: string[];
  services: string[];
  tags: string[];
  workingHours?: Record<string, { open: string; close: string }> | null;
  planType: 'FREE_TRIAL' | 'BASIC' | 'PRO' | 'VIP';
  status: 'DRAFT' | 'ACTIVE' | 'DEACTIVATED' | 'SUSPENDED';
  ownerId: string;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  isHidden: boolean;
  businessId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'VISITOR' | 'BUSINESS_OWNER' | 'ADMIN' | 'MODERATOR' | 'FINANCE' | 'SUPPORT';
  createdAt: Date;
  updatedAt: Date;
}

// Extended types with calculated fields
export interface BusinessWithRating extends Business {
  rating: number;
  reviewCount: number;
}

export type BusinessWithCategory = BusinessWithRating & {
  category: Category | null;
};

export type BusinessWithExtras = BusinessWithRating & {
  category: Category | null;
  reviews: Array<Review & { user: User | null }>;
  owner?: User | null;
};

export type ReviewWithUser = Review & {
  user: User | null;
};

// Prisma result types
type PrismaBusinessWithReviews = {
  reviews: { rating: number }[];
  category: Category | null;
  [key: string]: unknown;
};

// Search and filter functions
export async function searchBusinesses({
  query,
  categoryId,
  location,
  sortBy = 'relevance',
  page = 1,
  limit = 12,
}: {
  query?: string;
  categoryId?: string;
  location?: string;
  sortBy?: 'relevance' | 'rating' | 'newest' | 'reviews';
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  // Build where conditions
  const where: Record<string, unknown> = {
    status: 'ACTIVE',
  };

  const andConditions: Record<string, unknown>[] = [];

  if (query) {
    andConditions.push({
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { hasSome: [query] } },
        { tags: { hasSome: [query] } },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (location) {
    andConditions.push({
      OR: [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } },
      ],
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Build orderBy - we'll calculate ratings in memory since they're not stored
  let orderBy: Record<string, string>[];
  switch (sortBy) {
    case 'newest':
      orderBy = [{ createdAt: 'desc' }];
      break;
    case 'rating':
    case 'reviews':
    case 'relevance':
    default:
      // For relevance, prioritize VIP plans and then by created date
      orderBy = [
        { planType: 'desc' }, // VIP first
        { createdAt: 'desc' },
      ];
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
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

  // Calculate ratings for each business since they're not stored
  const businessesWithRatings = businesses.map((business: PrismaBusinessWithReviews) => {
    const reviews = business.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviewCount 
      : 0;

    return {
      ...business,
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount,
    };
  });

  // Sort by rating if requested (since we calculated it in memory)
  if (sortBy === 'rating') {
    businessesWithRatings.sort((a: any, b: any) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    businessesWithRatings.sort((a: any, b: any) => b.reviewCount - a.reviewCount);
  }

  return {
    businesses: businessesWithRatings as any,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

// Get business by slug
export async function getBusinessBySlug(slug: string): Promise<BusinessWithExtras | null> {
  const business = await prisma.business.findUnique({
    where: { slug, status: 'ACTIVE' },
    include: {
      category: true,
      reviews: {
        where: { isHidden: false },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!business) return null;

  // Calculate rating and review count
  const reviews = business.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviewCount 
    : 0;

  return {
    ...business,
    rating: Math.round(averageRating * 10) / 10,
    reviewCount,
  } as any;
}

// Get businesses by category
export async function getBusinessesByCategory({
  categorySlug,
  page = 1,
  limit = 12,
  sortBy = 'relevance',
}: {
  categorySlug: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'rating' | 'newest' | 'reviews';
}) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return null;
  }

  const result = await searchBusinesses({
    categoryId: category.id,
    page,
    limit,
    sortBy,
  });

  return {
    ...result,
    category,
  };
}

export type CategoryWithCount = Category & {
  _count: {
    businesses: number;
  };
};

// Get all categories
export async function getCategories(): Promise<CategoryWithCount[]> {
  return prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: {
          businesses: {
            where: { status: 'ACTIVE' },
          },
        },
      },
    },
  });
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          businesses: {
            where: { status: 'ACTIVE' },
          },
        },
      },
    },
  });
}

// Get featured businesses (VIP plan)
export async function getFeaturedBusinesses(limit = 6) {
  const businesses = await prisma.business.findMany({
    where: {
      status: 'ACTIVE',
      planType: 'VIP',
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  // Calculate ratings
  return businesses.map((business: PrismaBusinessWithReviews) => {
    const reviews = business.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviewCount 
      : 0;

    return {
      ...business,
      rating: Math.round(averageRating * 10) / 10,
      reviewCount,
    };
  }) as any;
}

// Create review
export async function createReview({
  businessId,
  userId,
  rating,
  content,
  title,
}: {
  businessId: string;
  userId?: string;
  rating: number;
  content: string;
  title?: string;
}) {
  if (!userId) {
    throw new Error('User ID is required to create a review');
  }

  const review = await prisma.review.create({
    data: {
      businessId,
      userId,
      rating,
      content,
      title,
      isHidden: false, // Reviews are visible by default, can be hidden by admin
    },
  });

  return review;
}

// Report abuse
export async function reportAbuse({
  type,
  reason,
  reporterId,
  businessId,
  reviewId,
}: {
  type: 'SPAM' | 'INAPPROPRIATE_CONTENT' | 'FAKE_REVIEW' | 'HARASSMENT' | 'COPYRIGHT' | 'OTHER';
  reason: string;
  reporterId: string;
  businessId?: string;
  reviewId?: string;
}) {
  return prisma.abuseReport.create({
    data: {
      type,
      reason,
      reporterId,
      businessId,
      reviewId,
      status: 'PENDING',
    },
  });
}

// Get business statistics
export async function getBusinessStats() {
  const [totalBusinesses, activeBusinesses, categories, reviews] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { status: 'ACTIVE' } }),
    prisma.category.count(),
    prisma.review.count({ where: { isHidden: false } }),
  ]);

  return {
    totalBusinesses,
    activeBusinesses,
    categories,
    reviews,
  };
}
