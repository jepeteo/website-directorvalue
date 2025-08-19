import { Metadata } from "next";
import {
  getSampleCategories,
  getSampleBusinessesByCategory,
} from "@/lib/sample-data";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Categories - Director Value",
  description:
    "Browse businesses by category on Director Value - Everything you need worldwide",
};

export default async function CategoriesPage() {
  const categories = getSampleCategories();

  // Get business count for each category
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    businessCount: getSampleBusinessesByCategory(category.id).length,
  }));

  // Sort by business count (most popular first)
  categoriesWithCounts.sort((a, b) => b.businessCount - a.businessCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find the perfect business for your needs from our carefully curated
            categories
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="gradient-primary">
                <Search className="mr-2 h-5 w-5" />
                Search All Businesses
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <TrendingUp className="mr-2 h-5 w-5" />
                List Your Business
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categoriesWithCounts.map((category) => (
            <Link key={category.id} href={`/c/${category.slug}`}>
              <Card className="glass hover:shadow-modern-lg transition-all duration-300 cursor-pointer h-full border-0 group">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>

                      {category.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <Badge variant="secondary" className="font-medium">
                        {category.businessCount}{" "}
                        {category.businessCount === 1
                          ? "business"
                          : "businesses"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="glass p-8 rounded-2xl border-0 shadow-modern-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Director Value by the Numbers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {categoriesWithCounts.reduce(
                    (sum, cat) => sum + cat.businessCount,
                    0
                  )}
                </div>
                <p className="text-muted-foreground">Total Businesses</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {categoriesWithCounts.length}
                </div>
                <p className="text-muted-foreground">Categories</p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {
                    categoriesWithCounts.filter((cat) => cat.businessCount > 0)
                      .length
                  }
                </div>
                <p className="text-muted-foreground">Active Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="glass p-8 rounded-2xl border-0 shadow-modern-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of businesses already listed on Director Value and
              reach new customers today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="gradient-primary">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
