# Praxon

> **The work layer for autonomous systems.**
> Sponsor real physical work on the [Konnex](https://konnex.world) network.

Praxon is a community-funded marketplace for real subnet tasks on Konnex.
Sponsors pool **testKNX**, miners on Konnex subnets execute, validators
score, and **Proof-of-Physical-Work (PoPW)** certifies settlement onchain.

The protocol already documents primitives for third-party sponsorship —
`TaskRegistry`, `BondMatrix`, `StakeVault`, `PayoutRouter`. Praxon surfaces
those primitives so anyone can fund and settle real subnet work, not just
enterprise counterparties.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4**
- **Polkadot.js** + SubWallet integration
- **Supabase** (Postgres) — falls back to in-memory mock if env not set
- **Konnex HTTP API** (`POST /api/v1/tasks`) — see [docs](https://docs.konnex.world/sdk/http)

## Getting started

```bash
# 1) Install
npm install

# 2) (Optional) Configure Supabase — see supabase/README.md
#    Without env vars, the app uses in-memory mock data.

# 3) Run dev server
npm run dev
```

Open <http://localhost:3000>.

### Optional environment

Create `.env.local`:

```dotenv
# Supabase (optional — mock used if absent)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Platform pool wallet (where sponsors send testKNX before task submission)
NEXT_PUBLIC_PLATFORM_SPONSOR_ADDRESS=5...

# Override Konnex API base if needed
# NEXT_PUBLIC_KONNEX_API_BASE=https://api.testnet.konnex.world
```

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Landing
│   ├── bounties/             # List + detail + create
│   ├── leaderboard/          # Sponsor reputation (placeholder)
│   ├── how-it-works/
│   └── api/
│       ├── bounties/         # GET (list), POST (create)
│       ├── bounties/[id]/    # GET (detail)
│       └── sponsors/top/     # GET (leaderboard)
├── components/
│   ├── ui/                   # Button, Card, Badge, Progress
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── bounty-card.tsx
│   ├── status-badge.tsx
│   ├── contribute-card.tsx
│   └── wallet-connect-button.tsx
├── lib/
│   ├── konnex/               # Config, subnets, types, HTTP + chain clients
│   ├── db/                   # Repository pattern (mock + Supabase)
│   └── mock/                 # Fixtures
├── providers/
│   ├── query-provider.tsx
│   └── wallet-provider.tsx
└── ...

supabase/
├── schema.sql                # DB schema (Postgres + RLS + triggers)
└── README.md                 # Setup guide

scripts/
└── seed.ts                   # Populate Supabase with mock fixtures
```

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET`  | `/api/bounties`                       | List bounties (filters: `subnet`, `status`, `q`, `limit`, `offset`) |
| `POST` | `/api/bounties`                       | Create a bounty (status `draft`) |
| `GET`  | `/api/bounties/:id`                   | Bounty detail + contributions |
| `POST` | `/api/bounties/:id/contribute`        | Record a sponsor contribution |
| `GET`  | `/api/sponsors/top`                   | Leaderboard (top reputation) |

## Status

Early v0.1 — landing, browse, detail, full backend wired. Next milestones:

- Live `/bounties/new` create flow
- Real testKNX transfer for contributions (Polkadot.js signing)
- Sponsor profile pages + reputation NFT minting
- Background settlement watcher (poll Konnex `JobID` for status)

## License

This is an unofficial project. Not affiliated with the Konnex Foundation.
