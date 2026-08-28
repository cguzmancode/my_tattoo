# InkApp - Agent Instructions

> Next.js 16 App Router + Prisma 7 + Supabase + Clerk + Tailwind v4

---

## Critical Constraints

- **NEVER COMMIT** unless explicitly instructed. Wait for "commit" command.
- **NEVER UPGRADE** dependencies. Locked: Next.js 16.2.3, Prisma 7.7.0, Clerk 7.2.1.
- **Prisma 7** requires `@prisma/adapter-pg`. Import from `@/lib/prisma`, never `new PrismaClient()`.
- **Clerk middleware** lives at `src/proxy.ts` (Next 16 filename — the legacy `middleware.ts` was renamed). There is no root-level middleware/proxy file.
- **Tests run sequentially** (`fileParallelism: false` in vitest.config.ts) - don't change this.
- **Server Actions** for dashboard mutations, **Route Handlers** for public APIs/webhooks.
- **NEVER call Server Actions from useEffect** - causes "Server Functions cannot be called during initial render" error. Pass data as props from Server Components instead.
- **Development mode bypass**: Pages check `process.env.NODE_ENV === 'development'` to show mock data without auth.
- **Date serialization**: Server Actions cannot pass `Date` objects. Pass strings (YYYY-MM-DD or ISO) and convert.

---

## Quick Commands

```bash
pnpm dev                    # Dev server (Turbopack)
pnpm test:unit              # Fast unit tests (no DB)
pnpm test:integration       # DB tests (requires DATABASE_URL)
pnpm test __tests__/integration/api/bookings.test.ts  # Single test
pnpm test:e2e               # Playwright screenshots
pnpm db:push                # Push schema changes (dev only)
pnpm db:generate            # Generate Prisma Client after schema changes
pnpm db:studio              # Prisma Studio GUI
```

---

## Architecture

### Entry Points
- **App Router**: `src/app/` - Next.js 16 App Router (NOT Pages Router)
- **Public APIs**: `src/app/api/**/route.ts` - Webhooks, bookings, payments
- **Server Actions**: `src/app/actions/*.ts` - `'use server'` for dashboard mutations
- **DB Client**: `src/lib/prisma.ts` - Single instance with PrismaPg adapter

### Key Directories
```
src/
├── app/
│   ├── actions/          # Server Actions (bookings, profile, calendar, upload)
│   ├── api/              # Route Handlers (public APIs, webhooks)
│   └── layout.tsx        # ClerkProvider wraps body
├── lib/
│   ├── prisma.ts         # Database client (USE THIS - has adapter)
│   ├── mocks/            # Demo data for development mode
│   └── supabase/         # SSR client helpers
├── components/
│   ├── dashboard/        # Stats, BookingList
│   ├── calendar/         # CalendarView (needs onBlockDate/onUnblockDate)
│   ├── profile/          # ProfileForm (handles image uploads)
│   └── public/           # Public-facing components (artist profiles)
└── __tests__/
    ├── unit/             # Zod schemas, utilities
    ├── integration/      # DB tests (sequential - fileParallelism: false)
    └── e2e/              # Playwright screenshots
```

---

## Testing

| Type | Command | Notes |
|------|---------|-------|
| Unit | `pnpm test:unit` | Fast, no DB |
| Integration | `pnpm test:integration` | Requires `DATABASE_URL` in `.env` |
| E2E | `pnpm test:e2e` | Playwright, screenshots in `test-results/screenshots/` |

**Pattern**: Each integration test creates unique data: `test_${Date.now()}_${random}`

---

## Database (Prisma 7)

```typescript
// ALWAYS import from here - has @prisma/adapter-pg configured
import { prisma } from '@/lib/prisma'
```

**Schema Conventions**:
- `Artist.clerkId` → Clerk user ID (`await auth()`)
- `Artist.slug` → Public profile URL `/t/{slug}`
- `Booking.status` → Flow: PENDING → ACCEPTED → CONFIRMED → COMPLETED
- `BlockedDate.date` → `@db.Date` (date-only, no time component)

**Security scripts** (not expressed in `schema.prisma`):
- Apply RLS + role revokes via `psql "$DATABASE_URL" -f prisma/security/01-rls-lockdown.sql` after `pnpm db:push` on a fresh DB.
- Rate limiting is Postgres-backed: create its table with `psql "$DATABASE_URL" -f prisma/rate-limit/01-init.sql` (idempotent; the limiter fails open if the table is missing).
- See `prisma/security/README.md` for details.

