import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Development Login - Director Value",
  description: "Development access for testing",
};

export default function DevLoginPage() {
  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Not Available
            </h1>
            <p className="text-gray-600">
              This page is only available in development mode.
            </p>
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Development Access
            </h1>
            <p className="text-gray-600">
              Authentication bypassed in development mode - direct access
              available
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">🔐 Admin Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Email:</strong> admin@directorvalue.com
                    <br />
                    <strong>Role:</strong> ADMIN
                  </div>
                  <p className="text-sm text-gray-600">
                    Full access to admin panel, user management, business
                    listings, and system settings.
                  </p>
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <Link href="/admin">Go to Admin Panel</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/signin">Regular Sign In</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">
                  👤 Business Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong>Email:</strong> owner1@example.com
                    <br />
                    <strong>Role:</strong> BUSINESS_OWNER
                  </div>
                  <p className="text-sm text-gray-600">
                    Access to business dashboard, listing management, and
                    analytics.
                  </p>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/signin">Regular Sign In</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>⚠️ Development Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Email Auth:</strong> Magic link authentication is
                  configured but email server is not set up in development.
                </p>
                <p>
                  <strong>Admin Panel:</strong> The admin panel at{" "}
                  <code>/admin</code> requires ADMIN role.
                </p>
                <p>
                  <strong>Dashboard:</strong> Business dashboard at{" "}
                  <code>/dashboard</code> requires authentication.
                </p>
                <p>
                  <strong>Database:</strong> You can also use Prisma Studio at{" "}
                  <code>http://localhost:5555</code> to view/edit data directly.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <div className="space-y-2">
              <Button asChild variant="outline">
                <Link href="/">← Back to Homepage</Link>
              </Button>
              <br />
              <Button asChild variant="outline" size="sm">
                <Link href="http://localhost:5555" target="_blank">
                  Open Prisma Studio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
