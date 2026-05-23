/**
 * Repository selector — picks Supabase if env is configured, otherwise mock.
 * Logs which backend is in use the first time it's called per process.
 */

import type { BountyRepository } from "./repository";
import { mockRepository } from "./mock-repository";
import { supabaseRepository } from "./supabase-repository";
import { isSupabaseConfigured } from "./supabase";

let cached: BountyRepository | undefined;
let logged = false;

export function getRepository(): BountyRepository {
  if (cached) return cached;
  const useSupabase = isSupabaseConfigured();
  cached = useSupabase ? supabaseRepository : mockRepository;
  if (!logged && typeof window === "undefined") {
    // eslint-disable-next-line no-console
    console.info(
      `[praxon:repository] using ${useSupabase ? "Supabase" : "in-memory mock"} backend`,
    );
    logged = true;
  }
  return cached;
}

export type { BountyRepository } from "./repository";
export type {
  CreateBountyInput,
  ListBountiesFilters,
  RecordContributionInput,
} from "./repository";
