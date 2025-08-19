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
                      <Link href="/dashboard/businesses/new">{plan.cta}</Link>
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
          <div className="relative mt-16 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl"></div>
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center px-8 py-16">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Transform Your Business Today
                </h2>
                <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                  Join over 10,000 successful businesses worldwide using
                  Director Value to attract new customers and grow their revenue
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Link href="/dashboard/businesses/new">
                      🚀 Start Your Free Trial
                    </Link>
                  </Button>

                  <div className="flex items-center gap-2 text-white/90">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      No credit card required
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">30-day free trial</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Setup in minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
