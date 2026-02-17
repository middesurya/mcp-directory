import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go Home
        </Link>
        <Link
          href="/servers"
          className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Browse Servers
        </Link>
      </div>
    </div>
  );
}
