# Environment Variables Usage

This document shows where each environment variable is used in the Human Typer application.

## Required Variables

### Stripe Integration
- **STRIPE_SECRET_KEY** - Used in `lib/stripe.ts` for server-side Stripe operations
- **STRIPE_PRICE_ID** - Used in `app/api/stripe/create-checkout-session/route.ts` for subscription pricing
- **STRIPE_WEBHOOK_SECRET** - Used in `app/api/stripe/webhook/route.ts` for webhook verification

### Application URLs
- **NEXT_PUBLIC_BASE_URL** - Used in:
  - `lib/baseUrl.ts` - Primary base URL
  - `app/layout.tsx` - SEO metadata and structured data
  - `app/api/stripe/create-portal-session/route.ts` - Stripe portal return URL

## Optional Variables

### Preview/Development
- **PREVIEW_USER** - Used in `middleware.ts` for basic auth in preview mode
- **PREVIEW_PASS** - Used in `middleware.ts` for basic auth in preview mode
- **VERCEL_ENV** - Used in `middleware.ts` to detect preview environment

### Vercel Auto-Set
- **VERCEL_URL** - Used in `lib/baseUrl.ts` as fallback URL
- **VERCEL** - Used in `lib/baseUrl.ts` to detect Vercel environment

### Development
- **NODE_ENV** - Used in:
  - `app/api/auth/login/route.ts` - Cookie security settings
  - `app/api/auth/signup/route.ts` - Cookie security settings

## Supabase Variables (Currently Mocked)
- **NEXT_PUBLIC_SUPABASE_URL** - Would be used for Supabase client initialization
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Would be used for Supabase client initialization
- **SUPABASE_SERVICE_ROLE_KEY** - Would be used for server-side Supabase operations

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Fill in your actual values for Stripe and other services
3. For local development, set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
4. For production, set `NEXT_PUBLIC_BASE_URL` to your actual domain
