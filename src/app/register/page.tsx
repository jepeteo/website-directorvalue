import { Metadata } from "next";
import { BusinessRegistrationForm } from "@/components/business/registration-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Register Your Business - Director Value",
  description:
    "List your business on Director Value and reach thousands of potential customers.",
};

export default function BusinessRegistrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Register Your Business</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of businesses on Director Value and reach new
            customers. Get started with our simple registration process.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Increase Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Get discovered by customers searching for your services
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold mb-2">Build Trust</h3>
            <p className="text-sm text-muted-foreground">
              Collect reviews and showcase your reputation
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">📈</span>
            </div>
            <h3 className="font-semibold mb-2">Grow Your Business</h3>
            <p className="text-sm text-muted-foreground">
              Connect with more customers and increase sales
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <BusinessRegistrationForm />
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 p-8 rounded-2xl border max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">What happens next?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">
                  1
                </div>
                <h3 className="font-medium mb-1">Submit Application</h3>
                <p className="text-muted-foreground">
                  Complete the registration form with your business details
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">
                  2
                </div>
                <h3 className="font-medium mb-1">Review Process</h3>
                <p className="text-muted-foreground">
                  Our team reviews your application within 1-2 business days
                </p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">
                  3
                </div>
                <h3 className="font-medium mb-1">Go Live</h3>
                <p className="text-muted-foreground">
                  Your business appears in search results and can receive
                  reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
