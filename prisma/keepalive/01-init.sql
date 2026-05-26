-- Keepalive heartbeat table. The GitHub Actions keepalive workflow updates
-- this row periodically so Supabase counts the project as active and does
-- not pause it for inactivity.
--
-- A plain `SELECT 1;` is not enough — Supabase's inactivity detector tracks
-- writes against user tables. An UPDATE on this row is what registers.
--
-- This script is idempotent: re-running it is safe.

CREATE TABLE IF NOT EXISTS public._keepalive (
  id        INT         PRIMARY KEY,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public._keepalive (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public._keepalive ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public._keepalive FROM anon, authenticated;
