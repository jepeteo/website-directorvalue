import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About - Director Value",
  description: "Learn about Director Value - Everything you need worldwide",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Director Value
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need worldwide
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Director Value is a comprehensive global business directory
                designed to connect customers with businesses worldwide. We
                provide a platform where self-employed professionals, SMBs,
                mid-market companies, and enterprises can showcase their
                services to a global audience.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What We Offer
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    For Businesses
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Global visibility for your services</li>
                    <li>• Professional business profiles</li>
                    <li>• Customer review management</li>
                    <li>• Lead generation tools</li>
                    <li>• Multiple subscription plans</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    For Customers
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Easy search and discovery</li>
                    <li>• Verified business information</li>
                    <li>• Customer reviews and ratings</li>
                    <li>• Contact businesses directly</li>
                    <li>• Browse by category and location</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Why Choose Director Value
              </h2>
              <div className="bg-blue-50 p-8 rounded-lg">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌍</div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Global Reach
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Connect with businesses worldwide
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">⭐</div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Quality Focus
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Curated listings with verified information
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🚀</div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Easy to Use
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Simple search and discovery tools
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Get Started Today
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you&apos;re a business looking to expand your reach or a
                customer searching for the perfect service, Director Value is
                here to help. Join thousands of businesses and customers who
                trust Director Value for their global business directory needs.
              </p>
              <div className="text-center">
                <a
                  href="/pricing"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  View Our Plans
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
