import Link from "next/link";
import { getIcon } from "@/lib/icons";
import type { Category } from "@/db/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = getIcon(category.icon);

  return (
    <Link href={`/category/${category.id}`} className="group block">
      <div className="flex items-center gap-3.5 rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {category.serverCount} {category.serverCount === 1 ? "server" : "servers"}
          </p>
        </div>
      </div>
    </Link>
  );
}
