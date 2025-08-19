import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCategories } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Categories - Director Value",
  description:
    "Browse businesses by category on Director Value - Everything you need worldwide",
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  businessCount?: number;
}

export default async function CategoriesPage() {
  const categories: Category[] = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-600">
              Find the perfect business for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/c/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{category.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                      <div className="text-blue-600 font-medium">
                        {category.businessCount || 0} businesses
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
