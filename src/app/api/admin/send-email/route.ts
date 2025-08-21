import { NextRequest } from 'next/server';
import { z } from 'zod';
import { sendBusinessStatusEmail, sendWelcomeEmail } from '@/lib/email-service';
import { prisma } from '@/lib/prisma';
import { withAdminAuth, adminApiResponse, validateAdminRequest, logAdminAction } from '@/lib/admin-api';

const sendEmailSchema = z.object({
  type: z.enum(['business_approved', 'business_rejected', 'business_suspended', 'welcome']),
  businessId: z.string().optional(),
  recipientEmail: z.string().email(),
  reason: z.string().optional(),
});

type SendEmailRequest = z.infer<typeof sendEmailSchema>;

export async function POST(request: NextRequest) {
  // Validate request body
  const validation = await validateAdminRequest<SendEmailRequest>(request, sendEmailSchema);
  if (!validation.success) {
    return adminApiResponse(validation);
  }

  const { type, businessId, recipientEmail, reason } = validation.data;

  // Handle admin authentication and email logic
  const result = await withAdminAuth(async (session) => {
    let emailResult;

    switch (type) {
      case 'welcome':
        emailResult = await sendWelcomeEmail({
          userEmail: recipientEmail,
          userName: recipientEmail.split('@')[0] || 'User', // Fallback name
        });
        break;

      case 'business_approved':
      case 'business_rejected':
      case 'business_suspended':
        if (!businessId) {
          throw new Error('Business ID required for business status emails');
        }

        // Get business details
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

        const statusMap = {
          business_approved: 'ACTIVE',
          business_rejected: 'REJECTED',
          business_suspended: 'SUSPENDED',
        } as const;

        emailResult = await sendBusinessStatusEmail({
          businessId: business.id,
          businessName: business.name,
          ownerName: business.owner.name || business.owner.email,
          ownerEmail: business.owner.email,
          status: statusMap[type] as "DRAFT" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED",
          ...(reason && { reason }),
          ...(business.category?.name && { categoryName: business.category.name }),
        });
        break;

      default:
        throw new Error('Invalid email type');
    }

    // Log admin action
    await logAdminAction(
      session.user.id,
      'send_email',
      'email',
      emailResult.emailId || 'unknown',
      {
        emailType: type,
        recipientEmail,
        businessId,
        reason,
      }
    );

    return {
      success: true,
      emailId: emailResult.emailId,
      message: 'Email sent successfully',
    };
  });

  return adminApiResponse(result);
}
