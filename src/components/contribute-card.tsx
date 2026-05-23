"use client";

import { useState } from "react";
import { ArrowRight, Coins, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/providers/wallet-provider";
import { formatTKNX } from "@/lib/utils";

const QUICK_AMOUNTS = [1, 5, 10, 25];

export function ContributeCard({
  bountyId: _bountyId,
  remaining,
}: {
  bountyId: string;
  remaining: number;
}) {
  const { active, connect, isConnecting } = useWallet();
  const [amount, setAmount] = useState<string>("5");
  const [submitting, setSubmitting] = useState(false);
  const parsed = Number(amount);
  const valid =
    Number.isFinite(parsed) && parsed > 0 && parsed <= remaining + 0.0001;

  async function handleContribute() {
    if (!valid || !active) return;
    setSubmitting(true);
    try {
      // TODO: wire to API route once Supabase + chain transfer is in place.
      // For now this is a no-op preview.
      await new Promise((r) => setTimeout(r, 600));
      alert(
        `Preview: would transfer ${parsed} testKNX from ${active.address.slice(0, 8)}… to platform pool wallet, then record contribution to bounty ${_bountyId}.`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-[var(--primary)]/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Coins className="h-4 w-4 text-[var(--primary)]" />
          Contribute to pool
        </CardTitle>
        <CardDescription>
          Remaining: {formatTKNX(remaining)} testKNX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
            Amount (testKNX)
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 font-mono text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_AMOUNTS.filter((q) => q <= remaining).map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
            >
              {q}
            </button>
          ))}
          {remaining > 0 ? (
            <button
              onClick={() => setAmount(String(remaining))}
              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5"
            >
              Max ({formatTKNX(remaining)})
            </button>
          ) : null}
        </div>
        {!active ? (
          <Button
            className="w-full"
            onClick={connect}
            disabled={isConnecting}
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting…" : "Connect to contribute"}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleContribute}
            disabled={!valid || submitting}
          >
            {submitting ? "Submitting…" : "Contribute"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        <p className="text-[10px] text-[var(--muted-foreground)]">
          Your transfer goes to the platform pool wallet. Once the pool is
          fully funded, the task is submitted to Konnex via{" "}
          <code className="font-mono">POST /api/v1/tasks</code>.
        </p>
      </CardContent>
    </Card>
  );
}
