import Link from "next/link";
import type { Client } from "@/data/clients";

interface ClientCardProps {
  client: Client;
  serverCount?: number;
}

export function ClientCard({ client, serverCount }: ClientCardProps) {
  return (
    <Link href={`/clients/${client.id}`} className="group block">
      <div className="flex items-center gap-3.5 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg transition-colors group-hover:bg-primary/15">
          {client.icon}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold group-hover:text-primary transition-colors">
            {client.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {serverCount !== undefined
              ? `${serverCount} compatible ${serverCount === 1 ? "server" : "servers"}`
              : "All servers compatible"}
          </p>
        </div>
      </div>
    </Link>
  );
}
