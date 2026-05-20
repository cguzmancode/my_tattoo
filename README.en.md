# InkApp — Booking Management for Tattoo Artists

> 🌐 **Leer en [Español](./README.md)**.

> Full-stack platform for freelance tattoo artists. Centralizes booking requests, calendar, client↔artist messaging, and a public portfolio profile.

Personal project built on the latest Next.js + Prisma + Clerk + Supabase stack, with emphasis on **clean architecture and testability** — not just making it work.

---

## 🧱 Stack

| Layer            | Tech                                        |
|------------------|---------------------------------------------|
| Framework        | **Next.js 16** (App Router, Server Actions) |
| Language         | TypeScript (strict)                         |
| ORM              | **Prisma 7** + `@prisma/adapter-pg`         |
| Database         | PostgreSQL (Supabase)                       |
| Auth             | Clerk                                       |
| Storage          | Supabase Storage                            |
| Styling          | Tailwind CSS v4                             |
| Animations       | Framer Motion 12                            |
| Email            | Resend + React Email                        |
| Validation       | Zod                                         |
| Testing          | Vitest 4 (unit + integration) + Playwright  |
| Package manager  | pnpm                                        |

---

## 🏛️ Architecture

The `bookings` module — the heart of the domain — is implemented following **Clean / Hexagonal Architecture**:

```
src/modules/bookings/
├── domain/            # Pure TypeScript, no external dependencies
│   ├── booking.ts             # Immutable entity with state transitions
│   ├── booking-message.ts     # Entity with content validation
│   ├── booking-status.ts      # Enum + canTransitionTo()
│   ├── booking-id.ts          # UUID value object
│   ├── proposed-date.ts       # Value object enforcing "future date" rule
│   └── errors.ts              # Typed domain errors
│
├── application/       # Use cases + ports (interfaces)
│   ├── ports/
│   │   ├── booking-repository.ts
│   │   ├── booking-message-repository.ts
│   │   ├── notification-service.ts
│   │   └── clock.ts
│   └── use-cases/
│       ├── create-booking.ts
│       ├── accept-booking.ts
│       ├── reject-booking.ts
│       ├── confirm-booking.ts
│       ├── complete-booking.ts
│       ├── cancel-booking.ts
│       ├── add-message-to-booking.ts
│       └── get-artist-bookings.ts
│
├── infrastructure/    # Real adapters facing the outside world
│   ├── prisma-booking-repository.ts
│   ├── prisma-booking-message-repository.ts
│   ├── resend-notification-service.ts
│   └── system-clock.ts
│
├── test-support/      # Reusable fakes / in-memory adapters for tests
│
└── composition-root.ts   # Manual dependency wiring
```

The **Server Actions** (`src/app/actions/bookings.ts`, `src/app/actions/booking-public.ts`) act as thin controllers: they handle auth with Clerk, resolve the `artistId`, and delegate to the use cases via the `composition-root`.

📄 Read the full ADR in [`ARCHITECTURE.md`](./ARCHITECTURE.md) — covers technical decisions, alternatives considered, and success metrics.

### Golden rule

Dependency arrows point inward:

```
Presentation → Application → Domain ← Infrastructure
```

`Domain` knows nothing. `Application` only knows `Domain` and its own `ports`. `Infrastructure` implements those ports. Practical consequence: **the domain runs tests in milliseconds**, with no DB, no network, no mocks.

---

## ✅ Tests

| Type              | Command                  | Notes                                                  |
|-------------------|--------------------------|--------------------------------------------------------|
| Unit              | `pnpm test:unit`         | Domain + use cases with fakes. **~150 ms, 94 tests.** |
| Integration       | `pnpm test:integration`  | Prisma adapters against a real DB. Requires `DATABASE_URL`. |
| E2E (screenshots) | `pnpm test:e2e`          | Playwright on visual flows.                            |

Domain tests touch neither network nor DB. Use case tests use **in-memory adapters** (see `src/modules/bookings/test-support/`). Only the concrete adapter tests hit Postgres.

---

## 🚀 Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env in the root (see "Environment variables" below)

# 3. Sync the schema (dev only)
pnpm db:push

# 4. Apply the RLS lockdown and revokes (idempotent)
psql "$DATABASE_URL" -f prisma/security/01-rls-lockdown.sql

# 5. Dev server
pnpm dev
```

### Environment variables

`.env*` is gitignored. Create a `.env` file in the root with these keys (all values below are **placeholders**, not secrets):

```bash
# Supabase Postgres (used via @prisma/adapter-pg in src/lib/prisma.ts)
DATABASE_URL=postgresql://user:password@host:5432/db

