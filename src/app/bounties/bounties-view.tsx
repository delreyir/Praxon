"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BountyCard } from "@/components/bounty-card";
import { SUBNET_LIST, type SubnetId } from "@/lib/konnex/subnets";
import type { Bounty, BountyStatus } from "@/lib/konnex/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: Array<{ value: "all" | BountyStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Funding" },
  { value: "open", label: "Open" },
  { value: "matched", label: "Executing" },
  { value: "proving", label: "Proving" },
  { value: "settled", label: "Settled" },
  { value: "failed", label: "Failed" },
];

export function BountiesView({ bounties }: { bounties: Bounty[] }) {
  const [query, setQuery] = useState("");
  const [subnet, setSubnet] = useState<"all" | SubnetId>("all");
  const [status, setStatus] = useState<"all" | BountyStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bounties.filter((b) => {
      if (subnet !== "all" && b.subnet !== subnet) return false;
      if (status !== "all" && b.status !== status) return false;
      if (
        q &&
        !b.title.toLowerCase().includes(q) &&
        !b.prompt.toLowerCase().includes(q) &&
        !b.description.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [bounties, query, subnet, status]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bounties, prompts, subnets…"
            className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
          <FilterChip
            active={subnet === "all"}
            onClick={() => setSubnet("all")}
          >
            All subnets
          </FilterChip>
          {SUBNET_LIST.map((s) => (
            <FilterChip
              key={s.id}
              active={subnet === s.id}
              onClick={() => setSubnet(s.id)}
            >
              <span className="mr-1">{s.emoji}</span>
              {s.shortName}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            active={status === f.value}
            onClick={() => setStatus(f.value)}
            small
          >
            {f.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] py-16 text-center">
          <Badge variant="outline" className="mb-3">
            No bounties match
          </Badge>
          <p className="text-sm text-[var(--muted-foreground)]">
            Try clearing filters or{" "}
            <Link
              href="/bounties/new"
              className="text-[var(--primary)] underline-offset-4 hover:underline"
            >
              create a new bounty
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BountyCard key={b.id} bounty={b} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  small,
  children,
}: {
  active: boolean;
  onClick: () => void;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        small ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-sm",
        active
          ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      )}
    >
      {children}
    </button>
  );
}
