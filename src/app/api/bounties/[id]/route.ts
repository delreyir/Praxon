import { NextResponse, type NextRequest } from "next/server";
import { getRepository } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const repo = getRepository();
  const [bounty, contributions] = await Promise.all([
    repo.getBounty(id),
    repo.getContributions(id),
  ]);
  if (!bounty) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ bounty, contributions });
}
