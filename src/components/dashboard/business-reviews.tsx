"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RatingDisplay } from "@/components/ui/rating-display";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Reply,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
  ownerResponse?: {
    id: string;
    content: string;
    createdAt: string;
  };
}

interface BusinessReviewsProps {
  businessId: string;
}

export function BusinessReviews({ businessId }: BusinessReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [businessId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/reviews/${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/dashboard/reviews/${businessId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
            response: responseText.trim(),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Response posted successfully",
        });
        setResponseText("");
        setRespondingTo(null);
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error("Failed to submit response");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="text-gray-600">
            Manage and respond to customer feedback
          </p>
        </div>
        <Badge variant="outline">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </Badge>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {review.user.name}
                        </span>
                        <RatingDisplay
                          rating={review.rating}
                          showReviewCount={false}
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {!review.ownerResponse && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRespondingTo(review.id)}
                        disabled={respondingTo === review.id}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Respond
                      </Button>
                    )}
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-semibold text-lg">{review.title}</h4>
                  )}

                  {/* Review Content */}
                  <p className="text-gray-700 leading-relaxed">
                    {review.content}
                  </p>

                  {/* Owner Response */}
                  {review.ownerResponse && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          Your Response
                        </span>
                        <span className="text-sm text-blue-600">
                          {new Date(
                            review.ownerResponse.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-blue-800">
                        {review.ownerResponse.content}
                      </p>
                    </div>
                  )}

                  {/* Response Form */}
                  {respondingTo === review.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold mb-3">
                        Respond to this review
                      </h5>
                      <Textarea
                        placeholder="Thank you for your feedback. We appreciate..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="mb-3"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={!responseText.trim() || submitting}
                          size="sm"
                        >
                          {submitting ? "Posting..." : "Post Response"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText("");
                          }}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't received any reviews for this business yet.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  💡 <strong>Tip:</strong> Encourage satisfied customers to
                  leave reviews
                </p>
                <p>📧 Send follow-up emails after service completion</p>
                <p>⭐ Provide excellent service to earn positive feedback</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
