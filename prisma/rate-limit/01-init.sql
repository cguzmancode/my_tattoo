-- Fixed-window rate limit buckets, updated atomically by src/lib/rate-limit.ts.
--
-- Why outside Prisma: operational plumbing, same reasoning as _keepalive —
-- keeping it out of schema.prisma avoids polluting the generated Prisma
-- Client with a type the domain never uses. Access goes through raw SQL.
--
-- Growth is bounded by distinct client IPs per route; stale rows are
-- harmless (they reset on next hit) and can be pruned at any time with:
--   DELETE FROM rate_limits WHERE window_start < now() - interval '1 day';
--
-- This script is idempotent: re-running it is safe.

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key          text PRIMARY KEY,
  count        integer     NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now()
);

-- Same lockdown as prisma/security/01-rls-lockdown.sql: Prisma connects as
-- the table owner (BYPASSRLS); PostgREST roles get nothing.
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.rate_limits FROM anon, authenticated
