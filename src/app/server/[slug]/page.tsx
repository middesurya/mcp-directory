import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ServerCard } from "@/components/server-card";
import {
  getServerBySlug,
  getCategoryBySlug,
  getRelatedServers,
  getAllServers,
} from "@/lib/queries";
import { getIcon } from "@/lib/icons";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Package,
  User,
  ShieldCheck,
} from "lucide-react";

interface ServerDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const servers = getAllServers();
  return servers.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: ServerDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const server = getServerBySlug(slug);
  if (!server) return { title: "Server Not Found" };

  return {
    title: server.name,
    description: server.description,
    openGraph: {
      title: `${server.name} - MCP Server`,
      description: server.description,
    },
  };
}

function SchemaOrg({ server }: { server: { name: string; description: string; githubUrl: string; author: string } }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: server.name,
    description: server.description,
    url: server.githubUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    author: {
      "@type": "Organization",
      name: server.author,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function ServerDetailPage({ params }: ServerDetailProps) {
  const { slug } = await params;
  const server = getServerBySlug(slug);
  if (!server) notFound();

  const category = getCategoryBySlug(server.category);
  const related = getRelatedServers(server.category, server.id, 3);
  const features = server.features
    ? server.features.split(",").map((f) => f.trim())
    : [];
  const CategoryIcon = category ? getIcon(category.icon) : null;

  // Build install command
  const installCmd = server.npmPackage
    ? `npx -y ${server.npmPackage}`
    : `npx -y @modelcontextprotocol/server-${server.id}`;

  const mcpConfig = JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
          command: "npx",
          args: ["-y", server.npmPackage || `@modelcontextprotocol/server-${server.id}`],
        },
      },
    },
    null,
    2
  );

  return (
    <>
      <SchemaOrg server={server} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/servers" className="hover:text-foreground transition-colors">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            All Servers
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link
                href={`/category/${category.id}`}
                className="hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{server.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-bold sm:text-3xl">{server.name}</h1>
                    {server.official && (
                      <Badge variant="default" className="gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Official
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    {server.author}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {server.description}
              </p>

              {/* Features */}
              {features.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              {category && (
                <div className="mt-6">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </h2>
                  <Link
                    href={`/category/${category.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
                    {category.name}
                  </Link>
                </div>
              )}

              {/* Installation */}
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Installation
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Quick start:</p>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted/50 p-4">
                      <code className="text-sm font-mono break-all">{installCmd}</code>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      MCP client configuration:
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted/50 p-4">
                      <pre className="text-sm font-mono overflow-x-auto">{mcpConfig}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Links */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Links
              </h2>
              <div className="space-y-3">
                <a
                  href={server.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 text-sm transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">GitHub Repository</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {server.githubUrl.replace("https://github.com/", "")}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
                {server.npmPackage && (
                  <a
                    href={`https://www.npmjs.com/package/${server.npmPackage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-border/50 p-3 text-sm transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Package className="h-5 w-5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">npm Package</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {server.npmPackage}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Author</dt>
                  <dd className="font-medium">{server.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>
                    <Badge variant={server.official ? "default" : "secondary"}>
                      {server.official ? "Official" : "Community"}
                    </Badge>
                  </dd>
                </div>
                {category && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{category.name}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Related Servers */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold tracking-tight">Related Servers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              More servers in {category?.name || "this category"}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServerCard key={s.id} server={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
