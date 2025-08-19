import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "dark";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-8",
    title: "text-lg",
    tagline: "text-xs",
    gap: "space-x-3",
  },
  md: {
    container: "w-12 h-12",
    title: "text-2xl",
    tagline: "text-sm",
    gap: "space-x-4",
  },
  lg: {
    container: "w-16 h-16",
    title: "text-3xl",
    tagline: "text-base",
    gap: "space-x-5",
  },
};

const variantConfig = {
  default: {
    title: "text-foreground group-hover:text-primary",
    tagline: "text-muted-foreground",
  },
  white: {
    title: "text-white",
    tagline: "text-gray-400",
  },
  dark: {
    title: "text-gray-900 group-hover:text-blue-600",
    tagline: "text-gray-500",
  },
};

export function Logo({
  size = "md",
  variant = "default",
  showText = true,
  href = "/",
  className,
}: LogoProps) {
  const sizeStyles = sizeConfig[size];
  const variantStyles = variantConfig[variant];

  const logoContent = (
    <div className={cn("flex items-center group", sizeStyles.gap, className)}>
      <div
        className={cn(
          "relative group-hover:scale-105 transition-all duration-300 ease-out",
          sizeStyles.container
        )}
      >
        <Image
          src="/directorvalue-logo.webp"
          alt="Director Value Logo"
          fill
          className="object-contain drop-shadow-sm"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1
            className={cn(
              "font-bold tracking-tight leading-none transition-colors duration-200",
              sizeStyles.title,
              variantStyles.title
            )}
          >
            Director Value
          </h1>
          <span
            className={cn(
              "font-medium -mt-0.5 leading-tight",
              sizeStyles.tagline,
              variantStyles.tagline
            )}
          >
            Everything you need worldwide
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
