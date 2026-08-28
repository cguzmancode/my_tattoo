-- Keepalive RPC. The GitHub Actions keepalive workflow calls
-- public.keepalive() through PostgREST so Supabase counts the project as
-- active and does not pause it for inactivity.
--
-- The free-tier inactivity detector measures activity arriving through the
-- auto-generated API (PostgREST) — direct Postgres connections and Auth
-- config reads do not register. A trivial SQL function invoked via
-- /rest/v1/rpc/ is enough: the request flows through the layer the
-- detector observes and executes real SQL against Postgres.
--
-- This matches the function deployed on both projects (verified 2026-08-28).
-- Functions default to EXECUTE for PUBLIC, which covers the anon role the
-- workflow authenticates with. It exposes only the server time.
--
-- This script is idempotent: re-running it is safe.

CREATE OR REPLACE FUNCTION public.keepalive()
RETURNS timestamptz
LANGUAGE sql
AS $$
  select now();
$$;

-- Legacy of the earlier PATCH-based keepalive iteration. The current RPC
-- does not touch it; it stays locked down (RLS on, API roles revoked) and
-- harmless. Kept here so a fresh database matches the deployed ones.
CREATE TABLE IF NOT EXISTS public._keepalive (
  id        INT         PRIMARY KEY,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public._keepalive (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public._keepalive ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public._keepalive FROM anon, authenticated;
