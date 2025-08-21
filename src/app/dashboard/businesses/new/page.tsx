import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/business/business-form";
import { getCategories } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { RequireVipPlan } from "@/components/auth/role-guard";

export default async function NewBusinessPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user already has a business
  const existingBusinessCount = await prisma.business.count({
    where: {
      ownerId: session.user.id,
    },
  });

  // If user already has a business, require VIP plan for additional ones
  if (existingBusinessCount > 0) {
    return (
      <RequireVipPlan>
        <NewBusinessContent userId={session.user.id} />
      </RequireVipPlan>
    );
  }

  // First business - allow all business owners
  return <NewBusinessContent userId={session.user.id} />;
}

async function NewBusinessContent({ userId }: { userId: string }) {
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
        <BusinessForm categories={categories} userId={userId} mode="create" />
      </Suspense>
    </div>
  );
}
