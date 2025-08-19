import { prisma } from './prisma';

// Type definitions based on Prisma schema
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
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rating: number;
  reviewCount: number;
  categoryId?: string | null;
  ownerId?: string | null;
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
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessId: string;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: 'VISITOR' | 'BUSINESS_OWNER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessWithCategory = Business & {
  category: Category | null;
};

export type BusinessWithExtras = Business & {
  category: Category | null;
  reviews: Array<Review & { user: User | null }>;
  owner?: User | null;
};

export type ReviewWithUser = Review & {
  user: User | null;
};

interface SearchWhereCondition {
  status: string;
  AND?: Array<Record<string, unknown>>;
  OR?: Array<Record<string, unknown>>;
}

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
  const where: SearchWhereCondition = {
    status: 'ACTIVE',
    AND: [],
  };

  if (query) {
    where.AND!.push({
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { hasSome: [query] } },
        { tags: { hasSome: [query] } },
      ],
    });
  }

  if (categoryId) {
    where.AND!.push({ categoryId });
  }

  if (location) {
    where.AND!.push({
      OR: [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } },
      ],
    });
  }

  // Clean up empty AND array
  if (where.AND!.length === 0) {
    delete where.AND;
  }

type OrderByOption = 
  | { rating: 'desc' | 'asc' }
  | { createdAt: 'desc' | 'asc' }
  | { reviewCount: 'desc' | 'asc' }
  | { planType: 'desc' | 'asc' };

  // Build orderBy
  let orderBy: OrderByOption | OrderByOption[];
  switch (sortBy) {
    case 'rating':
      orderBy = { rating: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'reviews':
      orderBy = { reviewCount: 'desc' };
      break;
    default:
      // For relevance, prioritize VIP plans and then by rating
      orderBy = [
        { planType: 'desc' }, // VIP first
        { rating: 'desc' },
      ];
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.business.count({ where }),
  ]);

  return {
    businesses: businesses as BusinessWithCategory[],
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
        where: { status: 'APPROVED' },
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

  return business as BusinessWithExtras | null;
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

// Get all categories
export async function getCategories() {
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
  return prisma.business.findMany({
    where: {
      status: 'ACTIVE',
      planType: 'VIP',
    },
    include: {
      category: true,
    },
    orderBy: [
      { rating: 'desc' },
      { reviewCount: 'desc' },
    ],
    take: limit,
  }) as Promise<BusinessWithCategory[]>;
}

// Create review
export async function createReview({
  businessId,
  userId,
  rating,
  comment,
  title,
}: {
  businessId: string;
  userId?: string;
  rating: number;
  comment: string;
  title?: string;
}) {
  const review = await prisma.review.create({
    data: {
      businessId,
      userId,
      rating,
      comment,
      title,
      status: 'PENDING', // Reviews need approval
    },
  });

  // Update business rating and review count
  await updateBusinessRating(businessId);

  return review;
}

// Update business rating (called after review creation/approval)
async function updateBusinessRating(businessId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      businessId,
      status: 'APPROVED',
    },
  });

  const rating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length 
    : 0;

  await prisma.business.update({
    where: { id: businessId },
    data: {
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length,
    },
  });
}

// Report abuse
export async function reportAbuse({
  targetType,
  targetId,
  reason,
  description,
  reporterEmail,
}: {
  targetType: 'BUSINESS' | 'REVIEW';
  targetId: string;
  reason: string;
  description?: string;
  reporterEmail?: string;
}) {
  return prisma.abuseReport.create({
    data: {
      targetType,
      targetId,
      reason,
      description,
      reporterEmail,
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
    prisma.review.count({ where: { status: 'APPROVED' } }),
  ]);

  return {
    totalBusinesses,
    activeBusinesses,
    categories,
    reviews,
  };
}
