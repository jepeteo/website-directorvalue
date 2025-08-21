import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BillingDashboard from "@/components/dashboard/billing-dashboard";

async function getBillingData(userId: string) {
  try {
    // Get user's businesses and subscription data
    const businesses = await prisma.business.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        planType: true,
        status: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        trialEndsAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get primary business (first one for now)
    const primaryBusiness = businesses[0];

    // Get plan details based on actual business plan
    const getPlanDetails = (planType: string) => {
      switch (planType) {
        case "BASIC":
          return {
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
          };
        case "PRO":
          return {
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
          };
        case "VIP":
          return {
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
          };
        default:
          return {
            name: "Free Trial",
            price: 0,
            currency: "EUR",
            interval: "month",
            features: [
              "30-day free trial",
              "Basic business listing",
              "Limited features",
            ],
          };
      }
    };

    const currentPlan = primaryBusiness
      ? getPlanDetails(primaryBusiness.planType)
      : getPlanDetails("FREE_TRIAL");

    // Calculate next billing date (30 days from now for active subscriptions)
    const nextBillDate =
      primaryBusiness?.planType !== "FREE_TRIAL"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] || null
        : null;

    // Mock payment method (in production, this would come from Stripe)
    const paymentMethod = primaryBusiness?.stripeCustomerId
      ? {
          type: "card",
          last4: "4242",
          brand: "visa",
          expiryMonth: 12,
          expiryYear: 2028,
        }
      : null;

    // Mock invoices (in production, these would come from Stripe)
    const invoices =
      primaryBusiness?.planType !== "FREE_TRIAL"
        ? [
            {
              id: "inv_001",
              date:
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0] ||
                new Date().toISOString().split("T")[0] ||
                "Unknown",
              amount: currentPlan.price,
              currency: currentPlan.currency,
              status: "paid",
              downloadUrl: "#",
            },
            {
              id: "inv_002",
              date:
                new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0] ||
                new Date().toISOString().split("T")[0] ||
                "Unknown",
              amount: currentPlan.price,
              currency: currentPlan.currency,
              status: "paid",
              downloadUrl: "#",
            },
          ]
        : [];

    // Calculate usage stats
    const usage = {
      businessListings: businesses.length,
      maxBusinessListings:
        primaryBusiness?.planType === "VIP"
          ? 999
          : primaryBusiness?.planType === "PRO"
          ? 5
          : 1,
      monthlyViews: Math.floor(Math.random() * 2000) + 500, // Mock data for now
      monthlyClicks: Math.floor(Math.random() * 200) + 50, // Mock data for now
    };

    return {
      currentPlan: {
        ...currentPlan,
        status: primaryBusiness?.status === "ACTIVE" ? "active" : "trial",
        trialEndsAt:
          primaryBusiness?.trialEndsAt?.toISOString().split("T")[0] || null,
        nextBillDate,
      },
      paymentMethod,
      invoices,
      usage,
      businesses,
    };
  } catch (error) {
    console.error("Error fetching billing data:", error);
    // Fallback to default trial data
    return {
      currentPlan: {
        name: "Free Trial",
        price: 0,
        currency: "EUR",
        interval: "month",
        status: "trial",
        trialEndsAt:
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] || null,
        nextBillDate: null,
        features: [
          "30-day free trial",
          "Basic business listing",
          "Limited features",
        ],
      },
      paymentMethod: null,
      invoices: [],
      usage: {
        businessListings: 0,
        maxBusinessListings: 1,
        monthlyViews: 0,
        monthlyClicks: 0,
      },
      businesses: [],
    };
  }
}

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const billingData = await getBillingData(session.user.id);

  return <BillingDashboard initialData={billingData} />;
}
