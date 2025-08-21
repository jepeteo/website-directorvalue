import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReviewsDashboard from "@/components/dashboard/reviews-dashboard";

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
      business.reviews.map((review) => ({
        id: review.id,
        businessName: business.name,
        reviewerName: review.user.name || "Anonymous",
        rating: review.rating,
        comment: review.content || "",
        date: review.createdAt.toISOString().split("T")[0],
        status: (review.isHidden ? "hidden" : "published") as
          | "hidden"
          | "published"
          | "pending",
        helpful: Math.floor(Math.random() * 20), // Mock helpful count
        reported: false, // Mock reported status
        hasReply: !!review.ownerResponse,
        reply: review.ownerResponse?.content || undefined,
      }))
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

  const reviewsData = await getReviewsData(session.user.id);

  return <ReviewsDashboard initialData={reviewsData} />;
}
