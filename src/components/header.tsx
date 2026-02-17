import Link from "next/link";
import { Blocks, Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Blocks className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight">MCP Directory</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/servers"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse
          </Link>
          <Link
            href="/submit"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Submit
          </Link>
          <a
            href="https://github.com/modelcontextprotocol"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
