import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatCurrency(
  amount: number,
  currency: string = 'EUR'
): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
  }).format(amount / 100) // Stripe amounts are in cents
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-EU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
