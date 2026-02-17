import { Server, FolderOpen, ShieldCheck } from "lucide-react";

interface StatsBarProps {
  servers: number;
  categories: number;
  official: number;
}

export function StatsBar({ servers, categories, official }: StatsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Server className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xl font-bold">{servers}</p>
          <p className="text-xs text-muted-foreground">Servers</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FolderOpen className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xl font-bold">{categories}</p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-xl font-bold">{official}</p>
          <p className="text-xs text-muted-foreground">Official</p>
        </div>
      </div>
    </div>
  );
}
