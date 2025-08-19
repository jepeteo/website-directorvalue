import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/business/business-form";
import { getCategories } from "@/lib/db";

export default async function NewBusinessPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Business
        </h1>
        <p className="text-gray-600">
          Create a new business listing to start receiving customers.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BusinessForm
          categories={categories}
          userId={session.user.id}
          mode="create"
        />
      </Suspense>
    </div>
  );
}
