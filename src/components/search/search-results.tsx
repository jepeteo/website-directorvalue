"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, Search, MapPin, Tag } from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  address: string;
  city: string;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  logoUrl: string | null;
  averageRating: number | null;
  totalReviews: number;
  planType: string;
  priceRange: number | null;
  tags: string[];
  status: string;
  createdAt: string;
}

interface SearchResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    query?: string;
    category?: string;
    location?: string;
    country?: string;
    city?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    openNow?: boolean;
    tags?: string;
    sortBy: string;
  };
}

const CATEGORIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Retail",
  "Food & Beverage",
  "Automotive",
  "Real Estate",
  "Legal",
  "Marketing",
  "Construction",
  "Entertainment",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Netherlands",
  "Spain",
  "Italy",
  "Belgium",
];

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

  // Form state
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [minRating, setMinRating] = useState(
    searchParams.get("minRating") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [openNow, setOpenNow] = useState(
    searchParams.get("openNow") === "true"
  );
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

  const performSearch = async () => {
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
  };

  const handleSearch = () => {
    updateURL({
      query,
      category,
      location,
      country,
      minRating,
      minPrice,
      maxPrice,
      openNow: openNow ? "true" : undefined,
      sortBy,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setLocation("");
    setCountry("");
    setMinRating("");
    setMinPrice("");
    setMaxPrice("");
    setOpenNow(false);
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
  }, [searchParams]);

  // Update form state when URL params change
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setCategory(searchParams.get("category") || "");
    setLocation(searchParams.get("location") || "");
    setCountry(searchParams.get("country") || "");
    setMinRating(searchParams.get("minRating") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setOpenNow(searchParams.get("openNow") === "true");
    setSortBy(searchParams.get("sortBy") || "relevance");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Search */}
              <div className="flex-1">
                <Label htmlFor="search-query" className="sr-only">
                  Search businesses
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search-query"
                    type="text"
                    placeholder="Search businesses..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Location Search */}
              <div className="flex-1 lg:max-w-xs">
                <Label htmlFor="search-location" className="sr-only">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search-location"
                    type="text"
                    placeholder="City, Country..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category */}
                  <div>
                    <Label htmlFor="filter-category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Country */}
                  <div>
                    <Label htmlFor="filter-country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="All countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All countries</SelectItem>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Rating */}
                  <div>
                    <Label htmlFor="filter-rating">Min Rating</Label>
                    <Select value={minRating} onValueChange={setMinRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any rating</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="2">2+ stars</SelectItem>
                        <SelectItem value="1">1+ stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label htmlFor="filter-sort">Sort By</Label>
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

                  {/* Price Range */}
                  <div>
                    <Label htmlFor="filter-min-price">Min Price (€)</Label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="filter-max-price">Max Price (€)</Label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                    />
                  </div>

                  {/* Open Now */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="filter-open-now"
                      checked={openNow}
                      onCheckedChange={(checked) =>
                        setOpenNow(checked === true)
                      }
                    />
                    <Label htmlFor="filter-open-now">Open now</Label>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleSearch}>Apply Filters</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : results ? (
          <div>
            {/* Results Summary */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {results.pagination.totalCount === 0
                  ? "No businesses found"
                  : `${results.pagination.totalCount} business${
                      results.pagination.totalCount === 1 ? "" : "es"
                    } found`}
              </h1>

              {/* Active Filters */}
              {(results.filters.query ||
                results.filters.category ||
                results.filters.location) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {results.filters.query && (
                    <Badge variant="secondary">
                      <Search className="h-3 w-3 mr-1" />
                      {results.filters.query}
                    </Badge>
                  )}
                  {results.filters.category && (
                    <Badge variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {results.filters.category}
                    </Badge>
                  )}
                  {results.filters.location && (
                    <Badge variant="secondary">
                      <MapPin className="h-3 w-3 mr-1" />
                      {results.filters.location}
                    </Badge>
                  )}
                  {results.filters.minRating && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      {results.filters.minRating}+ stars
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Business Grid */}
            {results.businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {results.businesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={{
                      id: business.id,
                      name: business.name,
                      slug: business.slug,
                      description: business.description,
                      logo: business.logoUrl,
                      category: business.category,
                      city: business.city,
                      country: business.country,
                      planType: business.planType as
                        | "FREE_TRIAL"
                        | "BASIC"
                        | "PRO"
                        | "VIP",
                      rating: business.averageRating || undefined,
                      reviewCount: business.totalReviews,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No businesses match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {/* Pagination */}
            {results.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => goToPage(results.pagination.page - 1)}
                  disabled={!results.pagination.hasPrev}
                >
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, results.pagination.totalPages) },
                    (_, i) => {
                      const pageNum = Math.max(
                        1,
                        Math.min(
                          results.pagination.page - 2 + i,
                          results.pagination.totalPages - 4 + i
                        )
                      );

                      if (pageNum > results.pagination.totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === results.pagination.page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => goToPage(results.pagination.page + 1)}
                  disabled={!results.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Enter a search term to find businesses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
