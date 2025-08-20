import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import BillingDashboard from "@/components/dashboard/billing-dashboard";

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

  return <BillingDashboard initialData={billingData} />;
}