# Supabase Auth + Storage (Service Role key is used by the upload API route)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clerk Auth (publishable + secret are read implicitly by @clerk/nextjs)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Resend (email notifications from the Bookings module)
RESEND_API_KEY=re_...

# App URL (used for action links in email templates)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk user_id for the demo account (see "Demo account" below)
DEMO_CLERK_USER_ID=user_xxxxxxxxxxxxxxxxxx

# Optional: bypass auth + mock data in development
# NEXT_PUBLIC_DEMO_MODE=true
```

To browse the dashboard without logging in, uncomment `NEXT_PUBLIC_DEMO_MODE=true` and run in development.

---

## 🎭 Demo account

The landing page has an **"Enter as demo"** button that signs anyone in as a demo artist, with no email or password. It exists so a recruiter can play around with the real dashboard (not mocks) in seconds.

**How it works**:

1. Click → the `enterAsDemo()` server action calls `clerkClient.signInTokens.createSignInToken({ userId: DEMO_CLERK_USER_ID })` to mint a Clerk ticket.
2. The client consumes it with `signIn.create({ strategy: 'ticket', ticket })` + `setActive({ session })` (legacy API from `@clerk/nextjs/legacy`).
3. Redirect to `/dashboard` with the session active.

**Daily reset**: at 03:00 UTC the `.github/workflows/demo-reset.yml` workflow wipes and re-seeds the account (artist + 9 bookings + 3 blocked dates + 3 messages, with dates relative to today). Nobody can break the demo permanently.

### Setting up the demo account (when forking)

1. **Create the user in Clerk**: Clerk dashboard → Users → Create user. Any email (`demo@yourapp.dev`), any password (won't be used). Copy the `user_id`.
2. **Local**: add `DEMO_CLERK_USER_ID=user_xxx` to `.env`.
3. **Seed the DB the first time**: `pnpm dlx tsx prisma/seed.ts`. You'll see `Seeded 9 bookings + 3 blocked dates for alex-rivera-tattoo`.
4. **Enable the cron**: in GitHub → Settings → Secrets → Actions, create two secrets:
   - `DATABASE_URL_PROD` — the full production DB URL
   - `DEMO_CLERK_USER_ID` — the same `user_id`

From that point on the workflow runs itself every day.

---

## 📦 Deploy

**Manual deploy via tags** — commits to `master` do not deploy.

```bash
git tag v1.2.3
git push origin v1.2.3
```

- Auto-deploy disabled in `vercel.json` (`"deploymentEnabled": false`).
- GitHub Actions (`.github/workflows/deploy-on-tag.yml`) only deploys on `v*` tags.

---

## 🎯 What I learned building this

> Honest section. Not everything in production is perfect; this is a portfolio project and you can tell where effort was invested and where it wasn't.

- **Server Actions ≠ silver bullets.** Calling Server Actions from `useEffect` is a subtle but important anti-pattern: it fetches data *after* first paint, blocks streaming, and bypasses Vercel's network. The right move is to pass data as props from a parent Server Component. [See the fix commit](https://github.com/Cristiangp/my_tattoo/commits/master).
- **The Adapter Pattern pays dividends early.** Migrating `updateBookingStatus` from a tangled Server Action (Prisma + Resend + state + inline emails) to a use-case pipeline took time. But today I can run 94 tests in 150 ms and know business logic works, without booting anything.
- **`Result<T,E>` isn't always the answer.** In TypeScript, typed errors via classes (`InvalidStatusTransitionError`, `UnauthorizedBookingAccessError`) give useful stack traces and play naturally with the `try/catch` already in Server Actions. Cheaper to adopt and just as effective.
- **Queries can skip the domain.** Not everything needs to go through a use case. Reads that return enriched data via `include: { messages }` live better as direct Prisma queries — forcing them through a "pure" repository would be over-engineering.

---

## 🔒 Security notes (demo project)

InkApp is a **portfolio demo project**, not an app with real traffic or real money. The MVP covers the booking cycle (request → accept → confirm → complete). Actual payment processing is deliberately out of scope — the artist coordinates the deposit with the client through their own channels. Some production-grade measures are also off the table:

- Online payments (Stripe / Adyen / similar) and their signed webhooks
- Distributed rate limiting (Upstash / Vercel KV)
- Email retry queue

What IS in place:

- State transition validation at the domain level (not in the caller).
- Ownership checks on every booking mutation (`booking.isOwnedBy(artistId)`).
- Identity checks on messages: the client can only write if their email matches the booking; the artist can only write if they authenticated with Clerk and own the booking.

---

## 📁 More documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Full ADR with technical decisions
- [`AGENTS.md`](./AGENTS.md) — Project conventions for agents and contributors
- [`plans/`](./plans/) — Internal roadmap and blueprints

---

*"Concepts > Code. AI is a tool, we direct."*
