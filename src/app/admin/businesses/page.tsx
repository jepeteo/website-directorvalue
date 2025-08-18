import { Suspense } from "react";
import { BusinessTable } from "@/components/admin/business-table";
import { BusinessFilters } from "@/components/admin/business-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  search?: string;
  status?: string;
  plan?: string;
  category?: string;
  page?: string;
  limit?: string;
}

export default function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all business listings on the platform
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button asChild>
            <Link href="/admin/businesses/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <BusinessFilters />
        </CardContent>
      </Card>

      {/* Business Table */}
      <Card>
        <CardHeader>
          <CardTitle>Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading businesses...</div>}>
            <BusinessTable searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
