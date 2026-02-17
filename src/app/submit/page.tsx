import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { getAllCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Submit an MCP Server",
  description:
    "Submit your MCP (Model Context Protocol) server to be listed in the MCP Directory.",
};

export default function SubmitPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">Submit</span>
      </nav>

      <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Submit an MCP Server</h1>
        <p className="mt-2 text-muted-foreground">
          Share your MCP server with the community. Fill out the form below and
          we&apos;ll review it for inclusion in the directory.
        </p>

        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Server Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g., My Awesome MCP Server"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium">
              GitHub URL
            </label>
            <input
              type="url"
              id="github"
              name="github"
              required
              placeholder="https://github.com/username/repo"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              placeholder="Brief description of what your MCP server does..."
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="npm" className="block text-sm font-medium">
              npm Package{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="npm"
              name="npm"
              placeholder="@scope/package-name"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Your Email{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              We&apos;ll notify you when your server is listed.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
            Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
}
