import Link from "next/link";
import { Blocks } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Blocks className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight">MCP Directory</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The definitive directory for discovering Model Context Protocol servers.
              Find the perfect MCP server for your AI workflows.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/servers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Servers
                </Link>
              </li>
              <li>
                <Link href="/servers?filter=official" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Official Servers
                </Link>
              </li>
              <li>
                <Link href="/servers?filter=community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community Servers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  MCP Specification
                </a>
              </li>
              <li>
                <a href="https://github.com/modelcontextprotocol" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Submit a Server
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Popular Categories</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/category/database" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Databases
                </Link>
              </li>
              <li>
                <Link href="/category/browser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browser Automation
                </Link>
              </li>
              <li>
                <Link href="/category/dev-tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Developer Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            Built with Next.js, Tailwind CSS, and SQLite. Not affiliated with Anthropic.
          </p>
        </div>
      </div>
    </footer>
  );
}
