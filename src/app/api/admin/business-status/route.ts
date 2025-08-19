import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { sendBusinessStatusEmail } from '@/lib/email-service';
import { z } from 'zod';

const businessStatusSchema = z.object({
  businessId: z.string(),
  status: z.enum(['DRAFT', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED']),
  reason: z.string().optional(),
  sendEmail: z.boolean().default(true),
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
    const { businessId, status, reason, sendEmail } = businessStatusSchema.parse(body);

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
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
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

    // Create admin action log
    await prisma.adminActionLog.create({
      data: {
        adminId: token.sub!,
        action: 'BUSINESS_STATUS_CHANGE',
        targetType: 'BUSINESS',
        targetId: businessId,
        details: {
          previousStatus: business.status,
          newStatus: status,
          reason,
        },
        createdAt: new Date(),
      },
    });

    // Send email notification if requested
    if (sendEmail && business.owner.email) {
      try {
        await sendBusinessStatusEmail({
          businessId: business.id,
          businessName: business.name,
          ownerName: business.owner.name || business.owner.email,
          ownerEmail: business.owner.email,
          status,
          reason,
          categoryName: business.category?.name,
        });
      } catch (emailError) {
        console.error('Failed to send status email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      business: updatedBusiness,
      message: `Business ${status.toLowerCase()} successfully`,
    });

  } catch (error) {
    console.error('Business status update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
