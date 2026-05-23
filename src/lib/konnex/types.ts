import type { SubnetId } from "./subnets";

/**
 * Wire format expected by Konnex `POST /api/v1/tasks`.
 * Source: https://docs.konnex.world/sdk/http
 */
export interface TaskSubmitPayload {
  subnet: SubnetId;
  prompt: string;
  /** Reward in stablecoin units (testKNX on testnet). */
  rewardStable: number;
  /** Sponsor stake (slashable on misbehavior / cancellation). */
  stakeStable: number;
  /** Deadline in seconds from acceptance. */
  deadline: number;
}

export interface TaskSubmitResponse {
  jobId: string;
  /** Sometimes returned for inspection. */
  bundleUri?: string;
}

/**
 * Validator score envelope (shape inferred from PoPW design docs).
 * Per https://docs.konnex.world/understand-konnex/contracts-and-popw,
 * validators score: safety, task match, efficiency, coherence.
 */
export interface ValidatorScore {
  safety: number;
  taskMatch: number;
  efficiency: number;
  coherence?: number;
  overall: number;
}

export type BountyStatus =
  | "draft"        // not yet submitted onchain (pool funding open)
  | "open"         // submitted to Konnex, awaiting bid/match
  | "matched"      // miner matched, executing
  | "proving"      // PoPW bundle being verified
  | "settled"      // validators released payment
  | "failed"       // deadline missed / slashed
  | "cancelled";

/**
 * Off-chain bounty record — what our app stores per campaign.
 * Distinct from the underlying Konnex Job: a Bounty is a community-funded
 * pool that, once funded, becomes a single Konnex Task.
 */
export interface Bounty {
  id: string;                     // local UUID
  title: string;
  description: string;
  subnet: SubnetId;
  prompt: string;
  /** Target reward (testKNX) we will submit to Konnex. */
  targetReward: number;
  /** Required sponsor stake (set per-bounty by creator). */
  stake: number;
  deadlineSeconds: number;
  /** Pool: sum of contributions so far. */
  pooled: number;
  /** Number of unique sponsors. */
  contributorCount: number;
  status: BountyStatus;
  createdAt: string;       // ISO
  createdBy: string;       // SS58 address
  /** Set after submission to Konnex. */
  jobId?: string;
  /** Onchain anchor of the task instruction (sha-3 hash per protocol arch). */
  jobHash?: string;
  /** PoPW evidence bundle URL once miner proves work. */
  bundleUri?: string;
  /** Final validator score, once settled. */
  score?: ValidatorScore;
}

export interface BountyContribution {
  bountyId: string;
  contributor: string;     // SS58 address
  amount: number;          // testKNX
  txHash?: string;         // onchain tx hash for the transfer
  at: string;              // ISO
}

export interface SponsorReputation {
  address: string;
  totalSponsored: number;
  bountiesCreated: number;
  bountiesContributed: number;
  successfulSettlements: number;
  failedSettlements: number;
  /** 0..100, success-weighted score we compute. */
  score: number;
  tier: "bronze" | "silver" | "gold" | "diamond";
}
