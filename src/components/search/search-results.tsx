"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter } from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  images?: string[];
  services?: string[];
  tags?: string[];
  workingHours?: Record<
    string,
    { open?: string; close?: string; closed?: boolean }
  >;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  status: string;
  categoryId?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface SearchResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  categories: Category[];
  filters: {
    query?: string;
    category?: string;
    location?: string;
    sortBy: string;
  };
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "newest", label: "Newest First" },
  { value: "vip", label: "VIP First" },
];

export function SearchResults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form state for Phase 1 MVP
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "relevance"
  );

  const updateURL = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    // Always reset to page 1 when filters change
    newSearchParams.set("page", "1");

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSearch = () => {
    updateURL({
      query,
      category,
      location,
      sortBy,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setLocation("");
    setSortBy("relevance");
    router.push(pathname);
  };

  const goToPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  // Perform search when URL params change
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Update form state when URL params change
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setCategory(searchParams.get("category") || "");
    setLocation(searchParams.get("location") || "");
    setSortBy(searchParams.get("sortBy") || "relevance");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            {/* Main Search */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">What are you looking for?</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="e.g. restaurants, doctors, IT support..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category || "all"}
                    onValueChange={(value) =>
                      setCategory(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {results?.categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="e.g. New York, Los Angeles..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <div className="space-y-6 sticky top-8">
              <div>
                <h3 className="font-semibold mb-4">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(results?.filters.query ||
                results?.filters.category ||
                results?.filters.location) && (
                <div>
                  <h3 className="font-semibold mb-4">Active Filters</h3>
                  <div className="space-y-2">
                    {results.filters.query && (
                      <Badge variant="secondary" className="mr-2">
                        Search: {results.filters.query}
                      </Badge>
                    )}
                    {results.filters.category && (
                      <Badge variant="secondary" className="mr-2">
                        Category: {results.filters.category}
                      </Badge>
                    )}
                    {results.filters.location && (
                      <Badge variant="secondary" className="mr-2">
                        Location: {results.filters.location}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p>Searching...</p>
              </div>
            ) : results ? (
              <div>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    {results.pagination.totalCount} businesses found
                  </p>
                </div>

                {/* Business Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {results.businesses.map((business) => {
                    // Find category name
                    const businessCategory = results.categories.find(
                      (cat) => cat.id === business.categoryId
                    );

                    const businessData: {
                      id: string;
                      name: string;
                      slug: string;
                      description?: string | null;
                      logo?: string | null;
                      category?: string | { name: string } | null;
                      city?: string | null;
                      country?: string | null;
                      planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
                      rating?: number;
                      reviewCount?: number;
                    } = {
                      ...business,
                      logo: business.logo || null,
                      category: businessCategory?.name || null,
                    };

                    if (business.averageRating !== undefined) {
                      businessData.rating = business.averageRating;
                    }
                    if (business.reviewCount !== undefined) {
                      businessData.reviewCount = business.reviewCount;
                    }

                    return (
                      <BusinessCard key={business.id} business={businessData} />
                    );
                  })}
                </div>

                {/* Pagination */}
                {results.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => goToPage(results.pagination.page - 1)}
                      disabled={!results.pagination.hasPrevPage}
                    >
                      Previous
                    </Button>

                    <div className="flex space-x-2">
                      {Array.from(
                        { length: Math.min(5, results.pagination.totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                page === results.pagination.page
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => goToPage(page)}
                              size="sm"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => goToPage(results.pagination.page + 1)}
                      disabled={!results.pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>Enter a search term to find businesses.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
