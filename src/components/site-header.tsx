import Link from "next/link";
import { Activity } from "lucide-react";
import { WalletConnectButton } from "./wallet-connect-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/30">
            <Activity className="h-4 w-4 text-[var(--primary)]" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Praxon
          </span>
          <span className="ml-1 hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium uppercase text-[var(--muted-foreground)] sm:inline">
            on Konnex · testnet
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/bounties"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            Bounties
          </Link>
          <Link
            href="/leaderboard"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            Leaderboard
          </Link>
          <Link
            href="/how-it-works"
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            How it works
          </Link>
        </nav>
        <WalletConnectButton />
      </div>
    </header>
  );
}
