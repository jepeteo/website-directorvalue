import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { BusinessForm } from "@/components/business/business-form";
import { getCategories } from "@/lib/db";
import { getBusinessById } from "@/lib/business-service";

interface AdminEditBusinessPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditBusinessPage({
  params,
}: AdminEditBusinessPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  try {
    const [categories, business] = await Promise.all([
      getCategories(),
      getBusinessById(id),
    ]);

    if (!business) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Business (Admin)
          </h1>
          <p className="text-gray-600">
            Administrative edit for business: {business.name}
          </p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Admin Notice:</strong> You are editing this business as an
              administrator. Changes will be logged for audit purposes.
            </p>
          </div>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BusinessForm
            categories={categories}
            userId={business.ownerId}
            mode="edit"
            businessId={id}
            initialData={business}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading business for admin edit:", error);
    notFound();
  }
}
