import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { like, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = `%${query.toLowerCase()}%`;

  try {
    const results = await db
      .select()
      .from(servers)
      .where(
        or(
          sql`lower(${servers.name}) LIKE ${searchTerm}`,
          sql`lower(${servers.description}) LIKE ${searchTerm}`,
          sql`lower(${servers.category}) LIKE ${searchTerm}`,
          sql`lower(${servers.author}) LIKE ${searchTerm}`,
          sql`lower(${servers.features}) LIKE ${searchTerm}`
        )
      )
      .limit(limit);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search servers" },
      { status: 500 }
    );
  }
}
