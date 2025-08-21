import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard - Director Value",
  description: "Manage your business listings on Director Value",
};

async function getUserPlan(
  userId: string
): Promise<"FREE_TRIAL" | "BASIC" | "PRO" | "VIP"> {
  try {
    // Get user's primary business plan
    const business = await prisma.business.findFirst({
      where: {
        ownerId: userId,
      },
      select: {
        planType: true,
      },
    });

    return (
      (business?.planType as "FREE_TRIAL" | "BASIC" | "PRO" | "VIP") ||
      "FREE_TRIAL"
    );
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "FREE_TRIAL";
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Debug logging
  console.log("Dashboard Layout - Session:", session);
  console.log("Dashboard Layout - NODE_ENV:", process.env.NODE_ENV);
  console.log("Dashboard Layout - User:", session?.user);

  // Development bypass for testing
  const isDevelopment = process.env.NODE_ENV === "development";

  // Check if user is authenticated
  if (!session?.user) {
    if (!isDevelopment) {
      redirect("/auth/signin");
    }
    // In development, show warning and continue with default values
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Development Mode:</strong> Dashboard access without
                  authentication. This will not work in production.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <aside className="w-64 flex-shrink-0">
              <div className="bg-muted/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
                <DashboardNav userRole="VISITOR" userPlan="FREE_TRIAL" />
              </div>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get user role and plan
  const userRole =
    (
      session.user as {
        role?:
          | "VISITOR"
          | "BUSINESS_OWNER"
          | "ADMIN"
          | "MODERATOR"
          | "FINANCE"
          | "SUPPORT";
      }
    )?.role || "VISITOR";
  const userPlan =
    userRole === "BUSINESS_OWNER"
      ? await getUserPlan(session.user.id!)
      : "FREE_TRIAL";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-muted/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
              <DashboardNav userRole={userRole} userPlan={userPlan} />
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </main>
      <Footer />
    </div>
  );
}
