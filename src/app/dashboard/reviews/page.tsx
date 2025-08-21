import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewsDashboard from "@/components/dashboard/reviews-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Search, MessageSquare } from "lucide-react";

// Component for visitors to write reviews
function VisitorReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Reviews</h1>
        <p className="text-muted-foreground">
          Write and manage reviews for businesses you&apos;ve visited
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Businesses to Review
            </CardTitle>
            <CardDescription>
              Search for businesses in your area and share your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/search">Browse Businesses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Your Review History
            </CardTitle>
            <CardDescription>
              View and manage reviews you&apos;ve written
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Write Reviews?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Help Others</h3>
              <p className="text-sm text-muted-foreground">
                Share your experience to help other customers make informed
                decisions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">Give Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Help businesses improve their services with constructive
                feedback
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Build Community</h3>
              <p className="text-sm text-muted-foreground">
                Contribute to a trusted community of local business reviews
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getReviewsData(userId: string) {
  try {
    // Get user's businesses with their reviews
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
            ownerResponse: {
              select: {
                content: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Flatten all reviews from all businesses
    const allReviews = businesses.flatMap((business) =>
      business.reviews.map((review) => {
        const reviewData: {
          id: string;
          businessName: string;
          reviewerName: string;
          rating: number;
          comment: string;
          date: string;
          status: "hidden" | "published" | "pending";
          helpful: number;
          reported: boolean;
          hasReply: boolean;
          reply?: string;
        } = {
          id: review.id,
          businessName: business.name,
          reviewerName: review.user.name || "Anonymous",
          rating: review.rating,
          comment: review.content || "",
          date: review.createdAt.toISOString().split("T")[0] || "Unknown",
          status: (review.isHidden ? "hidden" : "published") as
            | "hidden"
            | "published"
            | "pending",
          helpful: Math.floor(Math.random() * 20), // Mock helpful count
          reported: false, // Mock reported status
          hasReply: !!review.ownerResponse,
        };

        if (review.ownerResponse?.content) {
          reviewData.reply = review.ownerResponse.content;
        }

        return reviewData;
      })
    );

    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    // Calculate ratings breakdown
    const ratingsBreakdown = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length,
    };

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingsBreakdown,
      recentReviews: allReviews.slice(0, 10), // Show last 10 reviews
    };
  } catch (error) {
    console.error("Error fetching reviews data:", error);
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingsBreakdown: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      recentReviews: [],
    };
  }
}

export default async function ReviewsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userRole =
    (
      session.user as {
        role?:
          | "VISITOR"
          | "BUSINESS_OWNER"
          | "ADMIN"
          | "MODERATOR"
          | "FINANCE"
          | "SUPPORT";
      }
    )?.role || "VISITOR";

  // Different experiences based on user role
  if (userRole === "VISITOR") {
    return <VisitorReviewsPage />;
  }

  // Business owners and admins get the full review management dashboard
  const reviewsData = await getReviewsData(session.user.id);
  return <ReviewsDashboard initialData={reviewsData} />;
}
