import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRepository } from "@/lib/db";
import { cn } from "@/lib/utils";
import { BountiesView } from "./bounties-view";

export const dynamic = "force-dynamic";

export default async function BountiesPage() {
  const repo = getRepository();
  const bounties = await repo.listBounties({ limit: 100 });

  const total = bounties.length;
  const open = bounties.filter(
    (b) => b.status === "draft" || b.status === "open",
  ).length;
  const settled = bounties.filter((b) => b.status === "settled").length;
  const pooled = bounties.reduce((s, b) => s + b.pooled, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Bounties
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Real subnet tasks funded by sponsor pools. Each bounty becomes a
            Konnex Job once fully funded.
          </p>
        </div>
        <Button asChild>
          <Link href="/bounties/new">
            <Plus className="h-4 w-4" /> Create bounty
          </Link>
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatBox label="Total bounties" value={String(total)} />
        <StatBox label="Open / funding" value={String(open)} accent />
        <StatBox label="Settled" value={String(settled)} />
        <StatBox
          label="Pooled (testKNX)"
          value={pooled.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        />
      </div>

      <BountiesView bounties={bounties} />
    </div>
  );
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] bg-[var(--card)] p-4",
        accent && "border-[var(--primary)]/30 bg-[var(--primary)]/5",
      )}
    >
      <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
