import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ReviewsDashboard from "@/components/dashboard/reviews-dashboard";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Mock reviews data - in production, this would come from your database
  const reviewsData = {
    totalReviews: 47,
    averageRating: 4.2,
    ratingsBreakdown: {
      5: 22,
      4: 15,
      3: 6,
      2: 3,
      1: 1,
    },
    recentReviews: [
      {
        id: "1",
        businessName: "Café Central",
        reviewerName: "Sarah Johnson",
        rating: 5,
        comment:
          "I absolutely love this place. The coffee is exceptional and the staff is always friendly. Perfect spot for working or meeting friends.",
        date: "2025-08-15",
        status: "published" as const,
        helpful: 12,
        reported: false,
        hasReply: false,
      },
      {
        id: "2",
        businessName: "Tech Solutions Pro",
        reviewerName: "Mike Chen",
        rating: 4,
        comment:
          "They fixed my laptop quickly and the price was fair. Professional staff and good communication throughout the process.",
        date: "2025-08-14",
        status: "published" as const,
        helpful: 8,
        reported: false,
        hasReply: true,
        reply:
          "Thank you Mike! We're glad we could help get your laptop back up and running quickly.",
      },
      {
        id: "3",
        businessName: "Green Garden Restaurant",
        reviewerName: "Anonymous",
        rating: 2,
        comment:
          "Food took forever to arrive and was cold. Service was poor and overpriced for what we got.",
        date: "2025-08-13",
        status: "hidden" as const,
        helpful: 3,
        reported: true,
      },
      {
        id: "4",
        businessName: "AutoCare Garage",
        reviewerName: "Lisa Rodriguez",
        rating: 5,
        comment:
          "Finally found a garage I can trust! They explained everything clearly and didn't try to oversell services.",
        date: "2025-08-20",
        status: "pending" as const,
        helpful: 0,
        reported: false,
        hasReply: false,
      },
      {
        id: "5",
        businessName: "Bella Vista Hotel",
        reviewerName: "David Thompson",
        rating: 4,
        comment:
          "The hotel has a great location with stunning views. Rooms were clean and comfortable. Only minor issue was the WiFi was a bit slow.",
        date: "2025-08-12",
        status: "published" as const,
        helpful: 15,
        reported: false,
        hasReply: true,
        reply:
          "Thank you for your review David! We're working on upgrading our WiFi infrastructure. Hope to see you again soon!",
      },
    ],
  };

  return <ReviewsDashboard initialData={reviewsData} />;
}
