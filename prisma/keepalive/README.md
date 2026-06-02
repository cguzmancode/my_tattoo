# Database keepalive

Singleton table that the `Supabase Keepalive` GitHub Actions workflow updates
on every run. Supabase's free-tier inactivity detector measures activity at
the auto-generated API (PostgREST) — direct Postgres connections do not
register. The workflow therefore PATCHes this row through PostgREST so the
request flows through the layer the detector observes.

## When to run

Once per Supabase project (dev and prod), after the schema is in place:

```bash
psql "$DATABASE_URL" -f prisma/keepalive/01-init.sql
```

The script is idempotent — re-running it is safe.

## What the workflow does

`.github/workflows/supabase-keepalive.yml` runs every 3 days and sends, for
each project:

```http
PATCH https://<project-ref>.supabase.co/rest/v1/_keepalive?id=eq.1
apikey: <service_role>
Authorization: Bearer <service_role>
Content-Type: application/json
Prefer: return=minimal

{"last_ping": "<runner UTC timestamp, ISO 8601>"}
```

Required GitHub secrets:

- `SUPABASE_PROD_SERVICE_ROLE_KEY` — service_role key for `my_tattoo`
- `SUPABASE_DEV_SERVICE_ROLE_KEY` — service_role key for `my_tattoo_dev`

The project refs are hardcoded in the workflow because they live in the
public host name.

`service_role` is used so the request bypasses RLS while still being
explicitly scoped to this single-row table (which has RLS on and revokes
`anon`/`authenticated` access).

## Why outside Prisma

`_keepalive` is operational plumbing, not part of the domain model. Keeping
it out of `schema.prisma` avoids polluting the generated Prisma Client with
a type nobody uses.
