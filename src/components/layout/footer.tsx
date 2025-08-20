import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo size="md" variant="white" />
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Your comprehensive global business directory. Connecting customers
              with trusted businesses worldwide since 2025.
            </p>

            {/* Social Links */}
            <div className="flex space-x-5">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Connect on LinkedIn"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white mb-6 text-lg">Discover</h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Browse Businesses
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h5 className="font-semibold text-white mb-6 text-lg">
              For Business
            </h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard/businesses/new"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  List Your Business
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Business Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold text-white mb-6 text-lg">Legal</h5>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr"
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-400">
              <span>© 2025 Director Value. All rights reserved.</span>
              <span className="hidden sm:inline">·</span>
              <span>
                An{" "}
                <Link
                  href="https://mtxstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  MTX Studio
                </Link>{" "}
                company.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Available in:</span>
                <div className="flex gap-1">
                  <button className="text-sm px-3 py-1 rounded-md hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white">
                    EN
                  </button>
                  <button className="text-sm px-3 py-1 rounded-md hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white">
                    FR
                  </button>
                  <button className="text-sm px-3 py-1 rounded-md hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white">
                    DE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
