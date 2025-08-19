import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchForm } from "@/components/search/search-form";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinesses, getCategories, getBusinessStats } from "@/lib/db";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  businessCount?: number;
}

interface FeaturedBusiness {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo?: string | null;
  city?: string;
  country?: string;
  planType: "VIP" | "FREE_TRIAL" | "BASIC" | "PRO";
  averageRating: number;
  reviewCount: number;
  category?: {
    name: string;
  };
}

export default async function HomePage() {
  // Fetch real data from database
  const [businessesResult, categories, stats] = await Promise.all([
    getBusinesses({ limit: 6 }), // Get top 6 businesses for featured section
    getCategories(),
    getBusinessStats(),
  ]);

  const featuredBusinesses = businessesResult.businesses;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-secondary/10"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-foreground">
              Everything you need{" "}
              <span className="gradient-text">worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover trusted businesses and services in your area. Connect
              with local professionals and find exactly what you&apos;re looking
              for.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchForm size="large" />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.totalBusinesses.toLocaleString()}+
              </div>
              <div className="text-muted-foreground">Trusted Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stats.totalReviews.toLocaleString()}+
              </div>
              <div className="text-muted-foreground">Customer Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {categories.length}+
              </div>
              <div className="text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Explore Popular <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Browse through our most popular business categories to find
              exactly what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.slice(0, 6).map((category: Category) => (
              <Link
                key={category.slug}
                href={`/c/${category.slug}`}
                className="group"
              >
                <Card className="h-full card-hover border-0 shadow-modern bg-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-accent font-medium bg-accent/10 px-4 py-2 rounded-full">
                      <span>{category.businessCount} businesses</span>
                      <svg
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Featured <span className="gradient-text">Businesses</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover top-rated businesses that have earned recognition through
              exceptional service and customer satisfaction.
            </p>
          </div>

          {featuredBusinesses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredBusinesses.map((business: FeaturedBusiness) => (
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
      <section className="relative py-24 overflow-hidden">
        {/* Background with professional navy gradient */}
        <div className="absolute inset-0 gradient-navy"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
            Ready to grow your <span className="text-accent">business?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100 leading-relaxed">
            Join thousands of businesses already using Director Value to connect
            with customers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary hover:bg-accent/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Link href="/dashboard">Add Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom Stats Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                {stats.activeBusinesses.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">
                Active Businesses
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-3 group-hover:scale-110 transition-transform duration-300">
                {categories.length}+
              </div>
              <div className="text-muted-foreground font-medium">
                Categories
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                {stats.totalReviews.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">
                Customer Reviews
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                {stats.vipBusinesses}
              </div>
              <div className="text-muted-foreground font-medium">
                VIP Businesses
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
