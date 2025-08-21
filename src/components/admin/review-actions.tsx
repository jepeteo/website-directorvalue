"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReviewActionsProps {
  reviewId: string;
  isHidden: boolean;
  businessSlug: string;
}

export function ReviewActions({
  reviewId,
  isHidden,
  businessSlug,
}: ReviewActionsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleModerateReview = async (isHidden: boolean, reason?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isHidden,
          moderationReason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to moderate review");
      }

      toast({
        title: "Success",
        description: data.message,
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error moderating review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to moderate review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete review");
      }

      toast({
        title: "Success",
        description: data.message,
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* View business page */}
        <DropdownMenuItem asChild>
          <Link href={`/l/${businessSlug}`} target="_blank">
            <Eye className="h-4 w-4 mr-2" />
            View Business Page
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Hide/Show review */}
        {!isHidden ? (
          <DropdownMenuItem
            className="text-orange-600"
            onClick={() => handleModerateReview(true, "Hidden by admin")}
            disabled={isLoading}
          >
            <Flag className="h-4 w-4 mr-2" />
            Hide Review
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-green-600"
            onClick={() => handleModerateReview(false, "Approved by admin")}
            disabled={isLoading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Show Review
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Delete review */}
        <DropdownMenuItem
          className="text-red-600"
          onClick={handleDeleteReview}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
