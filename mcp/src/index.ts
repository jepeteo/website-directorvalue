#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Validation schemas
const BusinessSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING", "ACTIVE", "SUSPENDED", "REJECTED", "DEACTIVATED"]).optional(),
  planType: z.enum(["FREE_TRIAL", "BASIC", "PRO", "VIP"]).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

const UserSearchSchema = z.object({
  email: z.string().optional(),
  role: z.enum(["VISITOR", "BUSINESS_OWNER", "ADMIN", "MODERATOR", "FINANCE", "SUPPORT"]).optional(),
  name: z.string().optional(),
  hasBusinesses: z.boolean().optional(),
  hasReviews: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

const UserDetailsSchema = z.object({
  userId: z.string(),
  includeBusinesses: z.boolean().default(true),
  includeReviews: z.boolean().default(true),
  includeActivity: z.boolean().default(true),
});

const UserByEmailSchema = z.object({
  email: z.string().email(),
  includeBusinesses: z.boolean().default(true),
});

const UserAnalyticsSchema = z.object({
  userId: z.string(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

const UsersByRoleSchema = z.object({
  role: z.enum(["VISITOR", "BUSINESS_OWNER", "ADMIN", "MODERATOR", "FINANCE", "SUPPORT"]),
  includeStats: z.boolean().default(true),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// MCP Server Implementation without SDK dependency
class MCPServer {
  private tools = [
    {
      name: "search_businesses",
      description: "Search and filter businesses in the directory",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search term for business name or description" },
          category: { type: "string", description: "Category slug to filter by" },
          city: { type: "string", description: "City to filter by" },
          country: { type: "string", description: "Country to filter by" },
          status: { 
            type: "string", 
            enum: ["DRAFT", "PENDING", "ACTIVE", "SUSPENDED", "REJECTED", "DEACTIVATED"],
            description: "Business status to filter by" 
          },
          planType: { 
            type: "string", 
            enum: ["FREE_TRIAL", "BASIC", "PRO", "VIP"],
            description: "Plan type to filter by" 
          },
          limit: { type: "number", description: "Number of results to return (1-100)", default: 10 },
          offset: { type: "number", description: "Number of results to skip", default: 0 },
        },
      },
    },
    {
      name: "get_business_details",
      description: "Get detailed information about a specific business",
      inputSchema: {
        type: "object",
        properties: {
          businessId: { type: "string", description: "Business ID" },
        },
        required: ["businessId"],
      },
    },
    {
      name: "list_categories",
      description: "List all business categories",
      inputSchema: {
        type: "object",
        properties: {
          parentId: { type: "string", description: "Parent category ID (for subcategories)" },
          includeBusinessCount: { type: "boolean", description: "Include business count for each category", default: false },
        },
      },
    },
    {
      name: "search_reviews",
      description: "Search and filter reviews",
      inputSchema: {
        type: "object",
        properties: {
          businessId: { type: "string", description: "Business ID to filter by" },
          userId: { type: "string", description: "User ID to filter by" },
          rating: { type: "number", description: "Rating to filter by (1-5)" },
          isHidden: { type: "boolean", description: "Filter by hidden status" },
          limit: { type: "number", description: "Number of results to return", default: 10 },
          offset: { type: "number", description: "Number of results to skip", default: 0 },
        },
      },
    },
    {
      name: "search_leads",
      description: "Search and filter leads",
      inputSchema: {
        type: "object",
        properties: {
          businessId: { type: "string", description: "Business ID to filter by" },
          status: { 
            type: "string", 
            enum: ["NEW", "VIEWED", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED_LOST"],
            description: "Lead status to filter by" 
          },
          priority: { 
            type: "string", 
            enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
            description: "Lead priority to filter by" 
          },
          source: { type: "string", description: "Lead source to filter by" },
          limit: { type: "number", description: "Number of results to return", default: 10 },
          offset: { type: "number", description: "Number of results to skip", default: 0 },
        },
      },
    },
    {
      name: "search_users",
      description: "Search and filter users by email, role, and activity",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email to search for (partial match)" },
          role: { 
            type: "string", 
            enum: ["VISITOR", "BUSINESS_OWNER", "ADMIN", "MODERATOR", "FINANCE", "SUPPORT"],
            description: "User role to filter by" 
          },
          name: { type: "string", description: "Name to search for (partial match)" },
          hasBusinesses: { type: "boolean", description: "Filter users who have businesses" },
          hasReviews: { type: "boolean", description: "Filter users who have written reviews" },
          limit: { type: "number", description: "Number of results to return", default: 10 },
          offset: { type: "number", description: "Number of results to skip", default: 0 },
        },
      },
    },
    {
      name: "get_user_details",
      description: "Get detailed information about a specific user",
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          includeBusinesses: { type: "boolean", description: "Include user's businesses", default: true },
          includeReviews: { type: "boolean", description: "Include user's reviews", default: true },
          includeActivity: { type: "boolean", description: "Include recent activity", default: true },
        },
        required: ["userId"],
      },
    },
    {
      name: "get_user_by_email",
      description: "Find a user by their email address",
      inputSchema: {
        type: "object",
        properties: {
          email: { type: "string", description: "User's email address" },
          includeBusinesses: { type: "boolean", description: "Include user's businesses", default: true },
        },
        required: ["email"],
      },
    },
    {
      name: "get_user_analytics",
      description: "Get analytics for a specific user's activity",
      inputSchema: {
        type: "object",
        properties: {
          userId: { type: "string", description: "User ID" },
          dateFrom: { type: "string", description: "Start date (YYYY-MM-DD)" },
          dateTo: { type: "string", description: "End date (YYYY-MM-DD)" },
        },
        required: ["userId"],
      },
    },
    {
      name: "get_users_by_role",
      description: "Get all users with a specific role",
      inputSchema: {
        type: "object",
        properties: {
          role: { 
            type: "string", 
            enum: ["VISITOR", "BUSINESS_OWNER", "ADMIN", "MODERATOR", "FINANCE", "SUPPORT"],
            description: "User role to filter by" 
          },
          includeStats: { type: "boolean", description: "Include user statistics", default: true },
          limit: { type: "number", description: "Number of results to return", default: 20 },
          offset: { type: "number", description: "Number of results to skip", default: 0 },
        },
        required: ["role"],
      },
    },
    {
      name: "get_analytics_summary",
      description: "Get analytics summary for the platform",
      inputSchema: {
        type: "object",
        properties: {
          dateFrom: { type: "string", description: "Start date (YYYY-MM-DD)" },
          dateTo: { type: "string", description: "End date (YYYY-MM-DD)" },
        },
      },
    },
  ];

  async handleMessage(message: any) {
    const { method, params } = message;

    switch (method) {
      case "tools/list":
        return {
          tools: this.tools,
        };

      case "tools/call":
        return await this.callTool(params.name, params.arguments);

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  async callTool(name: string, args: any) {
    try {
      switch (name) {
        case "search_businesses": {
          const params = BusinessSearchSchema.parse(args || {});
          const businesses = await prisma.business.findMany({
            where: {
              ...(params.query && {
                OR: [
                  { name: { contains: params.query, mode: "insensitive" } },
                  { description: { contains: params.query, mode: "insensitive" } },
                ],
              }),
              ...(params.category && {
                category: { slug: params.category },
              }),
              ...(params.city && { city: params.city }),
              ...(params.country && { country: params.country }),
              ...(params.status && { status: params.status as any }),
              ...(params.planType && { planType: params.planType as any }),
            },
            include: {
              owner: { select: { name: true, email: true } },
              category: { select: { name: true, slug: true } },
              _count: { select: { reviews: true, leads: true } },
            },
            take: params.limit,
            skip: params.offset,
            orderBy: { updatedAt: "desc" },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(businesses, null, 2),
              },
            ],
          };
        }

        case "get_business_details": {
          const { businessId } = args as { businessId: string };
          const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: {
              owner: { select: { name: true, email: true, role: true } },
              category: true,
              reviews: {
                include: {
                  user: { select: { name: true } },
                  ownerResponse: true,
                },
                orderBy: { createdAt: "desc" },
                take: 5,
              },
              leads: {
                orderBy: { createdAt: "desc" },
                take: 5,
              },
              _count: {
                select: { reviews: true, leads: true, abuseReports: true },
              },
            },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(business, null, 2),
              },
            ],
          };
        }

        case "list_categories": {
          const { parentId, includeBusinessCount } = args as {
            parentId?: string;
            includeBusinessCount?: boolean;
          };

          const categories = await prisma.category.findMany({
            where: { parentId: parentId || null },
            include: {
              children: true,
              ...(includeBusinessCount && {
                _count: { select: { businesses: true } },
              }),
            },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(categories, null, 2),
              },
            ],
          };
        }

        case "search_reviews": {
          const { businessId, userId, rating, isHidden, limit = 10, offset = 0 } = args as {
            businessId?: string;
            userId?: string;
            rating?: number;
            isHidden?: boolean;
            limit?: number;
            offset?: number;
          };

          const reviews = await prisma.review.findMany({
            where: {
              ...(businessId && { businessId }),
              ...(userId && { userId }),
              ...(rating && { rating }),
              ...(isHidden !== undefined && { isHidden }),
            },
            include: {
              user: { select: { name: true, email: true } },
              business: { select: { name: true, slug: true } },
              ownerResponse: true,
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(reviews, null, 2),
              },
            ],
          };
        }

        case "search_leads": {
          const { businessId, status, priority, source, limit = 10, offset = 0 } = args as {
            businessId?: string;
            status?: string;
            priority?: string;
            source?: string;
            limit?: number;
            offset?: number;
          };

          const leads = await prisma.lead.findMany({
            where: {
              ...(businessId && { businessId }),
              ...(status && { status: status as any }),
              ...(priority && { priority: priority as any }),
              ...(source && { source }),
            },
            include: {
              business: { select: { name: true, slug: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: "desc" },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(leads, null, 2),
              },
            ],
          };
        }

        case "get_analytics_summary": {
          const { dateFrom, dateTo } = args as { dateFrom?: string; dateTo?: string };
          
          const dateFilter = dateFrom && dateTo ? {
            createdAt: {
              gte: new Date(dateFrom),
              lte: new Date(dateTo),
            },
          } : {};

          const [
            totalBusinesses,
            activeBusinesses,
            totalUsers,
            totalReviews,
            totalLeads,
            businessesByPlan,
          ] = await Promise.all([
            prisma.business.count({ where: dateFilter }),
            prisma.business.count({ where: { status: "ACTIVE", ...dateFilter } }),
            prisma.user.count({ where: dateFilter }),
            prisma.review.count({ where: dateFilter }),
            prisma.lead.count({ where: dateFilter }),
            prisma.business.groupBy({
              by: ["planType"],
              _count: true,
              where: dateFilter,
            }),
          ]);

          const analytics = {
            summary: {
              totalBusinesses,
              activeBusinesses,
              totalUsers,
              totalReviews,
              totalLeads,
            },
            businessesByPlan,
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(analytics, null, 2),
              },
            ],
          };
        }

        case "search_users": {
          const params = UserSearchSchema.parse(args || {});
          
          const whereClause: any = {};
          
          if (params.email) {
            whereClause.email = { contains: params.email, mode: "insensitive" };
          }
          
          if (params.role) {
            whereClause.role = params.role;
          }
          
          if (params.name) {
            whereClause.name = { contains: params.name, mode: "insensitive" };
          }
          
          if (params.hasBusinesses !== undefined) {
            if (params.hasBusinesses) {
              whereClause.businesses = { some: {} };
            } else {
              whereClause.businesses = { none: {} };
            }
          }
          
          if (params.hasReviews !== undefined) {
            if (params.hasReviews) {
              whereClause.reviews = { some: {} };
            } else {
              whereClause.reviews = { none: {} };
            }
          }

          const users = await prisma.user.findMany({
            where: whereClause,
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true,
              emailVerified: true,
              _count: {
                select: { 
                  businesses: true, 
                  reviews: true,
                  abuseReports: true,
                },
              },
            },
            take: params.limit,
            skip: params.offset,
            orderBy: { createdAt: "desc" },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(users, null, 2),
              },
            ],
          };
        }

        case "get_user_details": {
          const params = UserDetailsSchema.parse(args);
          
          const user = await prisma.user.findUnique({
            where: { id: params.userId },
            include: {
              ...(params.includeBusinesses && {
                businesses: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    planType: true,
                    createdAt: true,
                    category: { select: { name: true, slug: true } },
                    _count: { select: { reviews: true, leads: true } },
                  },
                  orderBy: { createdAt: "desc" },
                },
              }),
              ...(params.includeReviews && {
                reviews: {
                  select: {
                    id: true,
                    rating: true,
                    title: true,
                    content: true,
                    isHidden: true,
                    createdAt: true,
                    business: { select: { name: true, slug: true } },
                    ownerResponse: { select: { id: true, content: true, createdAt: true } },
                  },
                  orderBy: { createdAt: "desc" },
                  take: 10,
                },
              }),
              ...(params.includeActivity && {
                abuseReports: {
                  select: {
                    id: true,
                    type: true,
                    status: true,
                    createdAt: true,
                  },
                  orderBy: { createdAt: "desc" },
                  take: 5,
                },
                adminActions: {
                  select: {
                    id: true,
                    action: true,
                    targetType: true,
                    createdAt: true,
                  },
                  orderBy: { createdAt: "desc" },
                  take: 5,
                },
              }),
              _count: {
                select: { 
                  businesses: true, 
                  reviews: true,
                  abuseReports: true,
                  adminActions: true,
                },
              },
            },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(user, null, 2),
              },
            ],
          };
        }

        case "get_user_by_email": {
          const params = UserByEmailSchema.parse(args);
          
          const user = await prisma.user.findUnique({
            where: { email: params.email },
            include: {
              ...(params.includeBusinesses && {
                businesses: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    planType: true,
                    createdAt: true,
                    category: { select: { name: true, slug: true } },
                  },
                  orderBy: { createdAt: "desc" },
                },
              }),
              _count: {
                select: { 
                  businesses: true, 
                  reviews: true,
                  abuseReports: true,
                },
              },
            },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(user, null, 2),
              },
            ],
          };
        }

        case "get_user_analytics": {
          const params = UserAnalyticsSchema.parse(args);
          
          const dateFilter = params.dateFrom && params.dateTo ? {
            createdAt: {
              gte: new Date(params.dateFrom),
              lte: new Date(params.dateTo),
            },
          } : {};

          const [user, businessCount, reviewCount, avgRating, leadCount, recentActivity] = await Promise.all([
            prisma.user.findUnique({
              where: { id: params.userId },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
              },
            }),
            prisma.business.count({
              where: { ownerId: params.userId, ...dateFilter },
            }),
            prisma.review.count({
              where: { userId: params.userId, ...dateFilter },
            }),
            prisma.review.aggregate({
              where: { userId: params.userId, ...dateFilter },
              _avg: { rating: true },
            }),
            prisma.lead.count({
              where: { 
                business: { ownerId: params.userId },
                ...dateFilter,
              },
            }),
            // Recent activity across all areas
            Promise.all([
              prisma.business.findMany({
                where: { ownerId: params.userId, ...dateFilter },
                select: { id: true, name: true, createdAt: true, status: true },
                orderBy: { createdAt: "desc" },
                take: 3,
              }),
              prisma.review.findMany({
                where: { userId: params.userId, ...dateFilter },
                select: { 
                  id: true, 
                  rating: true, 
                  title: true, 
                  createdAt: true,
                  business: { select: { name: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 3,
              }),
            ]),
          ]);

          const analytics = {
            user,
            metrics: {
              businessCount,
              reviewCount,
              avgRating: avgRating._avg.rating || 0,
              leadCount,
            },
            recentActivity: {
              businesses: recentActivity[0],
              reviews: recentActivity[1],
            },
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(analytics, null, 2),
              },
            ],
          };
        }

        case "get_users_by_role": {
          const params = UsersByRoleSchema.parse(args);
          
          const users = await prisma.user.findMany({
            where: { role: params.role },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
              emailVerified: true,
              ...(params.includeStats && {
                _count: {
                  select: { 
                    businesses: true, 
                    reviews: true,
                    abuseReports: true,
                    adminActions: true,
                  },
                },
              }),
            },
            take: params.limit,
            skip: params.offset,
            orderBy: { createdAt: "desc" },
          });

          const totalCount = await prisma.user.count({
            where: { role: params.role },
          });

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  users,
                  pagination: {
                    total: totalCount,
                    limit: params.limit,
                    offset: params.offset,
                    hasMore: (params.offset + params.limit) < totalCount,
                  },
                }, null, 2),
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
}

// Simple stdio protocol handler
class StdioTransport {
  private server: MCPServer;

  constructor(server: MCPServer) {
    this.server = server;
  }

  start() {
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while (null !== (chunk = process.stdin.read())) {
        this.handleMessage(chunk);
      }
    });

    console.error("Director Value MCP Server running on stdio");
  }

  private async handleMessage(data: string) {
    try {
      const message = JSON.parse(data.trim());
      const response = await this.server.handleMessage(message);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (error) {
      const errorResponse = {
        error: {
          code: -1,
          message: error instanceof Error ? error.message : String(error),
        },
      };
      process.stdout.write(JSON.stringify(errorResponse) + '\n');
    }
  }
}

// Start the server
const server = new MCPServer();
const transport = new StdioTransport(server);
transport.start();
