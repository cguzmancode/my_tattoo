# Database keepalive

Free-tier Supabase projects pause after 7 days of inactivity, and the
detector measures activity arriving through the auto-generated API
(PostgREST) — direct Postgres connections and Auth config reads do not
register. The `Supabase Keepalive` GitHub Actions workflow therefore calls
a small RPC through PostgREST on every run.

## When to run

Once per Supabase project (dev and prod), after the schema is in place:

```bash
psql "$DATABASE_URL" -f prisma/keepalive/01-init.sql
```

The script is idempotent — re-running it is safe. It creates the
`public.keepalive()` function (and the legacy `_keepalive` table, see below).

## What the workflow does

`.github/workflows/supabase-keepalive.yml` runs daily and sends, for each
project:

```http
POST https://<project-ref>.supabase.co/rest/v1/rpc/keepalive
apikey: <anon key>
Authorization: Bearer <anon key>
Content-Type: application/json

{}
```

The RPC is a trivial `select now()`: the request executes real SQL through
the PostgREST layer the detector observes, and returns only the server
time — it reads no application data and needs no elevated role.

Required GitHub secrets:

- `SUPABASE_PROD_ANON_KEY` — anon key for `my_tattoo`
- `SUPABASE_DEV_ANON_KEY` — anon key for `my_tattoo_dev`

The project refs are hardcoded in the workflow because they live in the
public host name.

## The `_keepalive` table

A remnant of the earlier PATCH-based iteration of this workflow (see git
history: UPDATE → PATCH → auth settings → RPC). The current RPC does not
touch it. It stays in the init script so fresh databases match the deployed
ones, locked down like every other table: RLS enabled, all grants revoked
from `anon`/`authenticated`.

## Why outside Prisma

Operational plumbing, not part of the domain model. Keeping it out of
`schema.prisma` avoids polluting the generated Prisma Client with types
nobody uses.
