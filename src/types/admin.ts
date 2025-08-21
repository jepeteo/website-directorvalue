import { User } from "@prisma/client";

export interface AdminUser extends User {
  role: "ADMIN" | "MODERATOR";
}

export interface AdminSession {
  user: AdminUser;
}

// Type guard for admin user
export function isAdminUser(user: User | null | undefined): user is AdminUser {
  return user?.role === "ADMIN" || user?.role === "MODERATOR";
}

// Type guard for admin session
export function isAdminSession(session: unknown): session is AdminSession {
  return Boolean(
    session && 
    typeof session === 'object' && 
    session !== null &&
    'user' in session && 
    isAdminUser((session as { user: unknown }).user as User)
  );
}

// Business with calculated stats
export interface BusinessWithRating {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  logo: string | null;
  city: string | null;
  country: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  status: string;
  planType: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    reviews: number;
  };
  reviews: {
    rating: number;
  }[];
  averageRating: number;
}

// Analytics data structure
export interface AdminAnalyticsData {
  overview: {
    totalUsers: number;
    activeBusinesses: number;
    totalReviews: number;
    averageRating: number;
    monthlyRevenue: number;
    pageViews: number;
  };
  growth: {
    usersGrowth: number;
    businessesGrowth: number;
    reviewsGrowth: number;
    revenueGrowth: number;
  };
  topCategories: {
    name: string;
    count: number;
    percentage: number;
  }[];
  recentCounts: {
    recentUsers: number;
    recentBusinesses: number;
    recentReviews: number;
  };
}

// Billing data structure
export interface AdminBillingData {
  overview: {
    totalRevenue: number;
    monthlyRecurring: number;
    activeSubscriptions: number;
    churnRate: number;
    trialUsers: number;
  };
  plans: {
    basic: {
      name: string;
      price: number;
      subscribers: number;
      revenue: number;
    };
    pro: {
      name: string;
      price: number;
      subscribers: number;
      revenue: number;
    };
    vip: {
      name: string;
      price: number;
      subscribers: number;
      revenue: number;
    };
  };
  recentSubscriptions: Array<{
    id: string;
    name: string;
    planType: string;
    updatedAt: Date;
    owner: {
      name: string | null;
      email: string;
    };
  }>;
}

// Error handling types
export interface AdminError {
  message: string;
  code?: string;
  status?: number;
}

export type AdminApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: AdminError };

// Pagination interface
export interface AdminPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
