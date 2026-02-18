import type { Metadata } from "next";
import { ServerCard } from "@/components/server-card";
import { Badge } from "@/components/ui/badge";
import { getAllServers, getAllCategories } from "@/lib/queries";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

// Force static generation - no runtime DB access
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Browse All MCP Servers",
  description:
    "Browse and search all MCP (Model Context Protocol) servers. Filter by category, official status, and more.",
};

export default async function ServersPage() {
  const categories = getAllCategories();
  const allServers = getAllServers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All MCP Servers</h1>
        <p className="mt-1 text-muted-foreground">
          {`Browse all ${allServers.length} MCP servers`}
        </p>
      </div>

      {/* Category Pills */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Link href="/servers">
            <Badge variant="default" className="cursor-pointer">
              All
            </Badge>
          </Link>
          {categories
            .filter((c) => (c.serverCount ?? 0) > 0)
            .map((cat) => (
              <Link key={cat.id} href={`/category/${cat.id}`}>
                <Badge variant="secondary" className="cursor-pointer">
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
