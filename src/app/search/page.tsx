import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";

// Force static generation
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Search MCP Servers",
  description: "Search for MCP servers by name, description, or features.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search MCP Servers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find the perfect MCP server for your needs
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Browse All Servers</h2>
        <p className="mt-2 text-muted-foreground">
          Use the category filters to find servers, or browse the full directory.
        </p>
        <Link
          href="/servers"
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          View All Servers
        </Link>
      </div>
    </main>
  );
}
