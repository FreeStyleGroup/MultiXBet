import { NextResponse } from "next/server";
import { getMatchOdds } from "@/lib/sstats-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const odds = await getMatchOdds(id);
    return NextResponse.json({ data: odds });
  } catch (error) {
    console.error("Failed to fetch odds:", error);
    return NextResponse.json(
      { error: "Failed to fetch odds" },
      { status: 500 }
    );
  }
}
