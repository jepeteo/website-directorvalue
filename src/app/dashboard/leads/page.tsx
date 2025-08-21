import { auth } from "@/lib/auth";
import { getBusinessesByOwner } from "@/lib/business-service";
import { LeadManagement } from "@/components/dashboard/lead-management";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { RequireVipPlan } from "@/components/auth/role-guard";

interface BusinessOption {
  id: string;
  name: string;
  slug: string;
  status: string;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
}

export default async function LeadsPage() {
  return (
    <RequireVipPlan>
      <LeadsPageContent />
    </RequireVipPlan>
  );
}

async function LeadsPageContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const businesses = await getBusinessesByOwner(session.user.id);

    if (!businesses || businesses.length === 0) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-gray-600">Track and manage customer inquiries</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>No Businesses Found</CardTitle>
              <CardDescription>
                You need to create a business listing before you can receive
                leads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create Your First Business
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your business to start receiving customer leads and
                  inquiries.
                </p>
                <Button asChild>
                  <Link href="/dashboard/businesses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If only one business, show leads directly
    if (businesses.length === 1) {
      const business = businesses[0];
      if (!business) {
        return <div>Business not found</div>;
      }
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Lead Management</h1>
              <p className="text-gray-600">
                Leads for <strong>{business.name}</strong>
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {business.planType.replace("_", " ")}
            </Badge>
          </div>

          <LeadManagement
            businessId={business.id}
            businessName={business.name}
          />
        </div>
      );
    }

    // Multiple businesses - show selection
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-gray-600">Select a business to view its leads</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business: BusinessOption) => (
            <Card
              key={business.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription>
                  View and manage customer leads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        business.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {business.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {business.planType.replace("_", " ")}
                    </Badge>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/leads/${business.id}`}>
                      View Leads
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading leads page:", error);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-gray-600">Track and manage customer inquiries</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Loading Businesses</CardTitle>
            <CardDescription>
              There was an error loading your business information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
