import { NextResponse } from "next/server";
import { getMatchDetail } from "@/lib/sstats-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getMatchDetail(id);
    return NextResponse.json({ data: match });
  } catch (error) {
    console.error("Failed to fetch match detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch match detail" },
      { status: 500 }
    );
  }
}
