import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Billing - Admin Dashboard",
  description: "Subscriptions and payment management",
};

async function getAdminBilling() {
  try {
    const [
      totalBusinesses,
      basicSubscribers,
      proSubscribers,
      vipSubscribers,
      trialUsers,
      recentSubscriptions,
    ] = await Promise.all([
      // Total businesses
      prisma.business.count(),

      // Basic plan subscribers
      prisma.business.count({
        where: { planType: "BASIC" },
      }),

      // Pro plan subscribers
      prisma.business.count({
        where: { planType: "PRO" },
      }),

      // VIP plan subscribers
      prisma.business.count({
        where: { planType: "VIP" },
      }),

      // Trial users (businesses with trialEndsAt in the future)
      prisma.business.count({
        where: {
          trialEndsAt: {
            gt: new Date(),
          },
        },
      }),

      // Recent subscription changes (last 10)
      prisma.business.findMany({
        where: {
          planType: {
            in: ["BASIC", "PRO", "VIP"],
          },
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      }),
    ]);

    // Calculate plan pricing (correct pricing)
    const plans = {
      basic: {
        name: "Basic",
        price: 5.99,
        subscribers: basicSubscribers,
        revenue: Number((basicSubscribers * 5.99).toFixed(2)),
      },
      pro: {
        name: "Pro",
        price: 12.99,
        subscribers: proSubscribers,
        revenue: Number((proSubscribers * 12.99).toFixed(2)),
      },
      vip: {
        name: "VIP",
        price: 19.99,
        subscribers: vipSubscribers,
        revenue: Number((vipSubscribers * 19.99).toFixed(2)),
      },
    };

    const totalRevenue =
      plans.basic.revenue + plans.pro.revenue + plans.vip.revenue;
    const activeSubscriptions =
      basicSubscribers + proSubscribers + vipSubscribers;
    const churnRate = 0; // Will implement when we have subscription history

    return {
      overview: {
        totalRevenue,
        monthlyRecurring: totalRevenue, // Assuming monthly billing
        activeSubscriptions,
        churnRate,
        trialUsers,
      },
      plans,
      recentSubscriptions,
    };
  } catch (error) {
    console.error("Error fetching admin billing:", error);
    return {
      overview: {
        totalRevenue: 0,
        monthlyRecurring: 0,
        activeSubscriptions: 0,
        churnRate: 0,
        trialUsers: 0,
      },
      plans: {
        basic: { name: "Basic", price: 5.99, subscribers: 0, revenue: 0 },
        pro: { name: "Pro", price: 12.99, subscribers: 0, revenue: 0 },
        vip: { name: "VIP", price: 19.99, subscribers: 0, revenue: 0 },
      },
      recentSubscriptions: [],
    };
  }
}

export default async function AdminBillingPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const billingData = await getAdminBilling();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">
          Subscription management and revenue tracking
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                €{billingData.overview.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Monthly recurring</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Subscriptions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {billingData.overview.activeSubscriptions}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Paying customers</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trial Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {billingData.overview.trialUsers}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">30-day trials</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {billingData.overview.churnRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Track with Stripe</span>
          </div>
        </div>
      </div>

      {/* Plan Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Plan Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Basic Plan</p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.basic.price}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {billingData.plans.basic.subscribers}
                </p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.basic.revenue}/mo
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Pro Plan</p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.pro.price}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {billingData.plans.pro.subscribers}
                </p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.pro.revenue}/mo
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">VIP Plan</p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.vip.price}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {billingData.plans.vip.subscribers}
                </p>
                <p className="text-sm text-gray-600">
                  €{billingData.plans.vip.revenue}/mo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Subscriptions
          </h3>
          <div className="space-y-4">
            {billingData.recentSubscriptions.length > 0 ? (
              billingData.recentSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {subscription.owner.name || subscription.owner.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {subscription.name} • {subscription.planType} Plan
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €
                      {billingData.plans[
                        subscription.planType.toLowerCase() as keyof typeof billingData.plans
                      ]?.price || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(subscription.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No recent subscription activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Integration Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Stripe Integration</p>
              <p className="text-sm text-gray-600">Configuration pending</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Plan Structure</p>
              <p className="text-sm text-gray-600">Correctly configured</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Trial System</p>
              <p className="text-sm text-gray-600">Active and tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
