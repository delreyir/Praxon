import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";

const ContributeSchema = z.object({
  contributor: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[A-HJ-NP-Za-km-z1-9]+$/, "must be SS58-style address"),
  amount: z.number().positive().max(1_000_000),
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/u, "must be 0x-prefixed hex")
    .optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = ContributeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const repo = getRepository();
  const bounty = await repo.getBounty(id);
  if (!bounty) {
    return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
  }
  if (bounty.status !== "draft") {
    return NextResponse.json(
      { error: `Bounty is ${bounty.status}; pool is closed.` },
      { status: 409 },
    );
  }
  const required = bounty.targetReward + bounty.stake;
  const remaining = required - bounty.pooled;
  if (parsed.data.amount > remaining + 1e-6) {
    return NextResponse.json(
      {
        error: `Amount exceeds remaining ${remaining} testKNX in this pool.`,
      },
      { status: 400 },
    );
  }
  const contribution = await repo.recordContribution({
    bountyId: id,
    ...parsed.data,
  });
  const updated = await repo.getBounty(id);
  return NextResponse.json(
    { contribution, bounty: updated },
    { status: 201 },
  );
}
