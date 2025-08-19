import { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = {
  title: "Search Businesses - Director Value",
  description:
    "Find businesses worldwide on Director Value - Everything you need worldwide",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="container mx-auto px-4 py-8">Loading search...</div>
          }
        >
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
