import { NextResponse } from "next/server";
import { getTodayMatches } from "@/lib/sstats-api";

export async function GET() {
  try {
    const matches = await getTodayMatches();
    return NextResponse.json({ data: matches });
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
