import { Metadata } from "next";
import { BusinessRegistrationForm } from "@/components/business/registration-form";

export const metadata: Metadata = {
  title: "Add Your Business - Director Value",
  description:
    "Register your business on Director Value and reach more customers",
};

export default async function AddBusinessPage() {
  // TODO: Check if user is authenticated and has VIP status
  // For now, allow access to test the form

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Add Your Business</h1>
          <p className="text-muted-foreground text-lg">
            Join thousands of businesses on Director Value and connect with new
            customers
          </p>
        </div>

        <BusinessRegistrationForm />
      </div>
    </div>
  );
}
