import type { Metadata } from "next";
import { ServerCard } from "@/components/server-card";
import { Badge } from "@/components/ui/badge";
import { getAllServers, getAllCategories, searchServers, getServersByCategory } from "@/lib/queries";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Browse All MCP Servers",
  description:
    "Browse and search all MCP (Model Context Protocol) servers. Filter by category, official status, and more.",
};

interface ServersPageProps {
  searchParams: Promise<{ q?: string; category?: string; filter?: string; sort?: string }>;
}

export default async function ServersPage({ searchParams }: ServersPageProps) {
  const params = await searchParams;
  const categories = getAllCategories();

  let allServers = params.q
    ? searchServers(params.q)
    : params.category
    ? getServersByCategory(params.category)
    : getAllServers();

  // Filter by official/community
  if (params.filter === "official") {
    allServers = allServers.filter((s) => s.official);
  } else if (params.filter === "community") {
    allServers = allServers.filter((s) => !s.official);
  }

  // Sort
  if (params.sort === "name-desc") {
    allServers.sort((a, b) => b.name.localeCompare(a.name));
  } else if (params.sort === "newest") {
    allServers.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }

  const activeCategory = params.category
    ? categories.find((c) => c.id === params.category)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {activeCategory ? activeCategory.name : "All MCP Servers"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {params.q
            ? `Search results for "${params.q}"`
            : activeCategory
            ? activeCategory.description
            : `Browse all ${allServers.length} MCP servers`}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <form action="/servers" method="GET" className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={params.q || ""}
              placeholder="Search servers..."
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Link href="/servers">
            <Badge
              variant={!params.filter && !params.category ? "default" : "secondary"}
              className="cursor-pointer"
            >
              All
            </Badge>
          </Link>
          <Link href="/servers?filter=official">
            <Badge
              variant={params.filter === "official" ? "default" : "secondary"}
              className="cursor-pointer"
            >
              Official
            </Badge>
          </Link>
          <Link href="/servers?filter=community">
            <Badge
              variant={params.filter === "community" ? "default" : "secondary"}
              className="cursor-pointer"
            >
              Community
            </Badge>
          </Link>
          <span className="mx-1 h-4 w-px bg-border" />
          {categories
            .filter((c) => (c.serverCount ?? 0) > 0)
            .map((cat) => (
              <Link key={cat.id} href={`/servers?category=${cat.id}`}>
                <Badge
                  variant={params.category === cat.id ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  {cat.name}
                </Badge>
              </Link>
            ))}
        </div>
      </div>

      {/* Results */}
      {allServers.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
          <p className="text-lg font-medium">No servers found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Link
            href="/servers"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {allServers.length} {allServers.length === 1 ? "server" : "servers"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
