"use client";

import { useState } from "react";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Flag,
  MoreHorizontal,
  Search,
  Send,
} from "lucide-react";

interface Review {
  id: string;
  businessName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "pending" | "hidden";
  helpful: number;
  reported: boolean;
  hasReply?: boolean;
  reply?: string;
}

interface ReviewsData {
  totalReviews: number;
  averageRating: number;
  ratingsBreakdown: Record<number, number>;
  recentReviews: Review[];
}

interface ReviewsDashboardProps {
  initialData: ReviewsData;
}

export default function ReviewsDashboard({
  initialData,
}: ReviewsDashboardProps) {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Filter reviews based on search and filters
  const filteredReviews = data.recentReviews.filter((review) => {
    const matchesSearch =
      searchQuery === "" ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.businessName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBusiness =
      selectedBusiness === "" || review.businessName === selectedBusiness;
    const matchesRating =
      selectedRating === "" || review.rating.toString() === selectedRating;

    return matchesSearch && matchesBusiness && matchesRating;
  });

  const businesses = Array.from(
    new Set(data.recentReviews.map((r) => r.businessName))
  );

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

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);

    // Simulate API call
    setTimeout(() => {
      setData((prevData) => ({
        ...prevData,
        recentReviews: prevData.recentReviews.map((review) =>
          review.id === reviewId
            ? { ...review, hasReply: true, reply: replyText }
            : review
        ),
      }));

      setReplyingTo(null);
      setReplyText("");
      setIsSubmittingReply(false);
    }, 1000);
  };

  const handleMarkHelpful = (reviewId: string) => {
    setData((prevData) => ({
      ...prevData,
      recentReviews: prevData.recentReviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ),
    }));
  };

  const handleHideReview = (reviewId: string) => {
    setData((prevData) => ({
      ...prevData,
      recentReviews: prevData.recentReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: review.status === "hidden" ? "published" : "hidden",
            }
          : review
      ),
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBusiness("");
    setSelectedRating("");
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
          <p className="text-3xl font-bold">{data.totalReviews}</p>
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
            <p className="text-3xl font-bold">{data.averageRating}</p>
            {renderStars(Math.round(data.averageRating))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on all reviews
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {Object.entries(data.ratingsBreakdown)
              .reverse()
              .map(([stars, count]) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${(count / data.totalReviews) * 100}%`,
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Businesses</option>
            {businesses.map((business) => (
              <option key={business} value={business}>
                {business}
              </option>
            ))}
          </select>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {(searchQuery || selectedBusiness || selectedRating) && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReviews.length} of {data.recentReviews.length}{" "}
              reviews
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Reviews</h2>

        {filteredReviews.length === 0 ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedBusiness || selectedRating
                ? "Try adjusting your filters to see more reviews."
                : "You don't have any reviews yet."}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-card rounded-lg border p-6 transition-all ${
                review.reported ? "border-red-200 dark:border-red-800" : ""
              } ${review.status === "hidden" ? "opacity-60" : ""}`}
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
                    {review.status === "hidden" && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                        Hidden
                      </span>
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

              {/* Reply Section */}
              {review.hasReply && review.reply && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4 border-l-4 border-primary">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-primary">
                      Your Reply:
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{review.reply}</p>
                </div>
              )}

              {replyingTo === review.id && (
                <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReply(review.id)}
                      disabled={isSubmittingReply || !replyText.trim()}
                      className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingReply ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful} helpful</span>
                  </button>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      review.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : review.status === "hidden"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {!review.hasReply && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Reply
                    </button>
                  )}
                  <button
                    onClick={() => handleHideReview(review.id)}
                    className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                      review.status === "hidden"
                        ? "border-green-200 text-green-800 dark:border-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                        : "border-gray-200 text-gray-800 dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                    }`}
                  >
                    {review.status === "hidden" ? "Show" : "Hide"}
                  </button>
                  {review.reported && (
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                      Review Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
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
