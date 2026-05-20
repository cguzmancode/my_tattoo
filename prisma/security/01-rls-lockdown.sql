-- Lock down public tables: enable RLS and revoke direct access from the
-- API-exposed roles (anon, authenticated). Prisma connects as the database
-- owner (BYPASSRLS), so app reads/writes are unaffected.
--
-- Why this lives outside prisma/schema.prisma:
--   schema.prisma does not declare RLS or role grants. Until that changes,
--   security posture is applied as a one-shot SQL after `pnpm db:push`.
--
-- This script is idempotent: re-running it is safe.

ALTER TABLE public.artists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.artists          FROM anon, authenticated;
REVOKE ALL ON public.bookings         FROM anon, authenticated;
REVOKE ALL ON public.blocked_dates    FROM anon, authenticated;
REVOKE ALL ON public.booking_messages FROM anon, authenticated;
