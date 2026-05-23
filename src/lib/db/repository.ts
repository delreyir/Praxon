/**
 * Repository interface — abstracts data access for bounties.
 * Two implementations: mock (in-memory) and supabase (production).
 */

import type {
  Bounty,
  BountyContribution,
  BountyStatus,
  SponsorReputation,
} from "@/lib/konnex/types";
import type { SubnetId } from "@/lib/konnex/subnets";

export interface ListBountiesFilters {
  subnet?: SubnetId;
  status?: BountyStatus;
  /** Free-text search across title / prompt / description. */
  q?: string;
  limit?: number;
  offset?: number;
}

export interface CreateBountyInput {
  id: string;
  title: string;
  description: string;
  subnet: SubnetId;
  prompt: string;
  targetReward: number;
  stake: number;
  deadlineSeconds: number;
  createdBy: string;
}

export interface RecordContributionInput {
  bountyId: string;
  contributor: string;
  amount: number;
  txHash?: string;
}

export interface BountyRepository {
  listBounties(filters?: ListBountiesFilters): Promise<Bounty[]>;
  getBounty(id: string): Promise<Bounty | null>;
  getContributions(bountyId: string): Promise<BountyContribution[]>;
  createBounty(input: CreateBountyInput): Promise<Bounty>;
  recordContribution(input: RecordContributionInput): Promise<BountyContribution>;
  topSponsors(limit?: number): Promise<SponsorReputation[]>;
}
