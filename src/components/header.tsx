"use client";

import { useState } from "react";
import Link from "next/link";
import { Blocks, Github, Search, X } from "lucide-react";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Blocks className="h-4.5 w-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">MCP Directory</span>
        </Link>

        {/* Desktop search bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Mobile search overlay */}
        {mobileSearchOpen && (
          <div className="absolute inset-0 flex items-center gap-2 bg-background px-4 md:hidden">
            <SearchBar className="flex-1" />
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="shrink-0 rounded-md p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <nav className="flex items-center gap-1">
          {/* Mobile search trigger */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>
          
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
