import { redirect } from "next/navigation";

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;
  // Redirect to the new URL structure
  redirect(`/l/${resolvedParams.slug}`);
}
