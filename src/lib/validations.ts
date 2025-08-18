import { z } from 'zod'

// Environment validation
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  RESEND_API_KEY: z.string().startsWith('re_'),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)

// Business validation schemas
export const businessCreateSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  description: z.string().max(1000).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional(),
  addressLine1: z.string().max(100).optional(),
  addressLine2: z.string().max(100).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(50).optional(),
  categoryId: z.string().cuid().optional(),
  services: z.array(z.string()).max(20).optional(),
  tags: z.array(z.string()).max(10).optional(),
})

export const reviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().max(1000).optional(),
  businessId: z.string().cuid(),
})

export const abuseReportSchema = z.object({
  type: z.enum(['SPAM', 'INAPPROPRIATE_CONTENT', 'FAKE_REVIEW', 'HARASSMENT', 'COPYRIGHT', 'OTHER']),
  reason: z.string().min(10).max(500),
  businessId: z.string().cuid().optional(),
  reviewId: z.string().cuid().optional(),
})

export const leadCreateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(1000),
  businessId: z.string().cuid().optional(),
})
