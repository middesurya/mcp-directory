import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServerCard } from "@/components/server-card";
import {
  getCategoryBySlug,
  getServersByCategory,
  getAllCategories,
} from "@/lib/queries";
import { getIcon } from "@/lib/icons";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} MCP Servers`,
    description: `Browse ${category.name} MCP servers. ${category.description}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const servers = getServersByCategory(slug);
  const Icon = getIcon(category.icon);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/servers" className="hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
          All Servers
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="mt-0.5 text-muted-foreground">{category.description}</p>
        </div>
      </div>

      {/* Results */}
      <p className="mb-4 text-sm text-muted-foreground">
        {servers.length} {servers.length === 1 ? "server" : "servers"} in this category
      </p>

      {servers.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-12 text-center">
          <p className="text-lg font-medium">No servers in this category yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to add one!
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Submit a Server
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}
