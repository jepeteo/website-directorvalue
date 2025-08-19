import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  // For now, we'll create a simple dashboard
  // Session handling will be added when we fix NextAuth v5 compatibility

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <a
                  href="/dashboard/business/add"
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Add Your Business</div>
                  <div className="text-sm text-muted-foreground">
                    Register your business on the platform
                  </div>
                </a>
              </div>

              <div>
                <a
                  href="/dashboard/business"
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Manage Your Business</div>
                  <div className="text-sm text-muted-foreground">
                    Update business information and settings
                  </div>
                </a>
              </div>

              <div>
                <a
                  href="/dashboard/reviews"
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Your Reviews</div>
                  <div className="text-sm text-muted-foreground">
                    View and manage your reviews
                  </div>
                </a>
              </div>

              <div>
                <a
                  href="/dashboard/settings"
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">Account Settings</div>
                  <div className="text-sm text-muted-foreground">
                    Update your profile and preferences
                  </div>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
