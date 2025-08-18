# Director Value — PRD (Product Requirements Document)

## 1) Overview
- **Product:** Director Value Business Directory ("Everything you need worldwide")
- **Goal (6–12 mo):** 1,000+ registered businesses/self-employed; generate profit + leads for directory services.
- **Audience:** Self-employed, SMB, mid-market, enterprise (global).
- **Primary KPIs:** #active listings, conversion to paid (trial→paid), search CTR, leads sent, Stripe MRR/ARR.
- **Branding:** Director Value ("Everything you need worldwide") - An MTX company.

## 2) Scope (MVP)
- **Listings:** Global, all industries; categories, tags, regions.
- **Plans:**  
  - **Free Trial (30 days):** auto-expires → listing deactivated.  
  - **Basic (€5.99/mo):** name, address, phone, email.  
  - **Pro:** Basic + services, logo, Google Map, working hours.  
  - **VIP:** Pro + top placement in category, hide email, contact-form relay.
- **Self-serve capability:** **VIP only** can self-register/manage. Others contact us; admin creates/edits.
- **Payments:** Stripe subscriptions + webhooks (trial, renewals, dunning, cancel).
- **Search:** by name, category, location, filters (price range, tags, open now, rating).
- **Reviews:** Open posting; abuse-report mechanism; soft-delete + audit log.
- **Accounts:** Visitors (no login), Business owners (VIP self-serve), Admin.  
  *(Future roles: Moderator, Finance, Support.)*
- **i18n:** EN, FR, DE.
- **Integrations:** Google Maps; CRM (lead capture for both listed businesses and internal sales); Social share.  
  *(Booking system: TBD/feature-flag for later.)*
- **Compliance:** GDPR, cookie consent, privacy/terms, email relay privacy for VIP.

## 3) Non-Goals (MVP)
- No marketplace transactions between users and businesses.
- No per-listing booking engine (placeholder only).
- No complex multi-tenant role matrix (single Admin to start).

## 4) Architecture / Tech
- **Stack:** Next.js (App Router, RSC, Route Handlers), React, TypeScript (strict, **no `any`**), Tailwind CSS.
- **Data:** PostgreSQL (Vercel Postgres / Neon) via Prisma.
- **Auth:** NextAuth (email magic link + optional OAuth later). Role field in user table.
- **Deployment:** Start on Vercel (Edge cache, ISR/SSG/SSR mix). Later: SiteGround Cloud (Node runtime).
- **Email:** Resend (transactional + relay).  
- **Caching:** Next.js cache, Incremental Static Regeneration for listing/category pages; SWR for client fetches.
- **Security:**  
  - Zod validation on all inputs; server-side enforcement.  
  - Rate limiting (middleware + Upstash Redis).  
  - Cloudflare Turnstile on public forms (reviews, abuse reports, contact).  
  - Prisma row-level authorization checks.  
  - Secrets via env; no PII in logs.
- **Performance:** Next/Image, edge-cached listing pages, avoid large client bundles (RSC first), code-split client components.

## 5) Information Architecture
- **Public:**  
  - `/` (hero, search, top categories, featured VIP)  
  - `/search?query=&category=&location=&filters=…`  
  - `/c/[category]` (paginated list, faceted filters)  
  - `/l/[slug]` (listing page: details, map, hours, services, reviews, report abuse, contact relay if VIP)  
  - Static pages: about, pricing, terms, privacy, contact.
- **Business Owner (VIP):**  
  - `/dashboard` (edit listing, media, services, plan/billing, stats)  
- **Admin:**  
  - `/admin` (users, listings, categories/taxonomy, reviews, abuse queue, payments status, CRM leads)

## 6) Data Model (concise)
*(see full conversation for schema)*

## 7) Key Flows
- **VIP self-serve onboarding:** create account → create business → choose VIP plan → 30d trial → Stripe → auto-approve & publish → post-trial billing or deactivate.  
- **Basic/Pro onboarding:** contact us → CRM lead → admin creates draft → Stripe link → on paid, publish.  
- **Review posting:** open form → Turnstile → Zod validate → publish immediately → report-abuse available.  
- **Abuse handling:** adds to queue → admin can hide content (soft delete) → audit trail.  
- **VIP contact privacy:** hide email → contact form sends via Resend; store lead; throttle + spam checks.

## 8) Search & Ranking
- **Filters:** category, location (country/city), price range, open now, rating, tags.  
- **Sort:** relevance, rating, most reviews, newest, **VIP boost** within category.

## 9) Pricing & Billing
- Stripe products for **Basic/Pro/VIP** + trial logic (30 days).

## 10) Admin
- CRUD for taxonomy, businesses, users, reviews.  
- Abuse queue.  
- Subscription/billing status.  
- Lead stream.

## 11) SEO
- JSON-LD (LocalBusiness) on listing pages.  
- Clean slugs; canonical URLs; sitemap by category and listings; robots.txt.  
- Social meta (OG/Twitter).

## 12) Analytics/Observability
- Vercel Analytics + server logs; optional Sentry.

## 13) i18n
- next-intl/next-i18next; namespace per page.

## 14) Risks & Mitigations
- **Spam/abuse:** Turnstile + rate limits.  
- **Chargebacks/dunning:** Stripe retry, email nudge, auto-deactivate.  
- **Perf with growth:** RSC, ISR, pagination, optional external search engine later.

## 15) Open Items (to decide later)
- Booking vendor & UX.  
- CRM vendor.  
- Default currency & tax treatment on invoices.  
- Ad placements policy.
