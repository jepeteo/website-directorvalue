import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Crown, AlertTriangle } from "lucide-react";

type UserRole =
  | "VISITOR"
  | "BUSINESS_OWNER"
  | "ADMIN"
  | "MODERATOR"
  | "FINANCE"
  | "SUPPORT";
type PlanType = "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPlans?: PlanType[];
  fallbackComponent?: ReactNode;
}

// Component to show when access is denied
function AccessDenied({
  reason,
  upgradeLink,
}: {
  reason: string;
  upgradeLink?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>{reason}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {upgradeLink && (
            <Button asChild className="w-full">
              <Link href={upgradeLink}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Your Plan
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export async function RoleGuard({
  children,
  allowedRoles = ["BUSINESS_OWNER", "ADMIN"],
  requiredPlans,
  fallbackComponent,
}: RoleGuardProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const userRole = (session.user as { role?: UserRole })?.role || "VISITOR";

  // Check if user role is allowed
  if (!allowedRoles.includes(userRole)) {
    const upgradeLink = userRole === "VISITOR" ? "/pricing" : undefined;
    return (
      fallbackComponent || (
        <AccessDenied
          reason={`This feature requires ${allowedRoles.join(" or ")} access.`}
          {...(upgradeLink && { upgradeLink })}
        />
      )
    );
  }

  // For business owners, check plan requirements
  if (userRole === "BUSINESS_OWNER" && requiredPlans) {
    // Get user's plan from their business
    const { prisma } = await import("@/lib/prisma");

    try {
      const business = await prisma.business.findFirst({
        where: {
          ownerId: session.user.id!,
        },
        select: {
          planType: true,
        },
      });

      const userPlan = (business?.planType as PlanType) || "FREE_TRIAL";

      if (!requiredPlans.includes(userPlan)) {
        return (
          fallbackComponent || (
            <AccessDenied
              reason={`This feature requires ${requiredPlans.join(
                " or "
              )} plan.`}
              upgradeLink="/pricing"
            />
          )
        );
      }
    } catch (error) {
      console.error("Error checking user plan:", error);
      return (
        fallbackComponent || (
          <AccessDenied reason="Unable to verify your plan. Please try again." />
        )
      );
    }
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export async function RequireBusinessOwner({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["BUSINESS_OWNER", "ADMIN"]}>{children}</RoleGuard>
  );
}

export async function RequireProPlan({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["BUSINESS_OWNER", "ADMIN"]}
      requiredPlans={["PRO", "VIP"]}
    >
      {children}
    </RoleGuard>
  );
}

export async function RequireVipPlan({ children }: { children: ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={["BUSINESS_OWNER", "ADMIN"]}
      requiredPlans={["VIP"]}
    >
      {children}
    </RoleGuard>
  );
}

export async function RequireAdmin({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "MODERATOR", "FINANCE", "SUPPORT"]}>
      {children}
    </RoleGuard>
  );
}
