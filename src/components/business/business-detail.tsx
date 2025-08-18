import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Heart,
  Share2,
  Navigation,
} from "lucide-react";

interface BusinessDetailProps {
  business: {
    id: string;
    name: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    hours: any;
    category: {
      id: string;
      name: string;
    };
    owner: {
      id: string;
      name: string | null;
      email: string;
    };
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: Date;
      user: {
        id: string;
        name: string | null;
      };
    }>;
    _count: {
      reviews: number;
    };
  };
}

export function BusinessDetail({ business }: BusinessDetailProps) {
  const averageRating =
    business.reviews.length > 0
      ? business.reviews.reduce((sum, review) => sum + review.rating, 0) /
        business.reviews.length
      : 0;

  const formatHours = (hours: any) => {
    if (!hours) return {};
    return hours;
  };

  const currentDay = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][new Date().getDay()];
  const todayHours = formatHours(business.hours)[currentDay];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{business.name}</h1>
                <Badge variant="secondary">{business.category.name}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : "No reviews"}
                  </span>
                  <span>({business._count.reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {business.city}, {business.state}
                  </span>
                </div>

                {todayHours && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {todayHours.closed
                        ? "Closed today"
                        : `Open until ${todayHours.close}`}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed max-w-3xl">
                {business.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 lg:w-48">
              <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Hours */}
            {business.hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hours of Operation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(formatHours(business.hours)).map(
                      ([day, hours]: [string, any]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center"
                        >
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-muted-foreground">
                            {hours.closed
                              ? "Closed"
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
                <CardDescription>
                  {business._count.reviews} reviews with an average rating of{" "}
                  {averageRating.toFixed(1)} stars
                </CardDescription>
              </CardHeader>
              <CardContent>
                {business.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {business.reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.user.name || "Anonymous"}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <div className="border-t my-4" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet. Be the first to leave a review!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      {business.address}
                      <br />
                      {business.city}, {business.state} {business.zipCode}
                      <br />
                      {business.country}
                    </div>
                  </div>
                </div>

                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">
                        {business.phone}
                      </div>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">
                        {business.email}
                      </div>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Website</div>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Business
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
