import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSampleBusinessBySlug,
  getSampleCategoryById,
  getSampleReviewsByBusinessId,
} from "@/lib/sample-data";
import { BusinessDetail } from "@/components/business/business-detail-mvp";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const business = getSampleBusinessBySlug(resolvedParams.slug);

  if (!business) {
    return {
      title: "Business Not Found - Director Value",
    };
  }

  const category = business.categoryId
    ? getSampleCategoryById(business.categoryId)
    : null;

  return {
    title: `${business.name}${
      category ? ` - ${category.name}` : ""
    } | Director Value`,
    description:
      business.description?.substring(0, 160) ||
      `${business.name} business listing`,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;
  const business = getSampleBusinessBySlug(resolvedParams.slug);

  if (!business || business.status !== "ACTIVE") {
    notFound();
  }

  // Get category and reviews
  const category = business.categoryId
    ? getSampleCategoryById(business.categoryId)
    : null;
  const reviews = getSampleReviewsByBusinessId(business.id);

  // Prepare business data for component
  const businessWithExtras = {
    ...business,
    category,
    reviews,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <BusinessDetail business={businessWithExtras} />
      </div>
    </div>
  );
}
