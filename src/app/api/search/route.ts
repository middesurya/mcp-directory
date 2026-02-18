import { NextRequest, NextResponse } from "next/server";
import { searchServers } from "@/data/servers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = searchServers(query, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search servers" },
      { status: 500 }
    );
  }
}
