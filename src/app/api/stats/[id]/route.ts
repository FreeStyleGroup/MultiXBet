import { NextResponse } from "next/server";
import {
  getGlickoPrediction,
  getLastGamesStats,
  getTextSummary,
  getMatchInjuries,
} from "@/lib/sstats-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [glicko, stats, summary, injuries] = await Promise.allSettled([
      getGlickoPrediction(id),
      getLastGamesStats(id),
      getTextSummary(id),
      getMatchInjuries(id),
    ]);

    return NextResponse.json({
      data: {
        glicko: glicko.status === "fulfilled" ? glicko.value : null,
        stats: stats.status === "fulfilled" ? stats.value : null,
        summary: summary.status === "fulfilled" ? summary.value : null,
        injuries: injuries.status === "fulfilled" ? injuries.value : null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
