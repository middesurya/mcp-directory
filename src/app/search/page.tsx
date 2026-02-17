import { Suspense } from "react";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { or, sql } from "drizzle-orm";
import { ServerCard } from "@/components/server-card";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Enter a search term</h2>
        <p className="mt-2 text-muted-foreground">
          Search for MCP servers by name, description, author, or features.
        </p>
      </div>
    );
  }

  const searchTerm = `%${query.toLowerCase()}%`;

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
    );

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">No results found</h2>
        <p className="mt-2 text-muted-foreground">
          No servers match &ldquo;{query}&rdquo;. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Found {results.length} {results.length === 1 ? "server" : "servers"} matching &ldquo;{query}&rdquo;
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Search Results
        </h1>
        {query && (
          <p className="mt-2 text-lg text-muted-foreground">
            Showing results for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  return {
    title: query ? `Search: ${query} | MCP Directory` : "Search | MCP Directory",
    description: query
      ? `Search results for "${query}" in MCP Directory`
      : "Search for MCP servers",
  };
}
