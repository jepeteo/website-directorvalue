import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  CreditCard,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  Crown,
} from "lucide-react";

export default async function BillingPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Mock billing data - in production, this would come from Stripe/database
  const billingData = {
    currentPlan: {
      name: "Basic",
      price: 5.99,
      currency: "EUR",
      interval: "month",
      status: "active",
      trialEndsAt: null,
      nextBillDate: "2025-09-20",
      features: [
        "1 Business Listing",
        "Basic Analytics",
        "Email Support",
        "Standard Review Management",
      ],
    },
    paymentMethod: {
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2028,
    },
    invoices: [
      {
        id: "inv_001",
        date: "2025-08-20",
        amount: 5.99,
        currency: "EUR",
        status: "paid",
        downloadUrl: "#",
      },
      {
        id: "inv_002",
        date: "2025-07-20",
        amount: 5.99,
        currency: "EUR",
        status: "paid",
        downloadUrl: "#",
      },
      {
        id: "inv_003",
        date: "2025-06-20",
        amount: 5.99,
        currency: "EUR",
        status: "paid",
        downloadUrl: "#",
      },
    ],
    usage: {
      businessListings: 1,
      maxBusinessListings: 1,
      monthlyViews: 1247,
      monthlyClicks: 89,
    },
  };

  const plans = [
    {
      name: "Basic",
      price: 5.99,
      currency: "EUR",
      interval: "month",
      features: [
        "1 Business Listing",
        "Basic Analytics",
        "Email Support",
        "Standard Review Management",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: 19.99,
      currency: "EUR",
      interval: "month",
      features: [
        "5 Business Listings",
        "Advanced Analytics",
        "Priority Support",
        "Advanced Review Management",
        "Customer Insights",
        "SEO Tools",
      ],
      current: false,
      popular: true,
    },
    {
      name: "VIP",
      price: 49.99,
      currency: "EUR",
      interval: "month",
      features: [
        "Unlimited Business Listings",
        "Premium Analytics",
        "24/7 Phone Support",
        "AI-Powered Review Responses",
        "Advanced Customer Insights",
        "Premium SEO Tools",
        "Custom Branding",
        "API Access",
      ],
      current: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, billing, and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Current Plan</h2>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline space-x-2 mb-4">
              <h3 className="text-2xl font-bold">
                {billingData.currentPlan.name}
              </h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold">
                  €{billingData.currentPlan.price}
                </span>
                <span className="text-muted-foreground">
                  /{billingData.currentPlan.interval}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {billingData.currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Next billing date
              </span>
              <span className="text-sm font-medium">
                {new Date(
                  billingData.currentPlan.nextBillDate
                ).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Business listings
              </span>
              <span className="text-sm font-medium">
                {billingData.usage.businessListings} /{" "}
                {billingData.usage.maxBusinessListings}
              </span>
            </div>

            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Upgrade Plan
              </button>
              <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-lg border p-6 ${
                plan.current
                  ? "border-primary ring-2 ring-primary/20"
                  : plan.popular
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold">€{plan.price}</span>
                  <span className="text-muted-foreground">
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  plan.current
                    ? "bg-muted text-muted-foreground cursor-default"
                    : plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            Update
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-muted rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">
              •••• •••• •••• {billingData.paymentMethod.last4}
            </p>
            <p className="text-sm text-muted-foreground">
              {billingData.paymentMethod.brand.toUpperCase()} • Expires{" "}
              {billingData.paymentMethod.expiryMonth}/
              {billingData.paymentMethod.expiryYear}
            </p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Billing History</h2>
          <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>Date</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Invoice</div>
          </div>

          {billingData.invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="grid grid-cols-4 gap-4 text-sm py-3 border-b border-border/50"
            >
              <div className="font-medium">
                {new Date(invoice.date).toLocaleDateString()}
              </div>
              <div className="font-medium">€{invoice.amount.toFixed(2)}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div>
                <button className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trial Notice (if applicable) */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              30-Day Free Trial
            </h3>
            <p className="text-yellow-700 dark:text-yellow-200 mb-4">
              You're currently on a free trial. Your subscription will
              automatically start after the trial period ends unless you cancel.
            </p>
            <div className="flex space-x-3">
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Start Subscription Now
              </button>
              <button className="border border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Cancel Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
