import { ExternalLink } from "lucide-react";
import { KONNEX_CONFIG } from "@/lib/konnex/config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold">Praxon</div>
          <p className="mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            The work layer for autonomous systems. Praxon pools community
            sponsors to fund real subnet tasks on Konnex — miners execute,
            validators score, PoPW certifies.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <FooterCol title="Konnex">
            <FooterLink href="https://docs.konnex.world/">Docs</FooterLink>
            <FooterLink href={KONNEX_CONFIG.network.explorer}>Explorer</FooterLink>
            <FooterLink href={KONNEX_CONFIG.network.faucet}>Faucet</FooterLink>
            <FooterLink href={KONNEX_CONFIG.network.quest}>Quest</FooterLink>
          </FooterCol>
          <FooterCol title="App">
            <FooterLink href="/bounties">Bounties</FooterLink>
            <FooterLink href="/leaderboard">Leaderboard</FooterLink>
            <FooterLink href="/how-it-works">How it works</FooterLink>
          </FooterCol>
          <FooterCol title="Build">
            <FooterLink href="https://github.com/konnex-network">GitHub</FooterLink>
            <FooterLink href="https://docs.konnex.world/sdk/sdk">SDK</FooterLink>
            <FooterLink href="https://www.subwallet.app/">SubWallet</FooterLink>
          </FooterCol>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 text-xs text-[var(--muted-foreground)]">
          <span>Unofficial — not affiliated with Konnex Foundation.</span>
          <span className="font-mono">testnet · v0.1</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        {title}
      </div>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-1 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        {children}
        {external ? <ExternalLink className="h-3 w-3" /> : null}
      </a>
    </li>
  );
}
