import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessById } from "@/lib/business-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessApproval } from "@/components/admin/business-approval";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Edit,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface AdminBusinessDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminBusinessDetailPage({
  params,
}: AdminBusinessDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  try {
    const business = await getBusinessById(id);

    if (!business) {
      notFound();
    }

    const handleStatusChange = () => {
      // This will be handled by the BusinessApproval component
    };

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {business.name}
            </h1>
            <p className="text-gray-600">Business ID: {business.id}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href={`/l/${business.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                View Public
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/businesses/${business.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Business
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Business Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Description</h3>
                  <p className="text-gray-600 mt-1">
                    {business.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Category</h3>
                    <p className="text-gray-600 mt-1">
                      {business.category?.name || "No category"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Plan Type</h3>
                    <Badge variant="outline">{business.planType}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Last Updated</h3>
                    <p className="text-gray-600 mt-1">
                      {new Date(business.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{business.email}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
                {(business.addressLine1 ||
                  business.city ||
                  business.country) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      {business.addressLine1 && (
                        <div>{business.addressLine1}</div>
                      )}
                      {business.addressLine2 && (
                        <div>{business.addressLine2}</div>
                      )}
                      <div>
                        {[business.city, business.state, business.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {business.owner.name || "Not provided"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {business.owner.email}
                  </div>
                  <div>
                    <span className="font-medium">Owner ID:</span>{" "}
                    {business.owner.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="space-y-6">
            <BusinessApproval
              business={business}
              onStatusChange={handleStatusChange}
            />

            {/* Reviews Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {business.reviews?.length || 0}
                </div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                {business.reviews && business.reviews.length > 0 && (
                  <div className="mt-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/reviews?business=${business.id}`}>
                        View All Reviews
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading business for admin:", error);
    notFound();
  }
}
