import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  Circle,
  Clock,
  Cog,
  Copy,
  ExternalLink,
  Hash,
  Loader2,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { ContributeCard } from "@/components/contribute-card";
import { SUBNETS } from "@/lib/konnex/subnets";
import { KONNEX_CONFIG } from "@/lib/konnex/config";
import { getRepository } from "@/lib/db";
import type { BountyStatus, ValidatorScore } from "@/lib/konnex/types";
import {
  formatDeadline,
  formatTKNX,
  relativeTime,
  shortAddress,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function BountyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const repo = getRepository();
  const bounty = await repo.getBounty(id);
  if (!bounty) notFound();

  const subnet = SUBNETS[bounty.subnet];
  const contributions = await repo.getContributions(bounty.id);
  const required = bounty.targetReward + bounty.stake;
  const pct = Math.min(100, (bounty.pooled / required) * 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Link
        href="/bounties"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to bounties
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Header card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subnet.emoji}</span>
                  <div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {subnet.id}
                    </Badge>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {subnet.name}
                    </div>
                  </div>
                </div>
                <StatusBadge status={bounty.status} />
              </div>
              <CardTitle className="mt-4 text-2xl md:text-3xl">
                {bounty.title}
              </CardTitle>
              <CardDescription className="text-base">
                {bounty.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1.5 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  Task prompt
                </div>
                <pre className="whitespace-pre-wrap rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-4 font-mono text-sm">
                  {bounty.prompt}
                </pre>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Reward">
                  {formatTKNX(bounty.targetReward)}{" "}
                  <span className="text-xs text-[var(--muted-foreground)]">
                    testKNX
                  </span>
                </Metric>
                <Metric label="Sponsor stake">
                  {formatTKNX(bounty.stake)}{" "}
                  <span className="text-xs text-[var(--muted-foreground)]">
                    testKNX
                  </span>
                </Metric>
                <Metric label="Deadline">
                  {formatDeadline(bounty.deadlineSeconds)}
                </Metric>
                <Metric label="Created">{relativeTime(bounty.createdAt)}</Metric>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lifecycle</CardTitle>
              <CardDescription>
                Each step maps to a Konnex protocol primitive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline status={bounty.status} pct={pct} />
            </CardContent>
          </Card>

          {/* Score (if settled) */}
          {bounty.score ? <ScoreCard score={bounty.score} /> : null}

          {/* PoPW bundle (if available) */}
          {bounty.bundleUri ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Box className="h-5 w-5 text-[var(--primary)]" />
                  PoPW evidence bundle
                </CardTitle>
                <CardDescription>
                  Sensor pose, frames, IMU, torque, and policy execution trace
                  bound to the JobID.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <KeyValue
                  k="Bundle URI"
                  v={bounty.bundleUri}
                  mono
                  copyable
                />
                {bounty.jobHash ? (
                  <KeyValue
                    k="Instruction hash"
                    v={bounty.jobHash}
                    mono
                    copyable
                  />
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {/* Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-[var(--accent)]" />
                Sponsors ({contributions.length || bounty.contributorCount})
              </CardTitle>
              <CardDescription>
                Each contribution is publicly traceable on the testnet explorer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contributions.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No contribution history available yet.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {contributions.map((c, i) => (
                    <div
                      key={`${c.contributor}-${i}`}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] font-mono text-xs">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-mono">
                            {shortAddress(c.contributor)}
                          </div>
                          <div className="text-xs text-[var(--muted-foreground)]">
                            {relativeTime(c.at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-medium text-[var(--primary)]">
                          +{formatTKNX(c.amount)} testKNX
                        </div>
                        {c.txHash ? (
                          <a
                            href={`${KONNEX_CONFIG.network.explorer}/tx/${c.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          >
                            {c.txHash.slice(0, 10)}…
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {/* Pool funding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pool funding</CardTitle>
              <CardDescription>
                Required: reward + sponsor stake
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold tabular-nums">
                  {formatTKNX(bounty.pooled)}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  / {formatTKNX(required)} testKNX
                </span>
              </div>
              <Progress value={bounty.pooled} max={required} />
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">
                  {Math.round(pct)}% funded
                </span>
                <span className="text-[var(--muted-foreground)]">
                  {bounty.contributorCount} sponsors
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contribute */}
          {bounty.status === "draft" ? (
            <ContributeCard bountyId={bounty.id} remaining={required - bounty.pooled} />
          ) : null}

          {/* Onchain refs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="h-4 w-4 text-[var(--muted-foreground)]" />
                Onchain references
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {bounty.jobId ? (
                <KeyValue k="JobID" v={bounty.jobId} mono copyable />
              ) : (
                <p className="text-[var(--muted-foreground)]">
                  JobID assigned once the pool is funded and the task is
                  submitted.
                </p>
              )}
              {bounty.jobHash ? (
                <KeyValue
                  k="Instruction hash"
                  v={`${bounty.jobHash.slice(0, 14)}…`}
                  mono
                  copyable
                  copyValue={bounty.jobHash}
                />
              ) : null}
              <div className="pt-1">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a
                    href={`${KONNEX_CONFIG.network.explorer}${bounty.jobId ? `/job/${bounty.jobId}` : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on explorer <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Created by */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Created by</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/sponsors/${bounty.createdBy}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-[var(--muted)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-xs font-bold text-white">
                  {bounty.createdBy.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm">
                    {shortAddress(bounty.createdBy)}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    View sponsor profile
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ───── Sub components ───── */

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md bg-[var(--muted)]/50 p-3">
      <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold">{children}</div>
    </div>
  );
}

function KeyValue({
  k,
  v,
  mono,
  copyable,
  copyValue,
}: {
  k: string;
  v: string;
  mono?: boolean;
  copyable?: boolean;
  copyValue?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md bg-[var(--muted)]/30 px-3 py-2">
      <span className="text-xs text-[var(--muted-foreground)]">{k}</span>
      <span
        className={`flex items-center gap-1.5 truncate ${mono ? "font-mono" : ""}`}
        title={copyValue ?? v}
      >
        <span className="truncate">{v}</span>
        {copyable ? (
          <CopyButton value={copyValue ?? v} />
        ) : null}
      </span>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  // Server component — render a placeholder; client-only interactivity isn't
  // critical for v0.1 but we make it a simple non-interactive icon for now.
  // Will be replaced with a "use client" copy button in a follow-up.
  return (
    <span
      title={`Copy: ${value}`}
      className="text-[var(--muted-foreground)]"
      aria-hidden
    >
      <Copy className="h-3 w-3" />
    </span>
  );
}

function ScoreCard({ score }: { score: ValidatorScore }) {
  const rows: Array<{ k: string; v: number }> = [
    { k: "Safety", v: score.safety },
    { k: "Task match", v: score.taskMatch },
    { k: "Efficiency", v: score.efficiency },
    ...(score.coherence !== undefined
      ? [{ k: "Coherence", v: score.coherence }]
      : []),
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />
            Validator score
          </CardTitle>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
              Overall
            </div>
            <div className="text-3xl font-bold text-[var(--primary)]">
              {score.overall.toFixed(1)}
              <span className="text-base text-[var(--muted-foreground)]">
                /10
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div key={r.k} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{r.k}</span>
              <span className="font-mono">{r.v.toFixed(1)}</span>
            </div>
            <Progress value={r.v} max={10} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Timeline({ status, pct }: { status: BountyStatus; pct: number }) {
  const steps: Array<{
    id: BountyStatus | "scoring";
    label: string;
    Icon: typeof Circle;
  }> = [
    { id: "draft", label: "Pool funding", Icon: Sparkles },
    { id: "open", label: "Submitted to subnet", Icon: Circle },
    { id: "matched", label: "Miner matched & executing", Icon: Cog },
    { id: "proving", label: "PoPW verification", Icon: Loader2 },
    { id: "settled", label: "Settled · payout released", Icon: CheckCircle2 },
  ];

  const order: Record<string, number> = {
    draft: 0,
    open: 1,
    matched: 2,
    proving: 3,
    settled: 4,
    failed: -1,
    cancelled: -1,
  };
  const currentIdx = order[status] ?? 0;
  const isFailed = status === "failed";

  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const reached = i <= currentIdx;
        const active = i === currentIdx;
        const Icon = isFailed && active ? ShieldAlert : s.Icon;
        return (
          <li key={s.id} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                isFailed && active
                  ? "border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--destructive)]"
                  : reached
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${active && (s.id === "matched" || s.id === "proving") ? "animate-spin" : ""}`}
              />
            </span>
            <div className="flex-1">
              <div
                className={`text-sm ${reached ? "" : "text-[var(--muted-foreground)]"}`}
              >
                {s.label}
                {active && s.id === "draft" ? (
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                    {Math.round(pct)}% funded
                  </span>
                ) : null}
              </div>
            </div>
            {active ? (
              <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
