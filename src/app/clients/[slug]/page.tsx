import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Monitor,
  Apple,
  Terminal,
  Copy,
} from "lucide-react";
import { ServerCard } from "@/components/server-card";
import { getAllClients, getClientById } from "@/data/clients";
import { getAllServers } from "@/lib/queries";

interface ClientPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const clients = getAllClients();
  return clients.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: ClientPageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientById(slug);
  if (!client) return { title: "Client Not Found" };

  return {
    title: `${client.name} MCP Servers | MCP Directory`,
    description: `Find and configure MCP servers for ${client.name}. ${client.description}`,
  };
}

function generateExampleConfig(
  clientFormat: "standard" | "cline" | "continue"
): string {
  if (clientFormat === "cline") {
    return JSON.stringify(
      {
        "cline.mcpServers": {
          filesystem: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
          },
          github: {
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-github"],
            env: {
              GITHUB_TOKEN: "your-token-here",
            },
          },
        },
      },
      null,
      2
    );
  }

  if (clientFormat === "continue") {
    return JSON.stringify(
      {
        mcpServers: [
          {
            name: "filesystem",
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
          },
          {
            name: "github",
            command: "npx",
            args: ["-y", "@modelcontextprotocol/server-github"],
            env: {
              GITHUB_TOKEN: "your-token-here",
            },
          },
        ],
      },
      null,
      2
    );
  }

  // Standard format for Claude Desktop, Cursor, Windsurf
  return JSON.stringify(
    {
      mcpServers: {
        filesystem: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
        },
        github: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-github"],
          env: {
            GITHUB_TOKEN: "your-token-here",
          },
        },
      },
    },
    null,
    2
  );
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { slug } = await params;
  const client = getClientById(slug);
  if (!client) notFound();

  const servers = getAllServers();
  const exampleConfig = generateExampleConfig(client.configFormat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/clients" className="hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
          All Clients
        </Link>
        <span>/</span>
        <span className="text-foreground">{client.name}</span>
      </nav>

      {/* Client Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-3xl">
            {client.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="mt-1 text-muted-foreground">{client.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {client.features.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        <a
          href={client.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Get {client.name}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Quick Setup Section */}
      <section className="mb-12 rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Quick Setup</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure MCP servers in {client.name} by editing your config file
        </p>

        {/* Config Paths */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Apple className="h-4 w-4" />
              macOS
            </div>
            <code className="mt-2 block text-xs text-muted-foreground break-all font-mono">
              {client.configPath.macos}
            </code>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Monitor className="h-4 w-4" />
              Windows
            </div>
            <code className="mt-2 block text-xs text-muted-foreground break-all font-mono">
              {client.configPath.windows}
            </code>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Terminal className="h-4 w-4" />
              Linux
            </div>
            <code className="mt-2 block text-xs text-muted-foreground break-all font-mono">
              {client.configPath.linux}
            </code>
          </div>
        </div>

        {/* Example Config */}
        <div className="mt-6">
          <h3 className="text-sm font-medium">Example Configuration</h3>
          <div className="mt-3 overflow-hidden rounded-lg border border-border bg-zinc-950">
            <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900/50 px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                {client.configFormat === "cline" ? "settings.json" : "config.json"}
              </span>
              <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm">
              <code className="font-mono text-zinc-100">{exampleConfig}</code>
            </pre>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">1.</strong> Open or create the config file at
            the path shown above
          </p>
          <p>
            <strong className="text-foreground">2.</strong> Add servers from the list below to
            your config
          </p>
          <p>
            <strong className="text-foreground">3.</strong> Restart {client.name} to load the
            new servers
          </p>
        </div>
      </section>

      {/* Compatible Servers */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Compatible Servers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {servers.length} servers work with {client.name}
            </p>
          </div>
          <Link
            href="/servers"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servers.slice(0, 12).map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>

        {servers.length > 12 && (
          <div className="mt-8 text-center">
            <Link
              href="/servers"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              View all {servers.length} servers
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
