import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getBusinessBySlug } from "@/lib/business-service";
import { BusinessDetail } from "@/components/business/business-detail";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const business = await getBusinessBySlug(resolvedParams.slug);

  if (!business) {
    return {
      title: "Business Not Found - Director Value",
    };
  }

  return {
    title: `${business.name}${
      business.category ? ` - ${business.category.name}` : ""
    } | Director Value`,
    description:
      business.description?.substring(0, 160) ||
      `${business.name} business listing`,
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;
  const business = await getBusinessBySlug(resolvedParams.slug);

  if (!business || business.status !== "ACTIVE") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      <main>
        <div className="container mx-auto px-4 py-8">
          <BusinessDetail business={business} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
