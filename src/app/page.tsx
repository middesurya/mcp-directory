import Link from "next/link";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { ServerCard } from "@/components/server-card";
import { CategoryCard } from "@/components/category-card";
import { ClientCard } from "@/components/client-card";
import { StatsBar } from "@/components/stats-bar";
import {
  getAllCategories,
  getFeaturedServers,
  getLatestServers,
  getStats,
} from "@/lib/queries";
import { getAllClients } from "@/data/clients";

export default function HomePage() {
  const categories = getAllCategories();
  const clients = getAllClients();
  const featured = getFeaturedServers(6);
  const latest = getLatestServers(6);
  const stats = getStats();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{stats.servers} servers and counting</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                MCP Servers
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground sm:text-xl leading-relaxed">
              The definitive directory for Model Context Protocol servers.
              Find the perfect tools to supercharge your AI workflows.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/servers"
                className="group flex w-full max-w-lg items-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5 text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <Search className="h-5 w-5 shrink-0" />
                <span className="text-sm">Search servers by name, category, or feature...</span>
                <kbd className="ml-auto hidden shrink-0 rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                  /
                </kbd>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14">
            <StatsBar
              servers={stats.servers}
              categories={stats.categories}
              official={stats.official}
            />
          </div>
        </div>
      </section>

      {/* Featured Servers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Servers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official and popular MCP servers
            </p>
          </div>
          <Link
            href="/servers"
            className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* Browse by Client */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Browse by Client</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find servers for your AI assistant
              </p>
            </div>
            <Link
              href="/clients"
              className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} serverCount={stats.servers} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore servers organized by what they do
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories
            .filter((c) => (c.serverCount ?? 0) > 0)
            .map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
        </div>
      </section>

      {/* Latest Additions */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Latest Additions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recently added MCP servers
              </p>
            </div>
            <Link
              href="/servers"
              className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Built an MCP Server?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Share it with the community and help others discover it.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit Your Server
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
