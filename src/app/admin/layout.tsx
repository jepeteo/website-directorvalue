import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata: Metadata = {
  title: "Admin Dashboard - Director Value",
  description:
    "Administrative dashboard for Director Value platform management",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Development bypass - create a mock admin session
  const isDevelopment = process.env.NODE_ENV === "development";

  // Check if user is authenticated and has admin role
  if (!session?.user || session.user.role !== "ADMIN") {
    if (!isDevelopment) {
      redirect("/auth/signin");
    }
    // In development, create a mock session for testing
    const mockSession = {
      user: {
        id: "dev-admin",
        name: "Dev Admin",
        email: "admin@directorvalue.com",
        role: "ADMIN" as const,
      },
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader user={mockSession.user} />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Development Mode:</strong> Bypassing authentication
                    for testing. This will not work in production.
                  </p>
                </div>
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
