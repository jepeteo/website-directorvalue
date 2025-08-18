"use client";

import { useState } from "react";
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

interface SearchFormProps {
  className?: string;
  size?: "default" | "large";
}

export function SearchForm({ className, size = "default" }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", { query, category, location });
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
            <Input
              id="search"
              placeholder="e.g. restaurants, plumbers, dentists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={isLarge ? "h-12" : ""}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={isLarge ? "h-12" : ""}>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurants">Restaurants</SelectItem>
                <SelectItem value="retail">Retail & Shopping</SelectItem>
                <SelectItem value="services">Professional Services</SelectItem>
                <SelectItem value="health">Health & Medical</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="City, country..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={isLarge ? "h-12" : ""}
            />
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full ${isLarge ? "h-12 text-lg" : ""}`}
          size={isLarge ? "lg" : "default"}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search Businesses
        </Button>
      </form>
    </Card>
  );
}
