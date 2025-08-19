import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getBusinessById } from "@/lib/business-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Edit,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  MessageSquare,
  Eye,
} from "lucide-react";

interface WorkingHoursType {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface BusinessPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const business = await getBusinessById(id);

    if (!business) {
      notFound();
    }

    // Check if the user owns this business
    if (business.ownerId !== session.user.id) {
      redirect("/dashboard/businesses");
    }

    const workingHours = business.workingHours as WorkingHoursType | null;

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {business.name}
            </h1>
            <p className="text-gray-600">
              {business.category?.name || "Uncategorized"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/l/${business.slug}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/businesses/${business.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Business
              </Link>
            </Button>
          </div>
        </div>

        {/* Status & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Badge
                  variant={
                    business.status === "ACTIVE" ? "default" : "secondary"
                  }
                  className="mb-2"
                >
                  {business.status}
                </Badge>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-yellow-500 mb-2">
                  <Star className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">
                    {business.reviews.length > 0
                      ? (
                          business.reviews.reduce(
                            (acc: number, review: { rating: number }) =>
                              acc + review.rating,
                            0
                          ) / business.reviews.length
                        ).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-blue-500 mb-2">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">
                    {business.reviews.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="flex items-center justify-center text-green-500 mb-2">
                  <Eye className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">0</span>
                </div>
                <p className="text-sm text-gray-600">Views</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {business.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600">{business.description}</p>
                </div>
              )}

              {business.addressLine1 && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{business.addressLine1}</p>
                    {business.addressLine2 && (
                      <p className="text-gray-900">{business.addressLine2}</p>
                    )}
                    <p className="text-gray-600">
                      {business.city}, {business.state} {business.postalCode}
                    </p>
                    <p className="text-gray-600">{business.country}</p>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <a
                    href={`tel:${business.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {business.phone}
                  </a>
                </div>
              )}

              {business.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <a
                    href={`mailto:${business.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {business.email}
                  </a>
                </div>
              )}

              {business.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
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
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Working Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workingHours ? (
                <div className="space-y-2">
                  {Object.entries(workingHours).map(
                    ([day, hours]: [
                      string,
                      { closed?: boolean; open?: string; close?: string }
                    ]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="capitalize font-medium text-gray-900">
                          {day}
                        </span>
                        <span className="text-gray-600">
                          {hours.closed
                            ? "Closed"
                            : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No working hours set</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        {business.reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {business.reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-current" : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.user.name || review.user.email}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.content && (
                      <p className="text-gray-600">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading business:", error);
    notFound();
  }
}
