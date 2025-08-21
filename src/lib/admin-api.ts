import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminError, AdminApiResponse, isAdminSession, AdminSession } from "@/types/admin";
import type { Session } from "next-auth";
import type { Prisma } from "@prisma/client";

/**
 * Centralized admin authentication middleware
 */
export async function withAdminAuth<T>(
  handler: (session: Session & AdminSession) => Promise<T>
): Promise<AdminApiResponse<T>> {
  try {
    const session = await auth();

    if (!session?.user || !isAdminSession(session)) {
      return {
        success: false,
        error: {
          message: "Admin access required",
          code: "ADMIN_ACCESS_REQUIRED",
          status: 403,
        },
      };
    }

    const data = await handler(session as Session & AdminSession);
    return { success: true, data };
  } catch (error) {
    console.error("Admin API error:", error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Internal server error",
        code: "INTERNAL_ERROR",
        status: 500,
      },
    };
  }
}

/**
 * Standardized admin API response handler
 */
export function adminApiResponse<T>(result: AdminApiResponse<T>): NextResponse {
  if (result.success) {
    return NextResponse.json(result.data);
  }

  return NextResponse.json(
    { error: result.error.message },
    { status: result.error.status || 500 }
  );
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const createData: Prisma.AdminActionLogCreateInput = {
      admin: { connect: { id: adminId } },
      action,
      targetType,
      targetId,
    };

    // Only add details if provided
    if (details !== undefined) {
      createData.details = details as Prisma.InputJsonValue;
    }

    await prisma.adminActionLog.create({
      data: createData,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Standardized pagination helper
 */
export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

export function getPaginationParams(
  searchParams: PaginationParams
): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(String(searchParams.page || 1), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(searchParams.limit || 10), 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build pagination response
 */
export function buildPaginationResponse(
  page: number,
  limit: number,
  totalCount: number
) {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    page,
    limit,
    totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Validate admin request body with Zod
 */
export async function validateAdminRequest<T>(
  request: NextRequest,
  schema: { parse: (data: unknown) => T }
): Promise<AdminApiResponse<T>> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Invalid request data",
        code: "VALIDATION_ERROR",
        status: 400,
      },
    };
  }
}
