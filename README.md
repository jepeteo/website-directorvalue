# Director Value

**🌍 Live at [directorvalue.com](https://directorvalue.com)**

Everything you need worldwide - A comprehensive business directory platform built with Next.js, allowing businesses to list their services and customers to find local businesses worldwide.

## 🚀 Current Status

**Version 1.0.0** - Live Production Release

The platform is now live and operational with core features implemented:

### ✅ Completed Features

- **🏢 Business Listings**: Complete business profiles with contact info, services, reviews, and working hours
- **🔍 Search & Filter**: Advanced search by location, category, and various filters with pagination
- **⭐ Review System**: Customer reviews with abuse reporting and admin moderation
- **💰 Multi-tier Plans**: Free trial (30 days), Basic (€5.99/mo), Pro, and VIP subscription plans
- **👨‍💼 Admin Dashboard**: Complete management interface for businesses, users, and content moderation
- **🌐 Internationalization**: Support for EN, FR, and DE languages (next-intl)
- **💳 Payment Integration**: Stripe subscriptions with 30-day trials and webhook handling
- **📧 Email System**: Resend integration for transactional emails and VIP lead relay
- **🔐 Authentication**: NextAuth.js with email magic links and role-based access
- **🎨 UI/UX**: Modern interface with Tailwind CSS and Radix UI components
- **📱 Responsive Design**: Mobile-first approach with optimized layouts
- **🔒 Security**: Rate limiting, input validation with Zod, and Cloudflare Turnstile ready
- **📊 Analytics**: Admin dashboard with business stats, review analytics, and user management

### 🔄 In Progress / Planned

- **Stripe Webhooks**: Full billing lifecycle automation
- **VIP Contact Relay**: Email forwarding system for VIP listings
- **Enhanced Search**: Location-based search improvements
- **SEO Optimization**: JSON-LD structured data and sitemap generation
- **Performance**: Image optimization and caching strategies

## Features

- **Business Listings**: Complete business profiles with contact info, services, and reviews
- **Search & Filter**: Advanced search by location, category, and various filters
- **Review System**: Customer reviews with abuse reporting mechanism
- **Multi-tier Plans**: Free trial, Basic, Pro, and VIP subscription plans
- **Admin Dashboard**: Complete management interface for businesses and content
- **Internationalization**: Support for EN, FR, and DE languages
- **Payment Integration**: Stripe subscriptions with 30-day trials
- **Email System**: Resend integration for transactional emails and VIP lead relay

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with email magic links
- **Styling**: Tailwind CSS with Radix UI components
- **Payments**: Stripe for subscriptions and billing
- **Email**: Resend for transactional and relay emails
- **Validation**: Zod for all server inputs and forms
- **Rate Limiting**: Upstash Redis for API rate limiting
- **Security**: Cloudflare Turnstile for form protection

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Resend account (for emails)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd directorvalue.com
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
- Database connection string
- NextAuth secret and URL
- Stripe keys and webhook secret
- Resend API key
- Optional: Upstash Redis and Cloudflare Turnstile keys

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [https://directorvalue.com](https://directorvalue.com) to see the live application, or [http://localhost:3000](http://localhost:3000) for local development.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (public)/       # Public pages (search, listings, categories)
│   ├── dashboard/      # Business owner dashboard
│   ├── admin/          # Admin management interface
│   └── api/            # API routes
├── components/         # Reusable UI components
│   └── ui/            # Basic UI components
├── lib/               # Utilities and configurations
│   ├── auth.ts        # NextAuth configuration
│   ├── prisma.ts      # Database client
│   ├── utils.ts       # Helper functions
│   └── validations.ts # Zod schemas
├── server/            # Server-side utilities
└── styles/            # Global styles
```

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `RESEND_API_KEY`: Resend API key for emails

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database browser
- `npx prisma migrate dev` - Run database migrations

## Deployment

🎉 **Currently Live**: The project is deployed and running at [directorvalue.com](https://directorvalue.com)

**Platform**: Vercel with custom domain  
**Database**: Vercel Postgres  
**CDN**: Vercel Edge Network  
**Monitoring**: Vercel Analytics  

For Vercel deployment:
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch
4. Add custom domain in Vercel dashboard settings

### Environment Setup for Production
Ensure these environment variables are configured in Vercel:
- Database connections (Vercel Postgres or external)
- Stripe keys and webhook endpoints
- Resend API configuration
- NextAuth secrets and URLs
- Optional: Redis for rate limiting, Turnstile for form protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software owned by Director Value (An MTX company).

## Support

For support and questions, contact us at [support@directorvalue.com](mailto:support@directorvalue.com).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
