/**
 * Supabase-backed repository.
 * Reads via the public anon client; writes via the admin (service-role) client.
 */

import type {
  Bounty,
  BountyContribution,
  BountyStatus,
  SponsorReputation,
  ValidatorScore,
} from "@/lib/konnex/types";
import type { SubnetId } from "@/lib/konnex/subnets";
import { getSupabaseAdmin, getSupabasePublic } from "./supabase";
import type {
  BountyRepository,
  CreateBountyInput,
  ListBountiesFilters,
  RecordContributionInput,
} from "./repository";

interface BountyRow {
  id: string;
  title: string;
  description: string;
  subnet: SubnetId;
  prompt: string;
  target_reward: number | string;
  stake: number | string;
  deadline_seconds: number;
  pooled: number | string;
  contributor_count: number;
  status: BountyStatus;
  created_at: string;
  created_by: string;
  job_id: string | null;
  job_hash: string | null;
  bundle_uri: string | null;
  score_safety: number | string | null;
  score_task_match: number | string | null;
  score_efficiency: number | string | null;
  score_coherence: number | string | null;
  score_overall: number | string | null;
}

interface ContribRow {
  id: number;
  bounty_id: string;
  contributor: string;
  amount: number | string;
  tx_hash: string | null;
  at: string;
}

interface ReputationRow {
  address: string;
  total_sponsored: number | string;
  bounties_created: number;
  bounties_contributed: number;
  successful_settlements: number;
  failed_settlements: number;
  score: number | string;
}

const num = (v: number | string | null | undefined): number =>
  v == null ? 0 : typeof v === "number" ? v : Number(v);

function rowToBounty(r: BountyRow): Bounty {
  let score: ValidatorScore | undefined;
  if (r.score_overall != null) {
    score = {
      safety: num(r.score_safety),
      taskMatch: num(r.score_task_match),
      efficiency: num(r.score_efficiency),
      coherence: r.score_coherence != null ? num(r.score_coherence) : undefined,
      overall: num(r.score_overall),
    };
  }
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    subnet: r.subnet,
    prompt: r.prompt,
    targetReward: num(r.target_reward),
    stake: num(r.stake),
    deadlineSeconds: r.deadline_seconds,
    pooled: num(r.pooled),
    contributorCount: r.contributor_count,
    status: r.status,
    createdAt: r.created_at,
    createdBy: r.created_by,
    jobId: r.job_id ?? undefined,
    jobHash: r.job_hash ?? undefined,
    bundleUri: r.bundle_uri ?? undefined,
    score,
  };
}

function rowToContribution(r: ContribRow): BountyContribution {
  return {
    bountyId: r.bounty_id,
    contributor: r.contributor,
    amount: num(r.amount),
    txHash: r.tx_hash ?? undefined,
    at: r.at,
  };
}

export const supabaseRepository: BountyRepository = {
  async listBounties(filters: ListBountiesFilters = {}) {
    const sb = getSupabasePublic();
    if (!sb) throw new Error("Supabase not configured");

    let q = sb
      .from("bounties")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.subnet) q = q.eq("subnet", filters.subnet);
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.q && filters.q.trim()) {
      const term = filters.q.trim().replace(/[,()]/g, " ");
      q = q.or(
        `title.ilike.%${term}%,prompt.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }
    q = q.range(
      filters.offset ?? 0,
      (filters.offset ?? 0) + (filters.limit ?? 50) - 1,
    );

    const { data, error } = await q;
    if (error) throw error;
    return (data as BountyRow[]).map(rowToBounty);
  },

  async getBounty(id: string) {
    const sb = getSupabasePublic();
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("bounties")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToBounty(data as BountyRow) : null;
  },

  async getContributions(bountyId: string) {
    const sb = getSupabasePublic();
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("bounty_contributions")
      .select("*")
      .eq("bounty_id", bountyId)
      .order("at", { ascending: false });
    if (error) throw error;
    return (data as ContribRow[]).map(rowToContribution);
  },

  async createBounty(input: CreateBountyInput) {
    const sb = getSupabaseAdmin();
    if (!sb) throw new Error("Supabase admin client not configured");
    const { data, error } = await sb
      .from("bounties")
      .insert({
        id: input.id,
        title: input.title,
        description: input.description,
        subnet: input.subnet,
        prompt: input.prompt,
        target_reward: input.targetReward,
        stake: input.stake,
        deadline_seconds: input.deadlineSeconds,
        created_by: input.createdBy,
        status: "draft",
      })
      .select("*")
      .single();
    if (error) throw error;
    return rowToBounty(data as BountyRow);
  },

  async recordContribution(input: RecordContributionInput) {
    const sb = getSupabaseAdmin();
    if (!sb) throw new Error("Supabase admin client not configured");
    const { data, error } = await sb
      .from("bounty_contributions")
      .insert({
        bounty_id: input.bountyId,
        contributor: input.contributor,
        amount: input.amount,
        tx_hash: input.txHash ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;

    // Trigger updates pooled/contributor_count automatically.
    // We additionally flip status -> "open" if fully funded.
    const bounty = await this.getBounty(input.bountyId);
    if (bounty && bounty.status === "draft") {
      const required = bounty.targetReward + bounty.stake;
      if (bounty.pooled >= required) {
        await sb
          .from("bounties")
          .update({ status: "open" })
          .eq("id", input.bountyId);
      }
    }

    return rowToContribution(data as ContribRow);
  },

  async topSponsors(limit = 25): Promise<SponsorReputation[]> {
    const sb = getSupabasePublic();
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("sponsor_reputation")
      .select("*")
      .order("score", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as ReputationRow[]).map((r) => {
      const score = num(r.score);
      return {
        address: r.address,
        totalSponsored: num(r.total_sponsored),
        bountiesCreated: r.bounties_created,
        bountiesContributed: r.bounties_contributed,
        successfulSettlements: r.successful_settlements,
        failedSettlements: r.failed_settlements,
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
  },
};
