import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";
import { SUBNETS, type SubnetId } from "@/lib/konnex/subnets";

const SUBNET_IDS = Object.keys(SUBNETS) as SubnetId[];

const ListQuerySchema = z.object({
  subnet: z.enum(SUBNET_IDS as [SubnetId, ...SubnetId[]]).optional(),
  status: z
    .enum([
      "draft",
      "open",
      "matched",
      "proving",
      "settled",
      "failed",
      "cancelled",
    ])
    .optional(),
  q: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const repo = getRepository();
  const bounties = await repo.listBounties(parsed.data);
  return NextResponse.json({ bounties });
}

const CreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).default(""),
  subnet: z.enum(SUBNET_IDS as [SubnetId, ...SubnetId[]]),
  prompt: z.string().min(3).max(1000),
  targetReward: z.number().positive().max(1_000_000),
  stake: z.number().min(0).max(1_000_000),
  deadlineSeconds: z.number().int().min(10).max(86_400),
  createdBy: z
    .string()
    .min(8)
    .max(64)
    .regex(/^[A-HJ-NP-Za-km-z1-9]+$/, "must be SS58-style address"),
});

function ulid(): string {
  // Time-ordered ID, no extra deps. Not crypto-grade but fine for a record key.
  const t = Date.now().toString(36).toUpperCase().padStart(10, "0");
  const r = Array.from({ length: 16 })
    .map(() => "0123456789ABCDEFGHJKMNPQRSTVWXYZ"[Math.floor(Math.random() * 32)])
    .join("");
  return `bnty_${t}${r}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const repo = getRepository();
  const created = await repo.createBounty({
    id: ulid(),
    ...parsed.data,
  });
  return NextResponse.json({ bounty: created }, { status: 201 });
}
