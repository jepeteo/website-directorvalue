"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Check,
} from "lucide-react";

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    currency: string;
    interval: string;
    status: string;
    trialEndsAt: string | null;
    nextBillDate: string | null;
    features: string[];
  };
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  } | null;
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: string;
    downloadUrl: string;
  }>;
  usage: {
    businessListings: number;
    maxBusinessListings: number;
    monthlyViews: number;
    monthlyClicks: number;
  };
  businesses?: Array<{
    id: string;
    name: string;
    planType: string;
    status: string;
  }>;
}

interface Plan {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface BillingDashboardProps {
  initialData: BillingData;
}

export default function BillingDashboard({
  initialData,
}: BillingDashboardProps) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);

  const plans: Plan[] = [
    {
      name: "Basic",
      price: 5.99,
      currency: "EUR",
      interval: "month",
      features: [
        "Business name, address, phone, email",
        "Basic business information",
        "Search listing inclusion",
        "Customer support",
      ],
      current: data.currentPlan.name === "Basic",
    },
    {
      name: "Pro",
      price: 12.99,
      currency: "EUR",
      interval: "month",
      features: [
        "Everything in Basic",
        "Business logo and images",
        "Service listings",
        "Business hours display",
        "Google Maps integration",
        "Enhanced business profile",
      ],
      current: data.currentPlan.name === "Pro",
      popular: true,
    },
    {
      name: "VIP",
      price: 19.99,
      currency: "EUR",
      interval: "month",
      features: [
        "Everything in Pro",
        "Top placement in category",
        "Hide email address",
        "Contact form relay",
        "Priority customer support",
        "Advanced analytics",
        "Featured listing badge",
        "Self-service management",
      ],
      current: data.currentPlan.name === "VIP",
    },
  ];

  const handleUpgradePlan = async (planName: string) => {
    setIsLoading(`upgrade-${planName}`);

    // Simulate Stripe payment processing
    setTimeout(() => {
      const selectedPlan = plans.find((p) => p.name === planName);
      if (selectedPlan) {
        setData((prev) => ({
          ...prev,
          currentPlan: {
            ...prev.currentPlan,
            name: selectedPlan.name,
            price: selectedPlan.price,
          },
        }));
        setSuccessMessage(`Successfully upgraded to ${planName} plan!`);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
      setIsLoading(null);
    }, 2000);
  };

  const handleCancelPlan = async () => {
    setIsLoading("cancel");

    // Simulate API call
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        currentPlan: {
          ...prev.currentPlan,
          status: "cancelled",
        },
      }));
      setShowCancelConfirm(false);
      setSuccessMessage(
        "Plan cancelled successfully. You'll have access until the end of your billing period."
      );
      setTimeout(() => setSuccessMessage(null), 5000);
      setIsLoading(null);
    }, 1500);
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsLoading(`download-${invoiceId}`);

    // Simulate PDF generation and download
    setTimeout(() => {
      const invoice = data.invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        // Create a mock PDF blob
        const pdfContent = `Invoice ${invoiceId}\nDate: ${invoice.date}\nAmount: €${invoice.amount}\nStatus: ${invoice.status}`;
        const blob = new Blob([pdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setIsLoading(null);
    }, 1000);
  };

  const handleUpdatePayment = async () => {
    setIsLoading("payment");

    // Simulate Stripe payment method update
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        paymentMethod: {
          type: prev.paymentMethod?.type || "card",
          last4: "5678", // Mock new card
          brand: prev.paymentMethod?.brand || "visa",
          expiryMonth: 3,
          expiryYear: 2029,
        },
      }));
      setShowPaymentUpdate(false);
      setSuccessMessage("Payment method updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsLoading(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription, billing, and payment methods
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Current Plan</h2>
          <div className="flex items-center space-x-2">
            {data.currentPlan.status === "active" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Active
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Cancelled
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline space-x-2 mb-4">
              <h3 className="text-2xl font-bold">{data.currentPlan.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold">
                  €{data.currentPlan.price}
                </span>
                <span className="text-muted-foreground">
                  /{data.currentPlan.interval}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {data.currentPlan.features.map((feature, index) => (
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
                {data.currentPlan.nextBillDate
                  ? new Date(data.currentPlan.nextBillDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Business listings
              </span>
              <span className="text-sm font-medium">
                {data.usage.businessListings} / {data.usage.maxBusinessListings}
              </span>
            </div>

            <div className="flex space-x-3 mt-6">
              {data.currentPlan.status === "active" && (
                <>
                  <button className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Upgrade Plan
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Cancel Plan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation */}
      {showCancelConfirm && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                Cancel Subscription
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                Are you sure you want to cancel your subscription? You&apos;ll
                lose access to premium features at the end of your billing
                period.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelPlan}
                  disabled={isLoading === "cancel"}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "cancel"
                    ? "Cancelling..."
                    : "Yes, cancel subscription"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  Keep subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-lg border p-6 transition-all ${
                plan.current
                  ? "border-primary ring-2 ring-primary/20"
                  : plan.popular
                  ? "border-purple-500 ring-2 ring-purple-500/20"
                  : "hover:shadow-lg"
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
                onClick={() => !plan.current && handleUpgradePlan(plan.name)}
                disabled={plan.current || isLoading === `upgrade-${plan.name}`}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  plan.current
                    ? "bg-muted text-muted-foreground cursor-default"
                    : plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isLoading === `upgrade-${plan.name}` ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : plan.current ? (
                  <span>Current Plan</span>
                ) : (
                  <>
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <button
            onClick={() => setShowPaymentUpdate(true)}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Update
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="p-3 bg-muted rounded-lg">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            {data.paymentMethod ? (
              <>
                <p className="font-medium">
                  •••• •••• •••• {data.paymentMethod.last4}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.paymentMethod.brand.toUpperCase()} • Expires{" "}
                  {data.paymentMethod.expiryMonth}/
                  {data.paymentMethod.expiryYear}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">No payment method</p>
                <p className="text-sm text-muted-foreground">
                  Add a payment method to continue your subscription
                </p>
              </>
            )}
          </div>
        </div>

        {/* Payment Update Modal */}
        {showPaymentUpdate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg border p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Update Payment Method
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• 5678"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="03/29"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdatePayment}
                  disabled={isLoading === "payment"}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "payment"
                    ? "Updating..."
                    : "Update Payment Method"}
                </button>
                <button
                  onClick={() => setShowPaymentUpdate(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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

          {data.invoices.map((invoice) => (
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
                <button
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  disabled={isLoading === `download-${invoice.id}`}
                  className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === `download-${invoice.id}` ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>
                    {isLoading === `download-${invoice.id}`
                      ? "Generating..."
                      : "Download"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trial Notice */}
      {data.currentPlan.trialEndsAt && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                30-Day Free Trial
              </h3>
              <p className="text-yellow-700 dark:text-yellow-200 mb-4">
                You&apos;re currently on a free trial. Your subscription will
                automatically start after the trial period ends unless you
                cancel.
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
      )}
    </div>
  );
}
