import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Flag,
  AlertTriangle,
  Eye,
  EyeOff,
  Shield,
  MessageSquare,
  Building2,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Reports - Admin Dashboard",
  description: "Content moderation and reporting",
};

async function getReportsData() {
  try {
    const [
      totalReviews,
      hiddenReviews,
      flaggedBusinesses,
      suspendedBusinesses,
      recentReviews,
      recentBusinesses,
    ] = await Promise.all([
      // Total reviews
      prisma.review.count(),

      // Hidden reviews (our current moderation system)
      prisma.review.count({
        where: { isHidden: true },
      }),

      // Businesses that need review (pending/draft status)
      prisma.business.count({
        where: {
          status: {
            in: ["PENDING", "DRAFT"],
          },
        },
      }),

      // Suspended businesses
      prisma.business.count({
        where: { status: "SUSPENDED" },
      }),

      // Recent reviews that might need moderation
      prisma.review.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          business: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),

      // Recent businesses that need approval
      prisma.business.findMany({
        where: {
          status: {
            in: ["PENDING", "DRAFT"],
          },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      overview: {
        totalReviews,
        hiddenReviews,
        pendingBusinesses: flaggedBusinesses,
        suspendedBusinesses,
      },
      contentTypes: {
        reviews: totalReviews,
        businesses: flaggedBusinesses,
        hidden_reviews: hiddenReviews,
        suspended_businesses: suspendedBusinesses,
      },
      recentItems: {
        reviews: recentReviews,
        businesses: recentBusinesses,
      },
    };
  } catch (error) {
    console.error("Error fetching reports data:", error);
    return {
      overview: {
        totalReviews: 0,
        hiddenReviews: 0,
        pendingBusinesses: 0,
        suspendedBusinesses: 0,
      },
      contentTypes: {
        reviews: 0,
        businesses: 0,
        hidden_reviews: 0,
        suspended_businesses: 0,
      },
      recentItems: {
        reviews: [],
        businesses: [],
      },
    };
  }
}

export default async function AdminReportsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const reportsData = await getReportsData();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">
          Review and moderate platform content
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportsData.overview.totalReviews}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">All user reviews</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Hidden Reviews
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reportsData.overview.hiddenReviews}
              </p>
            </div>
            <EyeOff className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Moderated content</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Businesses
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reportsData.overview.pendingBusinesses}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Awaiting approval</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportsData.overview.suspendedBusinesses}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Suspended businesses</span>
          </div>
        </div>
      </div>

      {/* Content Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Content Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Reviews
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {reportsData.contentTypes.reviews} total
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Pending Businesses
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {reportsData.contentTypes.businesses} awaiting approval
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <EyeOff className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Hidden Reviews
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {reportsData.contentTypes.hidden_reviews} moderated
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Suspended
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {reportsData.contentTypes.suspended_businesses} businesses
              </span>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Reviews
          </h3>
          <div className="space-y-4">
            {reportsData.recentItems.reviews.length > 0 ? (
              reportsData.recentItems.reviews.map((review) => (
                <div key={review.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {review.isHidden ? (
                      <EyeOff className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      {review.rating}-star review for {review.business.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {review.user.name || review.user.email} •{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                      {review.isHidden && " • Hidden"}
                    </p>
                    {review.title && (
                      <p className="text-xs text-gray-600 mt-1">
                        &ldquo;{review.title}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent reviews</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Businesses */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Businesses Awaiting Approval
        </h3>
        <div className="space-y-4">
          {reportsData.recentItems.businesses.length > 0 ? (
            reportsData.recentItems.businesses.map((business) => (
              <div
                key={business.id}
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
              >
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{business.name}</p>
                    <p className="text-sm text-gray-600">
                      by {business.owner.name || business.owner.email} •{" "}
                      {business.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted{" "}
                      {new Date(business.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No businesses pending approval
            </p>
          )}
        </div>
      </div>

      {/* Future Reports System Notice */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-8">
        <div className="flex items-start space-x-3">
          <Flag className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Abuse Reporting System
            </h3>
            <p className="text-blue-700 mb-4">
              Full abuse reporting system with user reports, automated flagging,
              and comprehensive moderation tools will be implemented in the next
              phase.
            </p>
            <p className="text-sm text-blue-600">
              Current moderation is handled through manual review and admin
              controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
