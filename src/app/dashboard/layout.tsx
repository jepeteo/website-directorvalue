import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export const metadata: Metadata = {
  title: "Dashboard - Director Value",
  description: "Manage your business listings on Director Value",
};

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
    // In development, show warning and continue
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
                <DashboardNav />
              </div>
            </aside>
            <main className="flex-1">{children}</main>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-muted/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
              <DashboardNav />
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </main>
      <Footer />
    </div>
  );
}
