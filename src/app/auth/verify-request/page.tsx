import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check Your Email - Director Value",
  description: "Check your email for the magic link to sign in",
};

function VerifyRequestContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 14l-20 20-7-7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a magic link to your email address
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            <div className="text-sm text-gray-600">
              <p className="mb-4">
                Click the link in your email to sign in to your account. The
                link will expire in 24 hours.
              </p>
              <p>
                Didn&apos;t receive the email? Check your spam folder or try
                signing in again.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Back to sign in</Link>
              </Button>

              <Button asChild className="w-full">
                <Link href="/">Return home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestContent />
    </Suspense>
  );
}
