"use client";

import { useState, useEffect } from "react";
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

import { getCategories, type CategoryWithCount } from "@/lib/business-service";

interface SearchFormProps {
  className?: string;
  size?: "default" | "large";
}

export function SearchForm({ className, size = "default" }: SearchFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

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
    <Card className={`border-0 shadow-modern-lg glass ${className}`}>
      <form onSubmit={handleSearch} className="space-y-6 p-8">
        <div
          className={`grid gap-6 ${
            isLarge ? "md:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"
          }`}
        >
          <div className="space-y-3">
            <label
              htmlFor="search"
              className="text-sm font-semibold text-foreground"
            >
              What are you looking for?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="search"
                placeholder="e.g. restaurants, plumbers, dentists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${
                  isLarge ? "h-14 text-lg" : "h-12"
                } pl-12 border-2 border-border focus:border-accent rounded-xl transition-all duration-200 bg-card`}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-foreground"
            >
              Category
            </label>
            <Select
              value={category || "all"}
              onValueChange={(value) =>
                setCategory(value === "all" ? "" : value)
              }
            >
              <SelectTrigger
                className={`${
                  isLarge ? "h-14" : "h-12"
                } border-2 border-border focus:border-accent rounded-xl bg-card`}
              >
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="border-2 border-border rounded-xl">
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.icon && `${cat.icon} `}
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="location"
              className="text-sm font-semibold text-foreground"
            >
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                id="location"
                placeholder="City, country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${
                  isLarge ? "h-14 text-lg" : "h-12"
                } pl-12 border-2 border-border focus:border-accent rounded-xl transition-all duration-200 bg-card`}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full ${
            isLarge ? "h-14 text-lg" : "h-12"
          } gradient-teal hover:opacity-90 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-white`}
          size={isLarge ? "lg" : "default"}
        >
          <Search className="w-5 h-5 mr-2" />
          Search Businesses
        </Button>
      </form>
    </Card>
  );
}
