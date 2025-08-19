import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchForm } from "@/components/search/search-form";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeaturedBusinesses,
  getCategories,
  getBusinessStats,
  CategoryWithCount,
} from "@/lib/business-service";
import Link from "next/link";

interface FeaturedBusiness {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  city?: string | null;
  country?: string | null;
  planType: "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";
  rating?: number;
  reviewCount?: number;
  category?: {
    name: string;
  } | null;
}

export default async function HomePage() {
  // Fetch real data from database
  const [featuredBusinesses, categories, stats] = await Promise.all([
    getFeaturedBusinesses(6), // Get top 6 VIP businesses for featured section
    getCategories(),
    getBusinessStats(),
  ]);

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
                {stats.reviews.toLocaleString()}+
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
            {categories.slice(0, 6).map((category: CategoryWithCount) => (
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
                      <span>{category._count.businesses} businesses</span>
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
                      rating: business.rating,
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
        {/* Background with professional gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
              Ready to
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
                {" "}
                transform
              </span>
              <br />
              your business?
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-blue-100 leading-relaxed">
              Join over{" "}
              <span className="font-semibold text-accent">
                10,000 successful businesses
              </span>{" "}
              already using Director Value to attract new customers and
              accelerate growth worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <Link href="/pricing" className="flex items-center gap-2">
                  <span>🚀 Start Free Trial</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <Link href="/dashboard/businesses/new">Add Your Business</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white/90 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">30-day free trial</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">No credit card</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Setup in minutes</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
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
                {stats.reviews.toLocaleString()}+
              </div>
              <div className="text-muted-foreground font-medium">
                Customer Reviews
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                {stats.activeBusinesses}
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
