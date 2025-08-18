"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";

interface SearchFormProps {
  className?: string;
  size?: "default" | "large";
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

export function SearchForm({ className, size = "default" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build search params
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (category) params.set("category", category);
    if (location.trim()) params.set("location", location.trim());

    // Navigate to search page
    const searchUrl = `/search${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(searchUrl);
  };

  const isLarge = size === "large";

  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div
          className={`grid gap-4 ${
            isLarge ? "md:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              What are you looking for?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="e.g. restaurants, plumbers, dentists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${isLarge ? "h-12" : ""} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={category || "all"}
              onValueChange={(value) =>
                setCategory(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className={isLarge ? "h-12" : ""}>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="location"
                placeholder="City, country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${isLarge ? "h-12" : ""} pl-10`}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full ${isLarge ? "h-12 text-lg" : ""}`}
          size={isLarge ? "lg" : "default"}
        >
          <Search className="w-4 h-4 mr-2" />
          Search Businesses
        </Button>
      </form>
    </Card>
  );
}
