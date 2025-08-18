"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, RotateCcw, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function ReviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [business, setBusiness] = useState(searchParams.get("business") || "");
  const [createdAfter, setCreatedAfter] = useState(
    searchParams.get("createdAfter") || ""
  );
  const [createdBefore, setCreatedBefore] = useState(
    searchParams.get("createdBefore") || ""
  );

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (rating) params.set("rating", rating);
    if (status) params.set("status", status);
    if (business) params.set("business", business);
    if (createdAfter) params.set("createdAfter", createdAfter);
    if (createdBefore) params.set("createdBefore", createdBefore);

    router.push(`/admin/reviews?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setRating("");
    setStatus("");
    setBusiness("");
    setCreatedAfter("");
    setCreatedBefore("");
    router.push("/admin/reviews");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Reviews</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search content, user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger>
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All ratings</SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    5 stars
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    4 stars
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    3 stars
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    2 stars
                  </div>
                </SelectItem>
                <SelectItem value="1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    1 star
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="FLAGGED">Flagged</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Business Filter */}
          <div className="space-y-2">
            <Label htmlFor="business">Business</Label>
            <Input
              id="business"
              placeholder="Business name"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="createdAfter">From Date</Label>
            <Input
              id="createdAfter"
              type="date"
              value={createdAfter}
              onChange={(e) => setCreatedAfter(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="createdBefore">To Date</Label>
            <Input
              id="createdBefore"
              type="date"
              value={createdBefore}
              onChange={(e) => setCreatedBefore(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center space-x-2 mt-4">
          <Button onClick={handleFilter} size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
