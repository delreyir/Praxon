import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]",
        primary:
          "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]",
        accent:
          "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]",
        warning:
          "border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]",
        destructive:
          "border-[var(--destructive)]/30 bg-[var(--destructive)]/10 text-[var(--destructive)]",
        outline: "border-[var(--border)] text-[var(--muted-foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
