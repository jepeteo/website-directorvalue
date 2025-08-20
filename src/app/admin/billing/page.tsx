import { Metadata } from "next";
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

export default function AdminBillingPage() {
  // Mock billing data - in production, this would come from Stripe/database
  const billingData = {
    overview: {
      totalRevenue: 45320,
      monthlyRecurring: 12480,
      activeSubscriptions: 342,
      churnRate: 2.3,
    },
    plans: {
      basic: { name: "Basic", price: 5.99, subscribers: 189, revenue: 1128.11 },
      pro: { name: "Pro", price: 19.99, subscribers: 98, revenue: 1959.02 },
      vip: { name: "VIP", price: 49.99, subscribers: 55, revenue: 2749.45 },
    },
    recentTransactions: [
      {
        id: "txn_001",
        customerName: "Sarah Johnson",
        plan: "Pro",
        amount: 19.99,
        status: "succeeded",
        date: "2025-08-20T14:30:00Z",
      },
      {
        id: "txn_002",
        customerName: "Mike Chen",
        plan: "Basic",
        amount: 5.99,
        status: "succeeded",
        date: "2025-08-20T13:45:00Z",
      },
      {
        id: "txn_003",
        customerName: "Lisa Rodriguez",
        plan: "VIP",
        amount: 49.99,
        status: "failed",
        date: "2025-08-20T12:15:00Z",
      },
      {
        id: "txn_004",
        customerName: "David Thompson",
        plan: "Pro",
        amount: 19.99,
        status: "pending",
        date: "2025-08-20T11:30:00Z",
      },
    ],
    failedPayments: [
      {
        id: "fail_001",
        customerName: "Anonymous User",
        plan: "Basic",
        amount: 5.99,
        reason: "Insufficient funds",
        date: "2025-08-19T16:20:00Z",
      },
      {
        id: "fail_002",
        customerName: "John Doe",
        plan: "Pro",
        amount: 19.99,
        reason: "Card expired",
        date: "2025-08-19T14:15:00Z",
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">
          Subscription and payment management
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
              <p className="text-sm text-green-600 mt-1">+12.5% this month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Recurring
              </p>
              <p className="text-2xl font-bold text-gray-900">
                €{billingData.overview.monthlyRecurring.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">Recurring revenue</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-green-600 mt-1">+8.3% this month</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {billingData.overview.churnRate}%
              </p>
              <p className="text-sm text-red-600 mt-1">-0.5% this month</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Plans Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Plans Overview</h2>
          <div className="space-y-4">
            {Object.values(billingData.plans).map((plan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500">€{plan.price}/month</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {plan.subscribers} subscribers
                  </p>
                  <p className="text-sm text-gray-500">
                    €{plan.revenue.toFixed(2)} revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-red-600">
            Failed Payments
          </h2>
          <div className="space-y-4">
            {billingData.failedPayments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {payment.customerName}
                  </h3>
                  <span className="text-sm font-medium text-red-600">
                    €{payment.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Plan: {payment.plan}</p>
                <p className="text-sm text-red-600">Reason: {payment.reason}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(payment.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingData.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1 capitalize">
                        {transaction.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