---

## Auth (Clerk)

**Server Actions**:
```typescript
'use server'
import { auth } from '@clerk/nextjs/server'

export async function myAction() {
  const { userId } = await auth()
  if (!userId && process.env.NODE_ENV !== 'development') {
    throw new Error('Unauthorized')
  }
  // artist.clerkId === userId
}
```

**Components**: Use `<Show when="signed-in">` (not deprecated `<SignedIn>`)

---

## Environment Variables

Required in `.env` (ignored by git). All values below are placeholders.

```bash
# Supabase Postgres (used via @prisma/adapter-pg in src/lib/prisma.ts)
DATABASE_URL=postgresql://user:password@host:5432/db

# Supabase Auth + Storage (Service Role key is used by upload API route)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clerk Auth (publishable + secret are read implicitly by @clerk/nextjs)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Resend (email notifications — Bookings notification service)
RESEND_API_KEY=re_...

# App URL (used in email templates for action links)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: bypass auth and show mock data in development
# NEXT_PUBLIC_DEMO_MODE=true
```

**Not required** despite appearing in older `.env.example`:
- `DIRECT_URL` — `prisma/schema.prisma` does not declare `directUrl = env(...)`.
- `STRIPE_*` — Stripe SDK is not installed; `src/lib/api/webhooks/stripe.ts` and `src/app/api/webhooks/stripe/route.ts` are stubs.
- `CRON_SECRET` — referenced only in README, not in code.

---

## Common Mistakes

❌ Don't `new PrismaClient()` → ✅ Import from `@/lib/prisma`

❌ Don't use Server Actions for public APIs → ✅ Use Route Handlers in `src/app/api/`

❌ Don't change `fileParallelism: false` in vitest.config.ts → ✅ Tests must run sequentially

❌ Don't use `new Date()` in tests → ✅ Use `Date.now()` + random for unique IDs

❌ Don't pass `Date` objects to Server Actions → ✅ Pass strings (YYYY-MM-DD) and convert

❌ Don't move the proxy file to root → ✅ `src/proxy.ts` is the only file Clerk picks up with the src/ layout

---

## File Patterns

| Type | Pattern |
|------|---------|
| Tests | `**/*.test.ts` |
| Server Actions | `src/app/actions/*.ts` with `'use server'` |
| API Routes | `src/app/api/**/route.ts` |
| Components | `src/components/**/*.tsx` |

---

## Dependencies

- **Next.js**: 16.2.3 (App Router has breaking changes from v14)
- **Prisma**: 7.7.0 (requires `@prisma/adapter-pg` for postgres)
- **Clerk**: 7.2.1
- **Tailwind**: v4
- **Vitest**: 4.1.4 (tests run sequentially)
- **React**: 19.2.4

---

## Documentation

- **Next.js 16**: `node_modules/next/dist/docs/`
- **Plans**: `/plans/` - Architecture blueprints
- **Screenshots**: `test-results/screenshots/` - E2E visual reference
- **Bug Tracking**: `/plans/BUGFIX-AND-IMPROVEMENTS.md`

---

## Repo-Specific Gotchas

1. **Prisma 7 + Adapter Pattern**: Must use `@prisma/adapter-pg` and instantiate with adapter. Never use bare `new PrismaClient()`.

2. **Single Proxy File**: Clerk middleware lives at `src/proxy.ts` (Next 16 filename, the project uses the `src/` Next layout).

3. **Date Handling with Server Actions**: Dates cannot pass client→server boundary as objects. Pass YYYY-MM-DD strings and convert to Date in actions.

4. **Image Upload Flow**: Images compressed to JPEG but keep original extension. Upload to Supabase Storage → get public URL → save URL to DB.

5. **Development Mode**: Set `NEXT_PUBLIC_DEMO_MODE=true` to bypass auth and see mock data. Check `process.env.NODE_ENV === 'development'` in pages.

6. **Test Isolation**: Integration tests create unique data with `test_${Date.now()}_${random}`. This prevents collisions during sequential runs.

---

## Deploy Workflow

**Manual deploy only via tags** - Commits to `master` do NOT deploy automatically.

```bash
# Create and push tag to deploy
git tag v1.2.3
git push origin v1.2.3
```

- Config: `.github/workflows/deploy-on-tag.yml` triggers on `v*` tags
- `vercel.json` has `"deploymentEnabled": false` to disable auto-deploy
- Use `[skip ci]` in commit message to skip GitHub Actions

