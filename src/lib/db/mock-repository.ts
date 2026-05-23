/**
 * In-memory repository — wraps the mock fixtures and supports mutations
 * during the dev session (lost on server restart).
 */

import type {
  Bounty,
  BountyContribution,
  SponsorReputation,
} from "@/lib/konnex/types";
import {
  MOCK_BOUNTIES,
  MOCK_CONTRIBUTIONS,
} from "@/lib/mock/bounties";
import type {
  BountyRepository,
  CreateBountyInput,
  ListBountiesFilters,
  RecordContributionInput,
} from "./repository";

// Singleton stores so HMR doesn't reset on every reload during dev.
const globalStore = globalThis as unknown as {
  __praxon_bounties?: Bounty[];
  __praxon_contributions?: Record<string, BountyContribution[]>;
};

if (!globalStore.__praxon_bounties) {
  globalStore.__praxon_bounties = [...MOCK_BOUNTIES];
}
if (!globalStore.__praxon_contributions) {
  globalStore.__praxon_contributions = JSON.parse(
    JSON.stringify(MOCK_CONTRIBUTIONS),
  );
}

const bounties = () => globalStore.__praxon_bounties!;
const contributions = () => globalStore.__praxon_contributions!;

export const mockRepository: BountyRepository = {
  async listBounties(filters: ListBountiesFilters = {}): Promise<Bounty[]> {
    const q = filters.q?.trim().toLowerCase();
    let rows = bounties().filter((b) => {
      if (filters.subnet && b.subnet !== filters.subnet) return false;
      if (filters.status && b.status !== filters.status) return false;
      if (q) {
        const hay = `${b.title} ${b.prompt} ${b.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    rows = rows.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? 50;
    return rows.slice(offset, offset + limit);
  },

  async getBounty(id: string): Promise<Bounty | null> {
    return bounties().find((b) => b.id === id) ?? null;
  },

  async getContributions(bountyId: string): Promise<BountyContribution[]> {
    return [...(contributions()[bountyId] ?? [])].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );
  },

  async createBounty(input: CreateBountyInput): Promise<Bounty> {
    const next: Bounty = {
      id: input.id,
      title: input.title,
      description: input.description,
      subnet: input.subnet,
      prompt: input.prompt,
      targetReward: input.targetReward,
      stake: input.stake,
      deadlineSeconds: input.deadlineSeconds,
      pooled: 0,
      contributorCount: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy,
    };
    bounties().unshift(next);
    contributions()[next.id] = [];
    return next;
  },

  async recordContribution(
    input: RecordContributionInput,
  ): Promise<BountyContribution> {
    const list = contributions()[input.bountyId] ?? (contributions()[input.bountyId] = []);
    const c: BountyContribution = {
      bountyId: input.bountyId,
      contributor: input.contributor,
      amount: input.amount,
      txHash: input.txHash,
      at: new Date().toISOString(),
    };
    list.push(c);

    const b = bounties().find((x) => x.id === input.bountyId);
    if (b) {
      b.pooled += input.amount;
      b.contributorCount = new Set(list.map((x) => x.contributor)).size;
      // Auto-flip to "open" once fully funded (pool covers reward + stake).
      const required = b.targetReward + b.stake;
      if (b.status === "draft" && b.pooled >= required) {
        b.status = "open";
      }
    }
    return c;
  },

  async topSponsors(limit = 25): Promise<SponsorReputation[]> {
    const map = new Map<
      string,
      {
        address: string;
        totalSponsored: number;
        bountiesContributed: Set<string>;
        success: number;
        fail: number;
      }
    >();

    for (const [bId, list] of Object.entries(contributions())) {
      const b = bounties().find((x) => x.id === bId);
      for (const c of list) {
        const e = map.get(c.contributor) ?? {
          address: c.contributor,
          totalSponsored: 0,
          bountiesContributed: new Set<string>(),
          success: 0,
          fail: 0,
        };
        e.totalSponsored += c.amount;
        e.bountiesContributed.add(c.bountyId);
        if (b?.status === "settled") e.success += 1;
        if (b?.status === "failed") e.fail += 1;
        map.set(c.contributor, e);
      }
    }

    const created = new Map<string, number>();
    for (const b of bounties()) {
      created.set(b.createdBy, (created.get(b.createdBy) ?? 0) + 1);
    }

    const rows: SponsorReputation[] = Array.from(map.values()).map((e) => {
      const score = Math.min(
        100,
        Math.round(
          (e.success * 10 + e.totalSponsored * 0.5 - e.fail * 5) * 100,
        ) / 100,
      );
      return {
        address: e.address,
        totalSponsored: e.totalSponsored,
        bountiesCreated: created.get(e.address) ?? 0,
        bountiesContributed: e.bountiesContributed.size,
        successfulSettlements: e.success,
        failedSettlements: e.fail,
        score,
        tier:
          score >= 75
            ? "diamond"
            : score >= 50
              ? "gold"
              : score >= 25
                ? "silver"
                : "bronze",
      };
    });

    return rows.sort((a, b) => b.score - a.score).slice(0, limit);
  },
};
