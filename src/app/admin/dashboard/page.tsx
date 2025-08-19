import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BusinessApproval } from "@/components/admin/business-approval";
import { EmailTest } from "@/components/admin/email-test";
import {
  Building2,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface AdminAction {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: Date;
  admin: {
    name: string | null;
    email: string;
  };
}

interface BusinessForApproval {
  id: string;
  name: string;
  status:
    | "DRAFT"
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "REJECTED"
    | "DEACTIVATED";
  planType: string;
  createdAt: Date;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  category?: {
    name: string;
  } | null;
}

async function getPendingBusinesses() {
  return prisma.business.findMany({
    where: {
      status: {
        in: ["DRAFT", "PENDING"] as const,
      },
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

async function getAdminStats() {
  const [
    totalBusinesses,
    pendingBusinesses,
    activeBusinesses,
    totalUsers,
    totalReviews,
    recentActions,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({
      where: { status: { in: ["DRAFT", "PENDING"] as const } },
    }),
    prisma.business.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    prisma.review.count(),
    prisma.adminActionLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalBusinesses,
    pendingBusinesses,
    activeBusinesses,
    totalUsers,
    totalReviews,
    recentActions,
  };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const [stats, pendingBusinesses] = await Promise.all([
    getAdminStats(),
    getPendingBusinesses(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage businesses, users, and monitor platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeBusinesses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingBusinesses}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">User feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Businesses */}
      {stats.pendingBusinesses > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Businesses Pending Approval
              </CardTitle>
              <Badge variant="secondary">
                {stats.pendingBusinesses} pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingBusinesses.map((business) => (
                <BusinessApproval
                  key={business.id}
                  business={business as BusinessForApproval}
                  onStatusChange={() => {
                    // Trigger page refresh or state update
                    window.location.reload();
                  }}
                />
              ))}

              {pendingBusinesses.length === 10 && (
                <div className="text-center">
                  <Button asChild variant="outline">
                    <Link href="/admin/businesses">View All Pending</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Recent Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActions.map((action: AdminAction) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-sm text-muted-foreground">
                      By {action.admin.name || action.admin.email} •{" "}
                      {action.targetType} ID: {action.targetId}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(action.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent actions</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button asChild>
                <Link
                  href="/admin/businesses"
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Manage Businesses
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reviews" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Moderate Reviews
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email System Test */}
        <EmailTest />
      </div>
    </div>
  );
}
