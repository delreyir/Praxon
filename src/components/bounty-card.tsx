import Link from "next/link";
import { ArrowUpRight, Clock, Coins, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { SUBNETS } from "@/lib/konnex/subnets";
import type { Bounty } from "@/lib/konnex/types";
import { formatDeadline, formatTKNX, relativeTime } from "@/lib/utils";

export function BountyCard({ bounty }: { bounty: Bounty }) {
  const subnet = SUBNETS[bounty.subnet];
  const required = bounty.targetReward + bounty.stake;
  const pct = Math.min(100, (bounty.pooled / required) * 100);

  return (
    <Link
      href={`/bounties/${bounty.id}`}
      className="group block focus:outline-none"
    >
      <Card className="h-full transition-colors group-hover:border-[var(--primary)]/40 group-focus-visible:border-[var(--primary)]">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{subnet.emoji}</span>
              <Badge variant="outline" className="font-mono text-[10px]">
                {subnet.shortName}
              </Badge>
            </div>
            <StatusBadge status={bounty.status} />
          </div>
          <CardTitle className="mt-3 line-clamp-2 text-base">
            {bounty.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {bounty.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bounty.status === "draft" ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">
                  Pool funded
                </span>
                <span className="font-mono">
                  {formatTKNX(bounty.pooled)} / {formatTKNX(required)} testKNX
                </span>
              </div>
              <Progress value={bounty.pooled} max={required} />
            </div>
          ) : null}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Stat icon={<Coins className="h-3 w-3" />} label="Reward">
              {formatTKNX(bounty.targetReward)}
            </Stat>
            <Stat icon={<Users className="h-3 w-3" />} label="Sponsors">
              {bounty.contributorCount}
            </Stat>
            <Stat icon={<Clock className="h-3 w-3" />} label="Deadline">
              {formatDeadline(bounty.deadlineSeconds)}
            </Stat>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
            <span className="text-[var(--muted-foreground)]">
              {relativeTime(bounty.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1 text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
              View <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md bg-[var(--muted)]/50 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm">{children}</div>
    </div>
  );
}
