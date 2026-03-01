import { NextResponse } from "next/server";
import { getTodayMatches } from "@/lib/sstats-api";
import { buildExpress } from "@/lib/express-builder";

export async function GET() {
  try {
    const matches = await getTodayMatches();
    const express = await buildExpress(matches);
    return NextResponse.json({ data: express });
  } catch (error) {
    console.error("Failed to build predictions:", error);
    return NextResponse.json(
      { error: "Failed to build predictions" },
      { status: 500 }
    );
  }
}
