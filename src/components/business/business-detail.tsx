"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { RatingDisplay } from "@/components/ui/rating-display";
import { LeadCaptureForm } from "@/components/leads/lead-capture-form";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Heart,
  Share2,
} from "lucide-react";

import { BusinessWithExtras } from "@/lib/business-service";

interface BusinessDetailProps {
  business: BusinessWithExtras;
}

export function BusinessDetail({ business }: BusinessDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [businessStats, setBusinessStats] = useState<{
    averageRating: number;
    totalReviews: number;
    distribution: Array<{ rating: number; count: number }>;
  } | null>(null);

  // Fetch business statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/business/${business.id}/stats`);
        if (response.ok) {
          const stats = await response.json();
          setBusinessStats(stats);
        }
      } catch (error) {
        console.error("Error fetching business stats:", error);
      }
    };

    fetchStats();
  }, [business.id, reviewRefreshTrigger]);

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger((prev) => prev + 1);
  };

  const formatAddress = () => {
    const parts = [
      business.addressLine1,
      business.city,
      business.state,
      business.postalCode,
      business.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const formatWorkingHours = () => {
    if (!business.workingHours) return null;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days
      .map((day, index) => {
        const hours = business.workingHours?.[day];
        if (!hours) return null;

        return (
          <div key={day} className="flex justify-between">
            <span className="font-medium">{dayNames[index]}</span>
            <span>
              {!hours || !hours.open || !hours.close
                ? "Closed"
                : `${hours.open} - ${hours.close}`}
            </span>
          </div>
        );
      })
      .filter(Boolean);
  };

  const getPlanBadge = () => {
    switch (business.planType) {
      case "VIP":
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
            ⭐ VIP Business
          </Badge>
        );
      case "PRO":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            💼 Pro Business
          </Badge>
        );
      case "BASIC":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-700 text-white">
            ✓ Verified Business
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="glass border-0 shadow-modern-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Logo */}
            {business.logo && (
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                  <Image
                    src={business.logo}
                    alt={`${business.name} logo`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Business Info */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">{business.name}</h1>
                  {getPlanBadge()}
                </div>

                {business.category && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{business.category.icon}</span>
                    <span>{business.category.name}</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {businessStats && businessStats.totalReviews > 0 && (
                <div className="space-y-3">
                  <RatingDisplay
                    rating={businessStats.averageRating}
                    totalReviews={businessStats.totalReviews}
                    size="lg"
                  />

                  {/* Rating Distribution */}
                  <div className="space-y-1">
                    {businessStats.distribution.map((item) => (
                      <div
                        key={item.rating}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="w-8 text-right">{item.rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                businessStats.totalReviews > 0
                                  ? (item.count / businessStats.totalReviews) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="w-8 text-gray-600">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {business.description}
              </p>

              {/* Tags */}
              {business.tags && business.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Services */}
          {business.services && business.services.length > 0 && (
            <Card className="glass border-0 shadow-modern">
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {business.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="glass border-0 shadow-modern">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews</CardTitle>
              <ReviewForm
                businessId={business.id}
                businessName={business.name}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </CardHeader>
            <CardContent>
              <ReviewsList
                businessId={business.id}
                refreshTrigger={reviewRefreshTrigger}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Capture Form - Only for VIP businesses */}
          {business.planType === "VIP" && (
            <Card className="glass border-0 shadow-modern border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Get a Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadCaptureForm
                  businessId={business.id}
                  businessName={business.name}
                  businessPlan={business.planType}
                  variant="inline"
                />
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card className="glass border-0 shadow-modern">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formatAddress() && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{formatAddress()}</p>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{business.phone}</p>
                  </div>
                </div>
              )}

              {business.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{business.email}</p>
                  </div>
                </div>
              )}

              {business.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          {business.workingHours && (
            <Card className="glass border-0 shadow-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">{formatWorkingHours()}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
