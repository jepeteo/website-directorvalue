import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { sendBusinessStatusEmail, sendWelcomeEmail } from '@/lib/email-service';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const sendEmailSchema = z.object({
  type: z.enum(['business_approved', 'business_rejected', 'business_suspended', 'welcome']),
  businessId: z.string().optional(),
  recipientEmail: z.string().email(),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { type, businessId, recipientEmail, reason } = sendEmailSchema.parse(body);

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          userEmail: recipientEmail,
          userName: recipientEmail.split('@')[0], // Fallback name
        });
        break;

      case 'business_approved':
      case 'business_rejected':
      case 'business_suspended':
        if (!businessId) {
          return NextResponse.json(
            { error: 'Business ID required for business status emails' },
            { status: 400 }
          );
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
          return NextResponse.json(
            { error: 'Business not found' },
            { status: 404 }
          );
        }

        const statusMap = {
          business_approved: 'ACTIVE',
          business_rejected: 'REJECTED',
          business_suspended: 'SUSPENDED',
        } as const;

        result = await sendBusinessStatusEmail({
          businessId: business.id,
          businessName: business.name,
          ownerName: business.owner.name || business.owner.email,
          ownerEmail: business.owner.email,
          status: statusMap[type] as "DRAFT" | "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED",
          reason,
          categoryName: business.category?.name,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      emailId: result.emailId,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('Send email error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
