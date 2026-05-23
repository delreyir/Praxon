import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Cpu,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUBNET_LIST } from "@/lib/konnex/subnets";
import { KONNEX_CONFIG } from "@/lib/konnex/config";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/40 to-[var(--background)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
          <Badge variant="primary" className="mb-6">
            <Sparkles className="h-3 w-3" />
            Built on Konnex Testnet · PoPW-verified
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Sponsor real{" "}
            <span className="text-gradient">physical work</span> on the
            decentralized network for autonomous systems.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
            Pool testKNX with other sponsors to fund real tasks across Konnex
            subnets — drone navigation, roboarm VLA, SLAM 3D mapping. Miners
            execute, validators score, Proof-of-Physical-Work certifies
            settlement onchain.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/bounties">
                Browse bounties <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/bounties/new">Create a bounty</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a
                href={KONNEX_CONFIG.network.faucet}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get testKNX <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Live stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-8 md:grid-cols-4">
            <Stat label="Live subnets" value={String(SUBNET_LIST.length)} />
            <Stat label="Network" value="Substrate L1" />
            <Stat label="Settlement" value="PoPW · onchain" />
            <Stat label="Status" value="Testnet" highlight />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mb-12 max-w-2xl">
          <Badge variant="outline" className="mb-3">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            From sponsor pool to onchain Proof-of-Physical-Work
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)]">
            Every step maps to a primitive in the{" "}
            <a
              href="https://docs.konnex.world/understand-konnex/protocol-architecture"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-4 hover:text-[var(--foreground)]"
            >
              Konnex protocol
            </a>
            : <code className="font-mono text-xs">TaskRegistry</code>,{" "}
            <code className="font-mono text-xs">BondMatrix</code>,{" "}
            <code className="font-mono text-xs">PayoutRouter</code>.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StepCard
            n={1}
            icon={<Users className="h-5 w-5" />}
            title="Pool testKNX"
            text="Sponsors contribute to a bounty pool until the target reward and stake are met. Each contribution is transparent and onchain-traceable."
          />
          <StepCard
            n={2}
            icon={<Cpu className="h-5 w-5" />}
            title="Submit task"
            text="When the pool is full we submit the task to the chosen subnet via the Konnex API: subnet, prompt, rewardStable, stakeStable, deadline."
          />
          <StepCard
            n={3}
            icon={<Zap className="h-5 w-5" />}
            title="Miners bid & execute"
            text="Subnet miners pick up the JobID, bid with ETA and collateral, then execute under subnet rules. Sensor evidence is captured live."
          />
          <StepCard
            n={4}
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Validators score"
            text="Independent validators verify the PoPW bundle: deterministic replay, evidence completeness, scoring on safety, task match, efficiency."
          />
          <StepCard
            n={5}
            icon={<Coins className="h-5 w-5" />}
            title="Atomic settlement"
            text="If the bundle clears, PayoutRouter releases the reward to the executor in the same block. If it fails, slashes apply per the contract."
          />
          <StepCard
            n={6}
            icon={<Trophy className="h-5 w-5" />}
            title="Reputation lasts"
            text="Sponsors earn soulbound reputation NFTs based on success-weighted activity. Bronze → Silver → Gold → Diamond as your track record grows."
          />
        </div>
      </section>

      {/* Subnets */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)]/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-3">
                Workload classes
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Three live subnets ready for sponsorship
              </h2>
              <p className="mt-4 text-[var(--muted-foreground)]">
                Each subnet encodes a real commercial workload class with its
                own input schema and scoring function.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a
                href="https://docs.konnex.world/subnets-workload-classes/subnets"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subnet docs <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {SUBNET_LIST.map((s) => (
              <Card key={s.id} className="group relative overflow-hidden">
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{ background: s.accent }}
                  aria-hidden
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{s.emoji}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {s.id}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{s.name}</CardTitle>
                  <CardDescription>{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      Scoring KPIs
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.kpis.map((k) => (
                        <Badge key={k} variant="default">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border)] pt-3 text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Reward
                    </span>
                    <span className="font-mono">
                      {s.suggestedReward.min}–{s.suggestedReward.max} testKNX
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">
                      Deadline
                    </span>
                    <span className="font-mono">
                      {s.suggestedDeadline.min}–{s.suggestedDeadline.max}s
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="primary" className="mb-3">
              Why Praxon
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              The protocol was built for third-party sponsorship.
              <br />
              <span className="text-[var(--muted-foreground)]">
                The interface wasn&apos;t — until now.
              </span>
            </h2>
            <p className="mt-6 text-[var(--muted-foreground)]">
              Konnex&apos;s own architecture documents{" "}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
                BondMatrix
              </code>{" "}
              — &quot;stablecoin bonds from third-party stakers&quot; — alongside{" "}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
                TaskRegistry
              </code>
              ,{" "}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
                StakeVault
              </code>
              , and{" "}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
                PayoutRouter
              </code>
              . Praxon surfaces these primitives so anyone — not just
              enterprise counterparties — can fund and settle real subnet work.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Pool model resists single-wallet sybils — contributions weighted by capital, not address count.",
                "Tasks submitted via the documented POST /api/v1/tasks API — same JobID, same PoPW pipeline.",
                "Soulbound reputation grows only on successful settlements — no wash farming.",
                "Every contribution and settlement is publicly auditable on the testnet explorer.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--primary)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-[var(--muted)]/40">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-[var(--muted-foreground)]">
                POST /api/v1/tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs leading-relaxed">
                {`{
  "subnet":       "sn.roboarm.sim",
  "prompt":       "dice tomatoes and place into pan",
  "rewardStable": 12.5,
  "stakeStable":  5,
  "deadline":     120
}`}
              </pre>
              <p className="mt-4 text-xs text-[var(--muted-foreground)]">
                Source:{" "}
                <a
                  href="https://docs.konnex.world/sdk/http"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-4"
                >
                  docs.konnex.world/sdk/http
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to fund your first task?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
            Connect SubWallet, claim testKNX from the faucet, and contribute to
            an open bounty in under three minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/bounties">
                Open bounties <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://docs.konnex.world/participate/wallet"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet setup guide
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2 text-xl font-semibold">
        {highlight ? (
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
        ) : null}
        {value}
      </div>
    </div>
  );
}

function StepCard({
  n,
  icon,
  title,
  text,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
            {icon}
          </span>
          <span className="font-mono text-xs text-[var(--muted-foreground)]">
            0{n}
          </span>
        </div>
        <CardTitle className="mt-3 text-base">{title}</CardTitle>
        <CardDescription className="text-sm">{text}</CardDescription>
      </CardHeader>
    </Card>
  );
}
