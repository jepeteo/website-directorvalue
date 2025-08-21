import { auth } from "@/lib/auth";
import { getBusinessesByOwner } from "@/lib/business-service";
import { LeadManagement } from "@/components/dashboard/lead-management";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BusinessPageProps {
  params: {
    businessId: string;
  };
}

export default async function BusinessLeadsPage({ params }: BusinessPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const businesses = await getBusinessesByOwner(session.user.id);
    const business = businesses.find(
      (b: { id: string }) => b.id === params.businessId
    );

    if (!business) {
      notFound();
    }

    return (
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/dashboard/leads"
            className="hover:text-gray-900 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>
          <span>/</span>
          <span>{business.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lead Management</h1>
            <p className="text-gray-600">
              Leads for <strong>{business.name}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={business.status === "ACTIVE" ? "default" : "secondary"}
            >
              {business.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {business.planType.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Lead Management Component */}
        <LeadManagement businessId={business.id} businessName={business.name} />
      </div>
    );
  } catch (error) {
    console.error("Error loading business leads page:", error);
    notFound();
  }
}
