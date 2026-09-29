# Westoria — Premium Skincare & Haircare Ecommerce

A production-ready ecommerce storefront + admin panel for **Westoria**, built with
Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma, NextAuth.js v5, Redis, and Cashfree.
Categories: **Face Wash**, **Serum**, **Shampoo**.

## Tech Stack

- Next.js 15 (App Router) + TypeScript — fully serverless-compatible, deploys cleanly to Vercel
- Tailwind CSS v4 + hand-rolled shadcn-style UI primitives (Radix UI under the hood)
- Prisma ORM — Postgres (Vercel Postgres / Neon / Supabase / Cashfree's own Postgres, etc.)
- NextAuth.js v5 (Auth.js) — Google OAuth + Email/Password (Credentials)
- Cashfree Payment Gateway (INR payments, sandbox + production)
- Realtime stock/price + order-status updates via **Server-Sent Events + Redis pub/sub**
  (Upstash Redis) — no custom server, works on Vercel serverless
- Zustand (cart & wishlist state, persisted to localStorage)
- React Hook Form + Zod (forms & validation)
- Framer Motion (hero carousel & transitions)
- Lucide React (icons)
- Sonner (toast notifications)

## Folder Structure

```
src/
  app/
    (store)/        → public storefront (home, collections, product, cart, checkout, account, legal, about, contact...)
    (auth)/          → login, signup
    (admin)/admin/   → admin panel (protected)
    api/             → route handlers (auth, cashfree, orders, coupons, contact)
    sitemap.ts, robots.ts
  components/
    ui/              → button, input, card, dialog, sheet, tabs, select, etc.
    store/           → storefront components (header, footer, product card, cart drawer...)
    admin/           → admin-only components
    providers/       → SessionProvider + Toaster
  actions/           → server actions for admin CRUD (products, categories, orders)
  lib/               → prisma client, auth config, cashfree client, redis publisher, zod schemas, data fetchers
  stores/            → zustand cart & wishlist stores
  types/             → shared TypeScript types
prisma/
  schema.prisma
  seed.ts
```

## 1. Run Locally

```bash
npm install
cp .env.example .env      # then fill in the values (see sections below)
npm run db:migrate        # create tables in your Postgres database from the schema
npm run db:seed           # seed categories, products, a coupon, and the admin user
npm run dev
```

Visit **http://localhost:3000**.

> `npm install` automatically runs `prisma generate` via the `postinstall` script.

### Seeded accounts

The seed script creates an admin account you can log in with immediately (email/password):

- Email: `sonaiyakaran339@gmail.com`
- Password: `Admin@123`

Signing in with this **exact email** (via Google or password) always grants admin access —
see `src/lib/admin.ts`. Change it with the `ADMIN_EMAIL` env var if needed.

## 2. Set Up Google OAuth

1. Go to the [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (type: Web application).
3. Add authorized redirect URI:
   - Local: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
4. Copy the Client ID / Secret into `.env`:
   ```
   AUTH_GOOGLE_ID="..."
   AUTH_GOOGLE_SECRET="..."
   ```
5. Also set `AUTH_SECRET` (generate with `npx auth secret`) and `NEXTAUTH_URL`
   (must match the URL you're actually running on, including port).

Signing in with Google using the admin email above will auto-promote that user to `admin` role.

## 3. Set Up Cashfree

1. Create an account at the [Cashfree Merchant Dashboard](https://merchant.cashfree.com/).
2. Grab your **Test/Sandbox** API keys from Developers → API Keys.
3. Add to `.env`:
   ```
   CASHFREE_CLIENT_ID="..."
   CASHFREE_CLIENT_SECRET="..."
   CASHFREE_ENV="sandbox"
   ```
4. Checkout flow: `/checkout` creates an `Order` row (Pending/Unpaid) → `/api/cashfree/create-order`
   creates a matching order with Cashfree and returns a `payment_session_id` → the Cashfree JS SDK
   redirects the browser to Cashfree's hosted checkout (`redirectTarget: "_self"`) → after payment,
   Cashfree redirects back to `/checkout/success?orderId=...` → that page verifies the payment
   **server-side** (`GET`-equivalent order-status fetch, never trusting the redirect alone) before
   marking the order Paid and decrementing stock.
5. For production reliability, also set the webhook URL in the Cashfree dashboard to
   `https://yourdomain.com/api/cashfree/webhook` — it independently confirms payment
   server-to-server (signature-verified) in case the customer's browser never makes it back.
6. Switch `CASHFREE_ENV` to `"production"` and use your live keys when going live —
   no code changes required.

## 4. Database (Postgres)

This project uses Postgres only (no SQLite). Any provider works — Vercel Postgres, Neon,
Supabase, Cashfree's own Postgres offering, RDS, etc.

1. Provision a Postgres database and copy its connection string into `DATABASE_URL` in `.env`.
2. Run `npm run db:migrate` to create the tables (and again after pulling any future schema
   changes). Use `prisma migrate deploy` instead in CI/CD.

## 5. Admin Panel

Visit `/admin` while logged in as the admin email. Features:

- **Dashboard** — revenue, order/product/customer counts, recent orders
- **Products** — create, edit, delete, images (upload from device or paste a URL), stock,
  price/sale price, category, featured/bestseller/new-arrival flags
- **Orders** — view details, update status (Pending → Processing → Shipped → Delivered → Cancelled)
- **Categories** — create/delete
- **Customers** — list of all registered users

All admin routes are protected by `src/middleware.ts` (redirects non-admins to `/login`) and by a
server-side `requireAdmin()` check inside every admin server action, for defense in depth.

Image hosting: uploading from the admin panel sends the file to **Cloudinary** (via `CLOUDINARY_URL`)
and stores the returned `secure_url` on the product — works identically on local dev and on
Vercel, no persistent disk needed. The app also ships with locally-generated placeholder SVGs
(`public/images/...`) for the seeded catalog. You can still paste any external image URL instead —
`next.config.ts` already allow-lists Cloudinary and Uploadthing hosts for `next/image`.

## 6. Set Up Redis (realtime updates)

Powers the live stock/price updates on product pages and live order-status/tracking updates on
account pages. Implemented as Server-Sent Events (`GET /api/realtime`) backed by Redis pub/sub —
works the same in local dev and on Vercel, no persistent server needed.

1. Create a free database at [Upstash](https://console.upstash.com/) → **Redis** → **Create Database**
   (any region).
2. On the database page, copy the **TCP connection string** (starts with `rediss://...`, *not* the
   REST URL/token pair — pub/sub needs the TCP protocol) into `.env`:
   ```
   REDIS_URL="rediss://default:<password>@<endpoint>:<port>"
   ```
3. That's it — `src/lib/redis.ts` (`emitEvent`, server-side) publishes to a shared
   `westoria-updates` channel; `src/app/api/realtime/route.ts` subscribes and streams matching
   events to the browser over SSE; `src/lib/realtime-client.ts` (`subscribeRealtime`, client-side)
   consumes it via the native `EventSource` API — no client library needed.
4. If `REDIS_URL` is missing, realtime updates just silently no-op instead of throwing — the rest
   of the site keeps working.

**Note on Vercel's free (Hobby) plan:** serverless functions have a 5-minute max duration, so a
long-open SSE connection gets cut and automatically reconnects every ~5 minutes (the browser's
`EventSource` handles this natively — you may see a brief gap, not an error).

## 7. Deploying

This app is fully serverless-compatible — no custom server, works on Vercel out of the box.

1. Push this repo to GitHub/GitLab/Bitbucket and import it into [Vercel](https://vercel.com/new).
2. Add all environment variables from `.env.example` (production `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL`,
   live Cashfree keys, `DATABASE_URL`, `CLOUDINARY_URL`, `REDIS_URL`, etc.).
3. After first deploy, run migrations against production:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts   # optional: seed sample catalog
   ```
4. Update the Google OAuth redirect URI and the Cashfree webhook URL to your production domain.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to DB (dev, no migration history) |
| `npm run db:migrate` | Create/apply a migration (use for Postgres in production) |
| `npm run db:seed` | Seed categories, products, coupon, admin user |
| `npm run db:studio` | Open Prisma Studio |

## Notes

- Coupon `WEST10` (10% off) is seeded and usable at checkout.
- Free shipping over ₹599, otherwise a flat ₹49 shipping fee — see `SHIPPING_FEE` /
  `FREE_SHIPPING_THRESHOLD` in `src/app/api/orders/route.ts` and `checkout-form.tsx`.
- SEO: metadata, Open Graph tags, `sitemap.ts`, and `robots.ts` are already wired up.
