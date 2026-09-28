# Westoria — Premium Skincare & Haircare Ecommerce

A production-ready ecommerce storefront + admin panel for **Westoria**, built with
Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma, NextAuth.js v5, and Razorpay.
Categories: **Face Wash**, **Serum**, **Shampoo**.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + hand-rolled shadcn-style UI primitives (Radix UI under the hood)
- Prisma ORM — SQLite for local dev, Postgres-ready for production
- NextAuth.js v5 (Auth.js) — Google OAuth + Email/Password (Credentials)
- Razorpay (INR payments, test + live)
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
    api/             → route handlers (auth, razorpay, orders, coupons, contact)
    sitemap.ts, robots.ts
  components/
    ui/              → button, input, card, dialog, sheet, tabs, select, etc.
    store/           → storefront components (header, footer, product card, cart drawer...)
    admin/           → admin-only components
    providers/       → SessionProvider + Toaster
  actions/           → server actions for admin CRUD (products, categories, orders)
  lib/               → prisma client, auth config, razorpay client, zod schemas, data fetchers
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
npm run db:push           # create local SQLite database from schema
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

## 3. Set Up Razorpay

1. Create an account at [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Grab your **Test Mode** API keys from Settings → API Keys.
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."   # same as RAZORPAY_KEY_ID, exposed to client
   ```
4. Checkout flow: `/checkout` creates an `Order` row → creates a Razorpay order
   (`/api/razorpay/create-order`) → opens the Razorpay Checkout widget → on success,
   `/api/razorpay/verify` verifies the HMAC signature server-side, marks the order Paid,
   and decrements stock.
5. Switch `rzp_test_...` keys for live keys (`rzp_live_...`) when going to production —
   no code changes required.

## 4. Database: SQLite → Postgres

Local dev uses SQLite (zero setup, `file:./dev.db`). For production:

1. Provision a Postgres database (Vercel Postgres, Neon, Supabase, RDS, etc.).
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` to your Postgres connection string.
4. Run `npm run db:migrate` (or `prisma migrate deploy` in CI/CD) instead of `db:push`.

## 5. Admin Panel

Visit `/admin` while logged in as the admin email. Features:

- **Dashboard** — revenue, order/product/customer counts, recent orders
- **Products** — create, edit, delete, images (comma-separated URLs), stock, price/sale price,
  category, featured/bestseller/new-arrival flags
- **Orders** — view details, update status (Pending → Processing → Shipped → Delivered → Cancelled)
- **Categories** — create/delete
- **Customers** — list of all registered users

All admin routes are protected by `src/middleware.ts` (redirects non-admins to `/login`) and by a
server-side `requireAdmin()` check inside every admin server action, for defense in depth.

Image hosting: the app ships with locally-generated placeholder SVGs (`public/images/...`) so it
runs out of the box with no external services. To use real product photography, wire up
Uploadthing or Cloudinary and paste the resulting URLs into the product `images` field
(comma-separated for multiple images) — `next.config.ts` already allow-lists both hosts.

## 6. Deploy on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel dashboard
   (use your production `NEXTAUTH_URL`, live Razorpay keys, a Postgres `DATABASE_URL`, etc.).
4. Build command stays `next build` (already runs `prisma generate` via `postinstall`).
5. After first deploy, run migrations against production:
   ```bash
   npx prisma migrate deploy
   npx tsx prisma/seed.ts   # optional: seed sample catalog
   ```
6. Update the Google OAuth redirect URI and Razorpay webhook/allowed domains to your
   production URL.

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
