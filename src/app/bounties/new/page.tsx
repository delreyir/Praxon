import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NewBountyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <Link
        href="/bounties"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to bounties
      </Link>
      <Badge variant="outline" className="mb-3">
        <Hammer className="h-3 w-3" /> Coming next
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Create a bounty
      </h1>
      <p className="mt-3 text-[var(--muted-foreground)]">
        The create-bounty flow lets you pick a subnet, write the prompt, set
        reward, sponsor stake, and deadline, then preview and submit. The
        submission opens a community pool and posts to{" "}
        <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
          POST /api/v1/tasks
        </code>{" "}
        once fully funded.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          This step is the next milestone — wired right after Supabase is set
          up.
        </p>
        <Button asChild className="mt-4">
          <Link href="/bounties">Browse open bounties instead</Link>
        </Button>
      </div>
    </div>
  );
}
