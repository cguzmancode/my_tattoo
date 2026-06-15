-- Keepalive RPC for free-tier auto-pause prevention.
--
-- Supabase pauses free-tier projects after 7 days of inactivity. The detector
-- is driven by DATABASE activity, so the keepalive must touch Postgres.
-- The CI workflow (.github/workflows/supabase-keepalive.yml) calls this via
-- PostgREST: POST /rest/v1/rpc/keepalive with the anon key.
--
-- The function runs a trivial query, returns only server time, and reads no
-- application data. EXECUTE is granted to anon only.
--
-- Apply on a fresh DB:
--   psql "$DATABASE_URL" -f prisma/keepalive.sql

create or replace function public.keepalive()
returns timestamptz
language sql
security invoker
as $$
  select now();
$$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;
