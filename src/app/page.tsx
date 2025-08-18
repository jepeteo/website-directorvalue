import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchForm } from "@/components/search/search-form";
import { BusinessCard } from "@/components/business/business-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data for demonstration
const featuredBusinesses = [
  {
    id: "1",
    name: "Bella Vista Restaurant",
    slug: "bella-vista-restaurant",
    description:
      "Authentic Italian cuisine with a modern twist. Fresh pasta made daily and the finest ingredients imported from Italy.",
    logo: null,
    category: "restaurants",
    city: "Paris",
    country: "France",
    planType: "VIP" as const,
    rating: 4.8,
    reviewCount: 127,
    isOpen: true,
  },
  {
    id: "2",
    name: "TechFix Solutions",
    slug: "techfix-solutions",
    description:
      "Professional computer repair and IT support services for businesses and individuals. Same-day service available.",
    logo: null,
    category: "technology",
    city: "London",
    country: "United Kingdom",
    planType: "PRO" as const,
    rating: 4.6,
    reviewCount: 89,
    isOpen: true,
  },
  {
    id: "3",
    name: "Green Thumb Gardens",
    slug: "green-thumb-gardens",
    description:
      "Complete landscaping and garden design services. Transform your outdoor space into a beautiful oasis.",
    logo: null,
    category: "home-garden",
    city: "Berlin",
    country: "Germany",
    planType: "BASIC" as const,
    rating: 4.4,
    reviewCount: 56,
    isOpen: false,
  },
];

const categories = [
  {
    name: "Restaurants",
    slug: "restaurants",
    icon: "🍽️",
    count: "1,245",
    description: "Fine dining, cafes, and local eateries",
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    icon: "💼",
    count: "2,867",
    description: "Legal, accounting, consulting services",
  },
  {
    name: "Health & Medical",
    slug: "health-medical",
    icon: "🏥",
    count: "1,892",
    description: "Doctors, clinics, and wellness centers",
  },
  {
    name: "Retail & Shopping",
    slug: "retail-shopping",
    icon: "🛍️",
    count: "3,421",
    description: "Stores, boutiques, and shopping centers",
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    icon: "🏠",
    count: "1,567",
    description: "Contractors, landscaping, home improvement",
  },
  {
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
    count: "987",
    description: "Car repair, dealerships, and services",
  },
];

export default function HomePage() {
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
              with local professionals and find exactly what you're looking for.
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
            {categories.map((category) => (
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
                      {category.count} businesses
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
              Featured VIP Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated businesses that have earned our VIP status
              through exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/search">Browse All Businesses</Link>
            </Button>
          </div>
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
                10,000+
              </div>
              <div className="text-gray-600">Businesses Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Countries Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Monthly Searches</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
