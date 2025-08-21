import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendBusinessStatusEmail } from '@/lib/email-service';
import { withAdminAuth, adminApiResponse, validateAdminRequest, logAdminAction } from '@/lib/admin-api';

const businessStatusSchema = z.object({
  businessId: z.string(),
  status: z.enum(['DRAFT', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED']),
  reason: z.string().optional(),
  sendEmail: z.boolean().default(true),
});

type BusinessStatusRequest = z.infer<typeof businessStatusSchema>;

export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateAdminRequest<BusinessStatusRequest>(request, businessStatusSchema);
  if (!validation.success) {
    return adminApiResponse(validation);
  }

  const { businessId, status, reason, sendEmail } = validation.data;

  // Handle admin authentication and business logic
  const result = await withAdminAuth(async (session) => {
    // Get the business with owner details
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!business) {
      throw new Error('Business not found');
    }

    // Update business status
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        status: status as "DRAFT" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED" | "DEACTIVATED",
        updatedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Log admin action
    await logAdminAction(
      session.user.id,
      'BUSINESS_STATUS_CHANGE',
      'BUSINESS',
      businessId,
      {
        previousStatus: business.status,
        newStatus: status,
        reason,
      }
    );

    // Send email notification if requested
    if (sendEmail && business.owner.email) {
      try {
        await sendBusinessStatusEmail({
          businessId: business.id,
          businessName: business.name,
          ownerName: business.owner.name || business.owner.email,
          ownerEmail: business.owner.email,
          status,
          ...(reason && { reason }),
          ...(business.category?.name && { categoryName: business.category.name }),
        });
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return {
      success: true,
      business: updatedBusiness,
      message: `Business ${status.toLowerCase()} successfully`,
    };
  });

  return adminApiResponse(result);
}
