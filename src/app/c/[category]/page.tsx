import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBusinessesByCategory } from "@/lib/business-service";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}

interface BusinessWithCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  city?: string | null;
  country?: string | null;
  logo?: string | null;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  createdAt: Date;
  category?: {
    name: string;
  } | null;
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const result = await getBusinessesByCategory({
    categorySlug: category,
    page: 1,
    limit: 1,
  });

  if (!result?.category) {
    return {
      title: "Category Not Found - Director Value",
    };
  }

  return {
    title: `${result.category.name} - Director Value`,
    description: `Find ${result.category.name.toLowerCase()} businesses on Director Value - Everything you need worldwide`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const { page = "1", sortBy = "relevance" } = await searchParams;

  const currentPage = parseInt(page);
  const result = await getBusinessesByCategory({
    categorySlug: category,
    page: currentPage,
    limit: 12,
    sortBy: sortBy as "relevance" | "rating" | "newest" | "reviews",
  });

  if (!result?.category) {
    notFound();
  }

  const { businesses, total, pages, hasNext, hasPrev } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{result.category.icon}</span>
              <h1 className="text-4xl font-bold">{result.category.name}</h1>
            </div>

            {result.category.description && (
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                {result.category.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {total} {total === 1 ? "Business" : "Businesses"}
              </Badge>
              <Link href="/search">
                <Button variant="outline">Search All Categories</Button>
              </Link>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-2">
              <Link
                href={`/c/${category}?page=${currentPage}&sortBy=relevance`}
              >
                <Button
                  variant={sortBy === "relevance" ? "default" : "outline"}
                  size="sm"
                >
                  Relevance
                </Button>
              </Link>
              <Link href={`/c/${category}?page=${currentPage}&sortBy=rating`}>
                <Button
                  variant={sortBy === "rating" ? "default" : "outline"}
                  size="sm"
                >
                  Rating
                </Button>
              </Link>
              <Link href={`/c/${category}?page=${currentPage}&sortBy=reviews`}>
                <Button
                  variant={sortBy === "reviews" ? "default" : "outline"}
                  size="sm"
                >
                  Most Reviews
                </Button>
              </Link>
              <Link href={`/c/${category}?page=${currentPage}&sortBy=newest`}>
                <Button
                  variant={sortBy === "newest" ? "default" : "outline"}
                  size="sm"
                >
                  Newest
                </Button>
              </Link>
            </div>
          </div>

          {/* Businesses Grid */}
          {businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {businesses.map((business: BusinessWithCategory) => (
                  <BusinessCard
                    key={business.id}
                    business={{
                      ...business,
                      category: business.category?.name || "",
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  {hasPrev && (
                    <Link
                      href={`/c/${category}?page=${
                        currentPage - 1
                      }&sortBy=${sortBy}`}
                    >
                      <Button variant="outline">Previous</Button>
                    </Link>
                  )}

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Link
                          key={pageNum}
                          href={`/c/${category}?page=${pageNum}&sortBy=${sortBy}`}
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

                  {hasNext && (
                    <Link
                      href={`/c/${category}?page=${
                        currentPage + 1
                      }&sortBy=${sortBy}`}
                    >
                      <Button variant="outline">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">
                No businesses found
              </h2>
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
                Own a {result.category.name} Business?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get your business listed on Director Value and reach thousands
                of potential customers.
              </p>
              <Link href="/pricing">
                <Button size="lg" className="gradient-primary">
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
