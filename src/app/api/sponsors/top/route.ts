import { NextResponse, type NextRequest } from "next/server";
import { getRepository } from "@/lib/db";

export async function GET(req: NextRequest) {
  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Math.min(100, Math.max(1, Number(limitParam))) : 25;
  const repo = getRepository();
  const sponsors = await repo.topSponsors(limit);
  return NextResponse.json({ sponsors });
}
