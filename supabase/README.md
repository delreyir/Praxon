# Supabase setup

Praxon uses Supabase Postgres for off-chain bounty / contribution records.
**Without env vars configured, the app falls back to in-memory mock data**,
so you can develop and demo the UI without a Supabase project.

## 1. Create a project

1. Go to <https://supabase.com> → New project.
2. Note the **Project URL**, **anon public** key, and **service_role** key
   from `Settings → API`.

## 2. Apply the schema

In the Supabase dashboard:

1. Open **SQL Editor**.
2. Paste the contents of [`schema.sql`](./schema.sql) and run it.
3. Verify under **Table Editor** that `bounties` and `bounty_contributions`
   are present, and under **Database → Views** that `sponsor_reputation` is
   listed.

The schema is idempotent — safe to re-run after edits.

## 3. Configure environment

Create `.env.local` at the repo root with:

```dotenv
# Public (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Server-only — never expose to the browser
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Optional: where pool contributions get sent (SS58 address)
NEXT_PUBLIC_PLATFORM_SPONSOR_ADDRESS=5...

# Optional: override Konnex API base
# NEXT_PUBLIC_KONNEX_API_BASE=https://api.testnet.konnex.world
```

Restart the dev server after editing.

## 4. Seed mock data (optional)

```bash
npm run db:seed
```

This inserts the same fixtures used by the in-memory mock, so the UI looks
identical when switching to a real DB. Safe to re-run (uses upserts).

## Architecture notes

- **Reads** go through `anon` (public, RLS-protected to read-only).
- **Writes** go through API routes using the `service_role` key (server only).
- `bounty_contributions` has a trigger that keeps `bounties.pooled` and
  `contributor_count` in sync — so the app never has to update both columns
  itself.
- `sponsor_reputation` is a view; if it gets too slow, switch to a
  materialized view + scheduled refresh.
