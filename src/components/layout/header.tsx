import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
              <Image
                src="/directorvalue-logo.webp"
                alt="Director Value Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Director Value
              </h1>
              <span className="text-xs text-muted-foreground font-medium">
                Everything you need worldwide
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/search"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/categories"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Pricing
            </Link>
            <UserMenu />
          </nav>

          {/* Mobile menu button - TODO: Implement mobile menu */}
          <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
