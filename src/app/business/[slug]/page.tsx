import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
  const business = await prisma.business.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
    },
  });

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
  const business = await prisma.business.findUnique({
    where: {
      slug: resolvedParams.slug,
      status: "ACTIVE",
    },
    include: {
      category: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  // Transform database fields to match component expectations
  const transformedBusiness = {
    ...business,
    description: business.description || "",
    address: business.addressLine1 || "",
    city: business.city || "",
    state: business.state || "",
    zipCode: business.postalCode || "",
    country: business.country || "",
    category: business.category
      ? {
          id: business.category.id,
          name: business.category.name,
        }
      : {
          id: "uncategorized",
          name: "Uncategorized",
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviews: business.reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.content || "",
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        name: review.user.name,
      },
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hours: business.workingHours as any, // Type assertion for JSON field
  };

  return <BusinessDetail business={transformedBusiness} />;
}
