import {
  CheckCircle2,
  Circle,
  Clock,
  Cog,
  Loader2,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { BountyStatus } from "@/lib/konnex/types";
import { cn } from "@/lib/utils";

interface Meta {
  label: string;
  variant: BadgeProps["variant"];
  Icon: typeof Circle;
  spin?: boolean;
}

const META: Record<BountyStatus, Meta> = {
  draft: { label: "Funding", variant: "outline", Icon: Sparkles },
  open: { label: "Open · awaiting bid", variant: "primary", Icon: Circle },
  matched: { label: "Matched · executing", variant: "accent", Icon: Cog, spin: true },
  proving: { label: "Proving · validating", variant: "warning", Icon: Loader2, spin: true },
  settled: { label: "Settled", variant: "primary", Icon: CheckCircle2 },
  failed: { label: "Failed · slashed", variant: "destructive", Icon: ShieldAlert },
  cancelled: { label: "Cancelled", variant: "outline", Icon: XCircle },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BountyStatus;
  className?: string;
}) {
  const m = META[status] ?? { label: status, variant: "outline" as const, Icon: Clock };
  const { Icon } = m;
  return (
    <Badge variant={m.variant} className={className}>
      <Icon className={cn("h-3 w-3", m.spin && "animate-spin")} />
      {m.label}
    </Badge>
  );
}
