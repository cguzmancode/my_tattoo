# Database keepalive

Singleton table that the `Supabase Keepalive` GitHub Actions workflow updates
on every run. Supabase's free-tier inactivity detector only counts writes
against user tables — `SELECT 1;` does not register, which is why this
table exists.

## When to run

Once per Supabase project (dev and prod), after the schema is in place:

```bash
psql "$DATABASE_URL" -f prisma/keepalive/01-init.sql
```

The script is idempotent — re-running it is safe.

## What the workflow does

`.github/workflows/supabase-keepalive.yml` runs every 3 days and executes:

```sql
UPDATE public._keepalive SET last_ping = now() WHERE id = 1;
```

against both `SUPABASE_KEEPALIVE_DEV_URL` and `SUPABASE_KEEPALIVE_PROD_URL`.

## Why outside Prisma

`_keepalive` is operational plumbing, not part of the domain model. Keeping
it out of `schema.prisma` avoids polluting the generated Prisma Client with
a type nobody uses.
