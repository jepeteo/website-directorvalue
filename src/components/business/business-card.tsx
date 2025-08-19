import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logo?: string | null;
    category?: string;
    city?: string | null;
    country?: string | null;
    planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
    rating?: number;
    reviewCount?: number;
    isOpen?: boolean;
  };
  className?: string;
}

export function BusinessCard({ business, className }: BusinessCardProps) {
  const {
    name,
    slug,
    description,
    logo,
    category,
    city,
    country,
    planType,
    rating,
    reviewCount = 0,
    isOpen,
  } = business;

  const location = [city, country].filter(Boolean).join(", ");

  const getPlanBadge = () => {
    switch (planType) {
      case "VIP":
        return (
          <Badge
            variant="default"
            className="bg-gradient-to-r from-primary to-secondary text-white font-semibold border-0 shadow-sm"
          >
            ⭐ VIP
          </Badge>
        );
      case "PRO":
        return (
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground border-secondary"
          >
            Pro
          </Badge>
        );
      case "BASIC":
        return (
          <Badge
            variant="outline"
            className="border-border text-muted-foreground"
          >
            Basic
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 fill-gray-300"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <Card
      className={`overflow-hidden card-hover border-0 shadow-modern glass ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Business Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex-shrink-0 overflow-hidden shadow-inner">
            {logo ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            )}
          </div>

          {/* Business Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground truncate leading-tight">
                  {name}
                </h3>
                {category && (
                  <p className="text-sm text-muted-foreground capitalize font-medium">
                    {category}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getPlanBadge()}
                {isOpen !== undefined && (
                  <Badge
                    variant={isOpen ? "default" : "secondary"}
                    className={isOpen ? "bg-success hover:bg-success/90" : ""}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">{renderStars(rating)}</div>
                <span className="text-sm text-gray-600">
                  {rating.toFixed(1)} ({reviewCount} review
                  {reviewCount !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Location */}
            {location && (
              <p className="text-sm text-gray-500 mb-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </p>
            )}

            {/* Action Button */}
            <Button asChild variant="outline" className="w-full">
              <Link href={`/l/${slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
