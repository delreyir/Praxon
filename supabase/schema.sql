-- Konnex Bounty Board — Supabase schema (v0.1)
-- Apply via: Supabase dashboard → SQL editor → run this file.
-- Idempotent: safe to re-run; uses CREATE ... IF NOT EXISTS where supported.

-- ──────────────────────────────────────────────────────────────────────────
-- Enums
-- ──────────────────────────────────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_type where typname = 'bounty_status') then
    create type bounty_status as enum (
      'draft',     -- pool funding open
      'open',      -- submitted to Konnex, awaiting bid
      'matched',   -- miner matched, executing
      'proving',   -- PoPW bundle being verified
      'settled',   -- validators released payment
      'failed',    -- deadline missed / slashed
      'cancelled'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'subnet_id') then
    create type subnet_id as enum (
      'sn.roboarm.sim',
      'sn.drone.nav',
      'sn.slam.3d'
    );
  end if;
end$$;

-- ──────────────────────────────────────────────────────────────────────────
-- Bounties
-- A community-funded campaign that, once funded, becomes a single Konnex Job.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.bounties (
  id                text primary key,                  -- e.g. "bnty_<ULID>"
  title             text        not null,
  description       text        not null default '',
  subnet            subnet_id   not null,
  prompt            text        not null,
  target_reward     numeric(18,6) not null check (target_reward > 0),
  stake             numeric(18,6) not null default 0 check (stake >= 0),
  deadline_seconds  integer     not null check (deadline_seconds > 0),
  pooled            numeric(18,6) not null default 0 check (pooled >= 0),
  contributor_count integer     not null default 0 check (contributor_count >= 0),
  status            bounty_status not null default 'draft',
  created_at        timestamptz not null default now(),
  created_by        text        not null,              -- SS58 address

  -- Konnex-side anchors (filled after submission/settlement)
  job_id            text,
  job_hash          text,
  bundle_uri        text,

  -- Validator score (settled state)
  score_safety      numeric(4,2),
  score_task_match  numeric(4,2),
  score_efficiency  numeric(4,2),
  score_coherence   numeric(4,2),
  score_overall     numeric(4,2)
);

create index if not exists bounties_status_idx
  on public.bounties (status, created_at desc);
create index if not exists bounties_subnet_idx
  on public.bounties (subnet, created_at desc);
create index if not exists bounties_created_by_idx
  on public.bounties (created_by, created_at desc);

-- ──────────────────────────────────────────────────────────────────────────
-- Contributions
-- Each sponsor transfer to the platform pool wallet for a bounty.
-- ──────────────────────────────────────────────────────────────────────────

create table if not exists public.bounty_contributions (
  id           bigserial primary key,
  bounty_id    text        not null references public.bounties(id) on delete cascade,
  contributor  text        not null,                   -- SS58 address
  amount       numeric(18,6) not null check (amount > 0),
  tx_hash      text,                                   -- onchain transfer hash
  at           timestamptz not null default now()
);

create index if not exists contributions_bounty_idx
  on public.bounty_contributions (bounty_id, at desc);
create index if not exists contributions_contributor_idx
  on public.bounty_contributions (contributor, at desc);

-- Maintain bounty.pooled and contributor_count in sync via triggers.
create or replace function public.sync_bounty_pool()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.bounties
       set pooled            = pooled + new.amount,
           contributor_count = (
             select count(distinct contributor)
               from public.bounty_contributions
              where bounty_id = new.bounty_id
           )
     where id = new.bounty_id;
  elsif tg_op = 'DELETE' then
    update public.bounties
       set pooled            = greatest(0, pooled - old.amount),
           contributor_count = (
             select count(distinct contributor)
               from public.bounty_contributions
              where bounty_id = old.bounty_id
           )
     where id = old.bounty_id;
  end if;
  return null;
end$$ language plpgsql;

drop trigger if exists trg_contributions_sync on public.bounty_contributions;
create trigger trg_contributions_sync
  after insert or delete on public.bounty_contributions
  for each row execute function public.sync_bounty_pool();

-- ──────────────────────────────────────────────────────────────────────────
-- Sponsor reputation (computed view)
-- Aggregates contributions + outcomes across bounties.
-- Materialized view for cheap reads on the leaderboard.
-- ──────────────────────────────────────────────────────────────────────────

create or replace view public.sponsor_reputation as
with contrib as (
  select
    contributor as address,
    sum(amount)          as total_sponsored,
    count(distinct bounty_id) as bounties_contributed
    from public.bounty_contributions
   group by contributor
),
created as (
  select created_by as address, count(*) as bounties_created
    from public.bounties group by created_by
),
outcomes as (
  select
    c.contributor as address,
    count(*) filter (where b.status = 'settled') as successful_settlements,
    count(*) filter (where b.status = 'failed')  as failed_settlements
    from public.bounty_contributions c
    join public.bounties b on b.id = c.bounty_id
   group by c.contributor
)
select
  coalesce(co.address, cr.address, ou.address) as address,
  coalesce(co.total_sponsored, 0)       as total_sponsored,
  coalesce(cr.bounties_created, 0)      as bounties_created,
  coalesce(co.bounties_contributed, 0)  as bounties_contributed,
  coalesce(ou.successful_settlements, 0) as successful_settlements,
  coalesce(ou.failed_settlements, 0)    as failed_settlements,
  -- Score: success-weighted, scaled 0..100
  least(
    100,
    round(
      (coalesce(ou.successful_settlements, 0) * 10
       + coalesce(co.total_sponsored, 0) * 0.5
       - coalesce(ou.failed_settlements, 0) * 5)::numeric,
      2
    )
  ) as score
from contrib co
full outer join created cr on cr.address = co.address
full outer join outcomes ou on ou.address = coalesce(co.address, cr.address);

-- ──────────────────────────────────────────────────────────────────────────
-- Row-Level Security
-- Public reads (anon role) for bounties + contributions; writes via service role only.
-- ──────────────────────────────────────────────────────────────────────────

alter table public.bounties              enable row level security;
alter table public.bounty_contributions  enable row level security;

drop policy if exists "bounties: read"    on public.bounties;
create policy "bounties: read" on public.bounties
  for select to anon, authenticated using (true);

drop policy if exists "contributions: read" on public.bounty_contributions;
create policy "contributions: read" on public.bounty_contributions
  for select to anon, authenticated using (true);

-- Writes are intentionally restricted to the service role (used server-side
-- by API routes). Direct anon inserts are blocked.
