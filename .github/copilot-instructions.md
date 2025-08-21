# Copilot Instructions (Development Guide)

**Project:** Director Value Business Directory  
**You are:** An AI coding assistant for a solo developer. Generate clean, secure, performant TypeScript React/Next.js code. No comments or team milestones.

## Tech & Conventions

- **Runtime:** Next.js (App Router, RSC by default; use Client Components only when necessary).
- **Lang:** TypeScript strict — never use `any`.
- **Styling:** Tailwind CSS. Centralize theme in `tailwind.config.ts`.
- **UI Kit:** Headless primitives (Radix) or shadcn/ui if needed; keep components small and composable.
- **Data:** Prisma + PostgreSQL.
- **Auth:** NextAuth with email magic link.
- **Email:** Resend for transactional + contact relay.
- **Payments:** Stripe (subscriptions + 30-day trials).
- **Validation:** Zod for all server inputs and forms.
- **State:** Server Components first; use React state minimally.
- **Fetch:** Route Handlers + cache/revalidate.
- **Perf/Sec:**
  - Avoid client hydration unless needed.
  - Middleware rate-limits (Upstash Redis).
  - Cloudflare Turnstile to public forms.
  - Sanitize user content; escape user text.
  - Use Next/Image and streaming.
- **Testing:** Vitest + React Testing Library; Playwright for flows.
- **Lint/Format:** ESLint (security plugin) + Prettier.
- **Env:** Validate env with Zod.
- **Accessibility:** Semantic HTML, contrast, focus.

## File/Folder Structure (suggested)

```
/src
  /app
    /(public)
    /search/page.tsx
    /c/[category]/page.tsx
    /l/[slug]/page.tsx
    /pricing/page.tsx
    /api
      /listings/route.ts
      /reviews/route.ts
      /abuse/route.ts
      /contact-relay/route.ts
      /stripe/webhook/route.ts
  /dashboard
  /admin
  /components
  /lib
  /server
  /styles
  /prisma
```

## Prisma Schema

_(See PRD for full schema — copy to `prisma/schema.prisma`.)_

## Stripe Products

- `plan_basic_monthly` (€5.99) - Single business, basic listing
- `plan_pro_monthly` (€12.99) - Basic + Analytics + enhanced features
- `plan_vip_monthly` (€19.99) - Pro + Leads + multiple businesses + priority
- Trials: 30 days, auto deactivate if unpaid.

## Middleware & Policies

- Auth gate by role.
- Rate limits on reviews, abuse, contact.
- Turnstile required on public forms.
- VIP email relay via Resend.

## SEO & i18n

- Sitemap, robots, JSON-LD LocalBusiness.
- next-intl (EN, FR, DE).

## Migration Plan

- Start Vercel, migrate to SiteGround Cloud.
- Avoid Vercel-specific APIs in core.
- Provide Dockerfile for portability.

## Definition of Done (MVP)

- Public browse/search/category pages.
- VIP signup + trial + billing.
- Reviews with abuse report + admin hide.
- CRM forwarding of leads.
- i18n (EN/FR/DE), GDPR cookie banner.
- Lighthouse ≥90 (Perf/SEO/Accessibility).
