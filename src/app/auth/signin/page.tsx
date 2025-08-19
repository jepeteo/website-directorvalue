import { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "@/components/auth/signin-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign In - Director Value",
  description: "Sign in to your Director Value account",
};

export default async function SignInPage() {
  // Session check will be handled by middleware

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to home button */}
      <div className="absolute top-4 left-4">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to site</span>
          </Link>
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 relative">
              <Image
                src="/directorvalue-logo.webp"
                alt="Director Value Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Director Value
              </h1>
              <span className="text-xs text-gray-500">
                Everything you need worldwide
              </span>
            </div>
          </Link>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a
              href="/pricing"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              start your free trial
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>

        {/* Additional navigation options */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <Link href="/" className="text-blue-600 hover:text-blue-500">
                ← Return to homepage
              </Link>
            </p>
            <p>
              Need help?{" "}
              <Link href="/about" className="text-blue-600 hover:text-blue-500">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
