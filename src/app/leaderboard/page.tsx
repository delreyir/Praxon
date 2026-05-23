import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
      <Badge variant="outline" className="mb-3">
        <Trophy className="h-3 w-3" /> Coming soon
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Sponsor leaderboard
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
        Top sponsors ranked by success-weighted reputation: bronze, silver,
        gold, diamond tiers. Soulbound NFTs minted at each tier upgrade.
      </p>
    </div>
  );
}
