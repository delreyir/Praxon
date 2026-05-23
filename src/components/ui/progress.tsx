import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[var(--primary)] transition-all duration-500",
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
