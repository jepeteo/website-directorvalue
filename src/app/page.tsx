import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchForm } from "@/components/search/search-form";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinesses, getCategories, getBusinessStats } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  // Fetch real data from database
  const [businessesResult, categories, stats] = await Promise.all([
    getBusinesses({ limit: 6 }), // Get top 6 businesses for featured section
    getCategories(),
    getBusinessStats(),
  ]);

  const featuredBusinesses = businessesResult.businesses;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything you need{" "}
              <span className="text-blue-600">worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover trusted businesses and services in your area. Connect
              with local professionals and find exactly what you&apos;re looking
              for.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchForm size="large" />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our most popular business categories to find
              exactly what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category: any) => (
              <Link
                key={category.slug}
                href={`/c/${category.slug}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="text-blue-600 font-medium">
                      {category.businessCount} businesses
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated businesses that have earned recognition through
              exceptional service.
            </p>
          </div>

          {featuredBusinesses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBusinesses.map((business: any) => (
                  <BusinessCard
                    key={business.id}
                    business={{
                      id: business.id,
                      name: business.name,
                      slug: business.slug,
                      description: business.description,
                      logo: business.logo,
                      category: business.category?.name || "",
                      city: business.city,
                      country: business.country,
                      planType: business.planType,
                      rating: business.averageRating,
                      reviewCount: business.reviewCount,
                    }}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <Link href="/search">Browse All Businesses</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-8">
                No businesses found. Be the first to list your business!
              </p>
              <Button asChild size="lg">
                <Link href="/dashboard">Add Your Business</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to grow your business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Director Value to connect
            with customers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Add Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.activeBusinesses.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {categories.length}+
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalReviews.toLocaleString()}+
              </div>
              <div className="text-gray-600">Customer Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.vipBusinesses}
              </div>
              <div className="text-gray-600">VIP Businesses</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
