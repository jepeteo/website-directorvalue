import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BusinessDetail } from "@/components/business/business-detail";

interface BusinessPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BusinessPageProps): Promise<Metadata> {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
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
    title: `${business.name} - ${business.category.name} | Director Value`,
    description: business.description.substring(0, 160),
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await prisma.business.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
      status: "APPROVED",
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

  return <BusinessDetail business={business} />;
}
