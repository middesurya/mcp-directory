import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAllClients } from "@/data/clients";
import { getStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Browse by Client | MCP Directory",
  description:
    "Find MCP servers compatible with your AI client - Claude Desktop, Cursor, Windsurf, Cline, and Continue.",
};

export default function ClientsPage() {
  const clients = getAllClients();
  const stats = getStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Clients</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse by Client
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose your AI client to see compatible MCP servers and setup instructions
        </p>
      </div>

      {/* Client Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl transition-colors group-hover:bg-primary/15">
              {client.icon}
            </div>

            {/* Content */}
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {client.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {client.description}
            </p>

            {/* Server count */}
            <p className="mt-4 text-sm font-medium text-primary">
              {stats.servers} compatible servers →
            </p>

            {/* Features */}
            <div className="mt-4 flex flex-wrap gap-2">
              {client.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Website link */}
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span>{new URL(client.website).hostname}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 rounded-2xl border border-border/50 bg-muted/30 p-8">
        <h2 className="text-xl font-semibold">About MCP Client Compatibility</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The Model Context Protocol (MCP) is an open standard, which means most MCP
          servers work with all compatible clients. The main difference between
          clients is their configuration format and file location. Select your
          client above to get the correct setup instructions.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-background p-4">
            <h3 className="font-medium">Standard Format</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Claude Desktop, Cursor, and Windsurf use a standard mcpServers
              configuration object.
            </p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <h3 className="font-medium">VS Code Extensions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cline uses VS Code settings, while Continue uses its own config.json
              format.
            </p>
          </div>
          <div className="rounded-lg bg-background p-4">
            <h3 className="font-medium">Universal Servers</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All servers in our directory work with all clients - just use the
              right config format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
