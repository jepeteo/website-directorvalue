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

// Partial User type for select queries
export type PartialUser = {
  id: string;
  name: string | null;
  email: string | null;
};

export type BusinessWithExtras = BusinessWithRating & {
  category: Category | null;
  reviews: Array<Review & { user: PartialUser | null }>;
  owner?: PartialUser | null;
};

export type ReviewWithUser = Review & {
  user: User | null;
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
          where: {
            isHidden: false, // Only include visible reviews in rating calculation
          },
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
  const businessesWithRatings = businesses.map((business) => {
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
    businessesWithRatings.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    businessesWithRatings.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return {
    businesses: businessesWithRatings,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

// Get business by ID (for owner verification)
export async function getBusinessById(id: string) {
  return prisma.business.findUnique({
    where: { id },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}
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
  } as BusinessWithExtras;
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
        where: {
          isHidden: false, // Only include visible reviews
        },
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
  return businesses.map((business) => {
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
  }) as BusinessWithCategory[];
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

// Business Owner Dashboard Functions

// Get businesses owned by a user
export async function getBusinessesByOwner(ownerId: string) {
  const businesses = await prisma.business.findMany({
    where: { ownerId },
    include: {
      category: true,
      reviews: {
        where: { isHidden: false },
        select: {
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
    orderBy: { createdAt: 'desc' },
  });

  // Calculate ratings for each business
  return businesses.map((business) => {
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
  });
}

// Get business owner dashboard stats
export async function getOwnerDashboardStats(ownerId: string) {
  const [totalBusinesses, activeBusinesses, totalReviews, totalViews] = await Promise.all([
    prisma.business.count({ where: { ownerId } }),
    prisma.business.count({ where: { ownerId, status: 'ACTIVE' } }),
    prisma.review.count({
      where: {
        business: { ownerId },
        isHidden: false,
      },
    }),
    // For now, we'll simulate views since we don't have analytics yet
    Promise.resolve(0),
  ]);

  return {
    totalBusinesses,
    activeBusinesses,
    totalReviews,
    totalViews,
  };
}

// Create or update business for owner
export async function createBusinessForOwner({
  ownerId,
  name,
  slug,
  description,
  email,
  phone,
  website,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
  categoryId,
  services = [],
  tags = [],
  workingHours = null,
  planType = 'FREE_TRIAL',
}: {
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  categoryId?: string;
  services?: string[];
  tags?: string[];
  workingHours?: Record<string, { open: string; close: string }> | null;
  planType?: 'FREE_TRIAL' | 'BASIC' | 'PRO' | 'VIP';
}) {
  return prisma.business.create({
    data: {
      ownerId,
      name,
      slug,
      description,
      email,
      phone,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      categoryId,
      services,
      tags,
      workingHours: workingHours || undefined,
      planType,
      status: 'ACTIVE', // VIP users get immediate activation
      images: [],
    },
    include: {
      category: true,
    },
  });
}

// Update business for owner
export async function updateBusinessForOwner(params: {
  businessId: string;
  ownerId: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  categoryId?: string;
  services?: string[];
  tags?: string[];
  workingHours?: Record<string, { open: string; close: string }> | null;
  planType?: 'FREE_TRIAL' | 'BASIC' | 'PRO' | 'VIP';
}) {
  const { businessId, ownerId, ...updateData } = params;
  // Verify ownership
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId,
    },
  });

  if (!business) {
    throw new Error('Business not found or access denied');
  }

  return prisma.business.update({
    where: { id: businessId },
    data: updateData as Record<string, unknown>,
    include: {
      category: true,
    },
  });
}
