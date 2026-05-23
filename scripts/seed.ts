/**
 * Seed Supabase with the same fixtures used by the in-memory mock.
 * Run with: npm run db:seed
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL from .env.local.
 * Idempotent: uses upsert by id, so safe to re-run.
 */

import { config as loadEnv } from "dotenv";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: path.resolve(process.cwd(), ".env.local") });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const sb = createClient(URL, SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  // Lazy import after env is loaded so the module-level fixtures resolve.
  const { MOCK_BOUNTIES, MOCK_CONTRIBUTIONS } = await import(
    "../src/lib/mock/bounties"
  );

  const bountyRows = MOCK_BOUNTIES.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    subnet: b.subnet,
    prompt: b.prompt,
    target_reward: b.targetReward,
    stake: b.stake,
    deadline_seconds: b.deadlineSeconds,
    pooled: 0, // will be derived by trigger as contributions are inserted
    contributor_count: 0,
    status: b.status,
    created_at: b.createdAt,
    created_by: b.createdBy,
    job_id: b.jobId ?? null,
    job_hash: b.jobHash ?? null,
    bundle_uri: b.bundleUri ?? null,
    score_safety: b.score?.safety ?? null,
    score_task_match: b.score?.taskMatch ?? null,
    score_efficiency: b.score?.efficiency ?? null,
    score_coherence: b.score?.coherence ?? null,
    score_overall: b.score?.overall ?? null,
  }));

  console.info(`Upserting ${bountyRows.length} bounties…`);
  const { error: bErr } = await sb.from("bounties").upsert(bountyRows, {
    onConflict: "id",
  });
  if (bErr) throw bErr;

  // Wipe + reinsert contributions so the trigger recomputes pooled/contrib_count cleanly.
  for (const bountyId of Object.keys(MOCK_CONTRIBUTIONS)) {
    const { error: dErr } = await sb
      .from("bounty_contributions")
      .delete()
      .eq("bounty_id", bountyId);
    if (dErr) throw dErr;

    const rows = MOCK_CONTRIBUTIONS[bountyId].map((c) => ({
      bounty_id: c.bountyId,
      contributor: c.contributor,
      amount: c.amount,
      tx_hash: c.txHash ?? null,
      at: c.at,
    }));
    if (rows.length) {
      const { error: cErr } = await sb
        .from("bounty_contributions")
        .insert(rows);
      if (cErr) throw cErr;
    }
    console.info(`  ${bountyId} → ${rows.length} contributions`);
  }

  // For settled / failed bounties without contribution fixtures, manually patch
  // pooled to equal targetReward+stake so the explorer math looks correct.
  for (const b of MOCK_BOUNTIES) {
    if (
      !MOCK_CONTRIBUTIONS[b.id] &&
      ["matched", "proving", "settled", "failed"].includes(b.status)
    ) {
      await sb
        .from("bounties")
        .update({
          pooled: b.targetReward + b.stake,
          contributor_count: b.contributorCount,
        })
        .eq("id", b.id);
    }
  }

  console.info("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
