import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Flag,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Mock reviews data - in production, this would come from your database
  const reviewsData = {
    totalReviews: 23,
    averageRating: 4.2,
    ratingsBreakdown: {
      5: 12,
      4: 6,
      3: 3,
      2: 1,
      1: 1,
    },
    recentReviews: [
      {
        id: "1",
        businessName: "Tech Solutions Pro",
        reviewerName: "Sarah Johnson",
        rating: 5,
        comment:
          "Excellent service! The team was professional and delivered exactly what we needed. Highly recommend!",
        date: "2025-08-19",
        status: "published",
        helpful: 3,
        reported: false,
      },
      {
        id: "2",
        businessName: "Digital Marketing Hub",
        reviewerName: "Mike Chen",
        rating: 4,
        comment:
          "Good experience overall. The project was completed on time and the results were satisfactory.",
        date: "2025-08-17",
        status: "published",
        helpful: 1,
        reported: false,
      },
      {
        id: "3",
        businessName: "Creative Design Studio",
        reviewerName: "Emma Wilson",
        rating: 5,
        comment:
          "Amazing creativity and attention to detail. The designs exceeded our expectations!",
        date: "2025-08-15",
        status: "published",
        helpful: 5,
        reported: false,
      },
      {
        id: "4",
        businessName: "Web Development Co",
        reviewerName: "Alex Rodriguez",
        rating: 3,
        comment:
          "The service was okay, but there were some delays in communication. The final result was decent.",
        date: "2025-08-14",
        status: "published",
        helpful: 0,
        reported: true,
      },
    ],
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reviews Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage reviews for all your businesses
        </p>
      </div>

      {/* Reviews Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Reviews</h3>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{reviewsData.totalReviews}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Across all your businesses
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Average Rating</h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-3xl font-bold">{reviewsData.averageRating}</p>
            {renderStars(Math.round(reviewsData.averageRating))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on all reviews
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {Object.entries(reviewsData.ratingsBreakdown)
              .reverse()
              .map(([stars, count]) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(count / reviewsData.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-6">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Businesses</option>
          <option value="tech-solutions">Tech Solutions Pro</option>
          <option value="digital-marketing">Digital Marketing Hub</option>
          <option value="creative-design">Creative Design Studio</option>
        </select>
        <select className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Reviews</h2>

        {reviewsData.recentReviews.map((review) => (
          <div
            key={review.id}
            className={`bg-card rounded-lg border p-6 ${
              review.reported ? "border-red-200 dark:border-red-800" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold">{review.businessName}</h3>
                  {review.reported && (
                    <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                      <Flag className="h-4 w-4" />
                      <span className="text-sm">Reported</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>By {review.reviewerName}</span>
                  <span>•</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                  <span>•</span>
                  {renderStars(review.rating)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-foreground mb-4 leading-relaxed">
              {review.comment}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{review.helpful} helpful</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                  Reply
                </button>
                {review.reported && (
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    Review Report
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
          Advanced Review Management
        </h3>
        <p className="text-purple-700 dark:text-purple-200 mb-4">
          Upgrade to Pro or VIP to access automated review responses, sentiment
          analysis, and advanced moderation tools.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
