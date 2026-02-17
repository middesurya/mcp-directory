import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star } from "lucide-react";
import type { Server } from "@/db/schema";

interface ServerCardProps {
  server: Server;
}

export function ServerCard({ server }: ServerCardProps) {
  const features = server.features
    ? server.features.split(",").map((f) => f.trim())
    : [];

  return (
    <Link href={`/server/${server.id}`} className="group block">
      <div className="relative h-full rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold group-hover:text-primary transition-colors">
                {server.name}
              </h3>
              {server.official && (
                <Badge variant="default" className="shrink-0 text-[10px] px-1.5 py-0">
                  Official
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              by {server.author}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {server.description}
        </p>

        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] text-muted-foreground">
                +{features.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
