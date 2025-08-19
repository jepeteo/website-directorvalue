import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { getBusinesses, getCategoryBySlug } from "@/lib/db";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);

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

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  averageRating: number;
  reviewCount: number;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  category: {
    name: string;
  };
  city?: string;
  country?: string;
  logoUrl?: string | null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const result = await getBusinesses({
    category,
    page: currentPage,
    limit: 12,
  });

  const { businesses, pagination } = result;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{categoryData.icon}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {categoryData.name}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {categoryData.description}
            </p>
            <p className="text-gray-500">{pagination.total} businesses found</p>
          </div>

          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-gray-700">
              Categories
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{categoryData.name}</span>
          </nav>

          {/* Business Listings */}
          {businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {businesses.map((business: Business) => (
                  <BusinessCard
                    key={business.id}
                    business={{
                      ...business,
                      category: business.category.name,
                      rating: business.averageRating,
                      logo: business.logoUrl,
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  {currentPage > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/c/${category}?page=${currentPage - 1}`}>
                        Previous
                      </Link>
                    </Button>
                  )}

                  <span className="text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  {currentPage < pagination.pages && (
                    <Button variant="outline" asChild>
                      <Link href={`/c/${category}?page=${currentPage + 1}`}>
                        Next
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No businesses found
              </h2>
              <p className="text-gray-600 mb-8">
                Be the first to list your business in this category!
              </p>
              <Button asChild>
                <Link href="/pricing">List Your Business</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
