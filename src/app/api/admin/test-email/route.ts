import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendBusinessStatusEmail, sendWelcomeEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { type, email } = await request.json();

    let result;

    switch (type) {
      case "approval":
        result = await sendBusinessStatusEmail({
          businessId: "test-business-id",
          businessName: "Test Business",
          ownerName: "Test Owner",
          ownerEmail: email || "test@example.com",
          status: "ACTIVE",
          categoryName: "Test Category"
        });
        break;
      case "rejection":
        result = await sendBusinessStatusEmail({
          businessId: "test-business-id",
          businessName: "Test Business",
          ownerName: "Test Owner",
          ownerEmail: email || "test@example.com",
          status: "REJECTED",
          reason: "Your business submission needs revision. Please review our guidelines and resubmit."
        });
        break;
      case "suspension":
        result = await sendBusinessStatusEmail({
          businessId: "test-business-id",
          businessName: "Test Business",
          ownerName: "Test Owner",
          ownerEmail: email || "test@example.com",
          status: "SUSPENDED",
          reason: "Your business has been temporarily suspended due to policy violations."
        });
        break;
      case "welcome":
        result = await sendWelcomeEmail({
          userEmail: email || "test@example.com",
          userName: "Test User",
          businessName: "Test Business"
        });
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent successfully`,
      emailId: result.emailId,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send test email", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
