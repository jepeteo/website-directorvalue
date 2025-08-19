import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - Director Value",
  description: "Choose the perfect plan for your business on Director Value",
};

const plans = [
  {
    name: "Basic",
    price: "€5.99",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: [
      "Business name, address, phone, email",
      "Basic business information",
      "Search listing inclusion",
      "Customer support",
    ],
    icon: <Zap className="h-6 w-6" />,
    popular: false,
    cta: "Get Started",
    trialText: "30-day free trial",
  },
  {
    name: "Pro",
    price: "€12.99",
    period: "/month",
    description: "Enhanced features for growing businesses",
    features: [
      "Everything in Basic",
      "Business logo and images",
      "Service listings",
      "Business hours display",
      "Google Maps integration",
      "Enhanced business profile",
    ],
    icon: <Star className="h-6 w-6" />,
    popular: true,
    cta: "Get Started",
    trialText: "30-day free trial",
  },
  {
    name: "VIP",
    price: "€19.99",
    period: "/month",
    description: "Maximum visibility and premium features",
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
    icon: <Crown className="h-6 w-6" />,
    popular: false,
    cta: "Go VIP",
    trialText: "30-day free trial",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get your business noticed with Director Value
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
              <p className="text-green-800 font-medium">
                🎉 All plans include a 30-day free trial!
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-50"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 text-blue-600">{plan.icon}</div>
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <p className="text-sm text-green-600 font-medium text-center mb-4">
                      {plan.trialText}
                    </p>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                      asChild
                    >
                      <Link href="/dashboard/business/add">{plan.cta}</Link>
                    </Button>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How does the 30-day free trial work?
                </h3>
                <p className="text-gray-600 text-sm">
                  Start with any plan completely free for 30 days. No credit
                  card required. After the trial, your listing will be
                  deactivated unless you choose to continue.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time from
                  your dashboard. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens if I cancel?
                </h3>
                <p className="text-gray-600 text-sm">
                  You can cancel anytime. Your listing will remain active until
                  the end of your billing period, then be deactivated.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-600 text-sm">
                  No setup fees! The price you see is all you pay. VIP users can
                  self-register and manage their listings.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to grow your business?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of businesses worldwide on Director Value
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard/business/add">Start Your Free Trial</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
