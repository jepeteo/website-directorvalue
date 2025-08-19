import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getSampleCategoryBySlug,
  getSampleBusinessesByCategory,
} from "@/lib/sample-data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getSampleCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "Category Not Found - Director Value",
    };
  }

  return {
    title: `${categoryData.name} - Director Value`,
    description: `Find ${categoryData.name.toLowerCase()} businesses on Director Value - Everything you need worldwide`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const { page = "1" } = await searchParams;

  const categoryData = getSampleCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  // Get businesses for this category
  const businesses = getSampleBusinessesByCategory(categoryData.id);

  // Simple pagination (for MVP)
  const pageSize = 12;
  const currentPage = parseInt(page);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBusinesses = businesses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(businesses.length / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">{categoryData.icon}</span>
            <h1 className="text-4xl font-bold">{categoryData.name}</h1>
          </div>

          {categoryData.description && (
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              {categoryData.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {businesses.length}{" "}
              {businesses.length === 1 ? "Business" : "Businesses"}
            </Badge>
            <Link href="/search">
              <Button variant="outline">Search All Categories</Button>
            </Link>
          </div>
        </div>

        {/* Businesses Grid */}
        {paginatedBusinesses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={{
                    ...business,
                    logo: business.logo,
                    category: categoryData.name,
                    rating: business.averageRating,
                    reviewCount: business.reviewCount,
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                {currentPage > 1 && (
                  <Link href={`/c/${category}?page=${currentPage - 1}`}>
                    <Button variant="outline">Previous</Button>
                  </Link>
                )}

                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Link
                        key={pageNum}
                        href={`/c/${category}?page=${pageNum}`}
                      >
                        <Button
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link href={`/c/${category}?page=${currentPage + 1}`}>
                    <Button variant="outline">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No businesses found</h2>
            <p className="text-muted-foreground mb-8">
              There are currently no businesses in this category.
            </p>
            <Link href="/search">
              <Button>Browse All Businesses</Button>
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="glass p-8 rounded-2xl border-0 shadow-modern-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Own a {categoryData.name} Business?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get your business listed on Director Value and reach thousands of
              potential customers.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="gradient-primary">
                List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
