import { Metadata } from "next";
import { SearchResults } from "@/components/search/search-results";

export const metadata: Metadata = {
  title: "Search Businesses - Director Value",
  description:
    "Find businesses worldwide on Director Value - Everything you need worldwide",
};

export default function SearchPage() {
  return <SearchResults />;
}
