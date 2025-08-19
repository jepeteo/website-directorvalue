import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BusinessForm } from "@/components/business/business-form";
import { getCategories } from "@/lib/db";
import { getBusinessById } from "@/lib/business-service";

interface EditBusinessPageProps {
  params: {
    id: string;
  };
}

export default async function EditBusinessPage({
  params,
}: EditBusinessPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  try {
    const [categories, business] = await Promise.all([
      getCategories(),
      getBusinessById(params.id),
    ]);

    if (!business) {
      notFound();
    }

    // Check if the user owns this business
    if (business.ownerId !== session.user.id) {
      redirect("/dashboard/businesses");
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Business
          </h1>
          <p className="text-gray-600">
            Update your business information to keep customers informed.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BusinessForm
            categories={categories}
            userId={session.user.id}
            mode="edit"
            businessId={params.id}
            initialData={business}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading business:", error);
    notFound();
  }
}
