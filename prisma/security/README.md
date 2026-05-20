# Database security scripts

Security posture for the public schema that is **not** expressed in
`prisma/schema.prisma`. Apply these after the schema is in place.

## When to run

On a fresh Supabase project, after:

```bash
pnpm db:push    # syncs schema.prisma → DB
```

Then, with `DATABASE_URL` pointing at the new DB:

```bash
psql "$DATABASE_URL" -f prisma/security/01-rls-lockdown.sql
```

All scripts are idempotent — re-running them is safe.

## What's here

### `01-rls-lockdown.sql`

Enables Row Level Security on the four public tables (`artists`,
`bookings`, `blocked_dates`, `booking_messages`) and revokes all
privileges from the API-exposed roles (`anon`, `authenticated`).

The app talks to the DB as the database owner (`postgres.<project_ref>`),
which has `BYPASSRLS`, so app reads/writes are unaffected. The lockdown
shuts down direct access via PostgREST / Supabase Storage / any client
holding the `anon` or `authenticated` JWT.

## Why outside Prisma migrations

This project uses `prisma db push` (schema-sync) rather than
`prisma migrate` (versioned migrations). RLS policies and role grants
are not part of `schema.prisma`, so they live here as standalone SQL.

If the project later adopts `prisma migrate`, fold these into the
migration history and delete this directory.
