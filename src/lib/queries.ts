import { db } from "@/db";
import { servers, categories } from "@/db/schema";
import { eq, like, or, desc, count, and, ne } from "drizzle-orm";

export function getAllServers() {
  return db.select().from(servers).orderBy(servers.name).all();
}

export function getServerBySlug(slug: string) {
  return db.select().from(servers).where(eq(servers.id, slug)).get() ?? null;
}

export function getServersByCategory(categoryId: string) {
  return db
    .select()
    .from(servers)
    .where(eq(servers.category, categoryId))
    .orderBy(servers.name)
    .all();
}

export function getFeaturedServers(limit = 6) {
  return db
    .select()
    .from(servers)
    .where(eq(servers.official, true))
    .orderBy(servers.name)
    .limit(limit)
    .all();
}

export function getLatestServers(limit = 6) {
  return db
    .select()
    .from(servers)
    .orderBy(desc(servers.createdAt))
    .limit(limit)
    .all();
}

export function searchServers(query: string) {
  const pattern = `%${query}%`;
  return db
    .select()
    .from(servers)
    .where(
      or(
        like(servers.name, pattern),
        like(servers.description, pattern),
        like(servers.features, pattern)
      )
    )
    .orderBy(servers.name)
    .all();
}

export function getAllCategories() {
  return db.select().from(categories).orderBy(categories.name).all();
}

export function getCategoryBySlug(slug: string) {
  return db
    .select()
    .from(categories)
    .where(eq(categories.id, slug))
    .get() ?? null;
}

export function getStats() {
  const serverCount = db
    .select({ count: count() })
    .from(servers)
    .get();
  const categoryCount = db
    .select({ count: count() })
    .from(categories)
    .get();
  const officialCount = db
    .select({ count: count() })
    .from(servers)
    .where(eq(servers.official, true))
    .get();

  return {
    servers: serverCount?.count ?? 0,
    categories: categoryCount?.count ?? 0,
    official: officialCount?.count ?? 0,
  };
}

export function getRelatedServers(
  categoryId: string,
  excludeId: string,
  limit = 3
) {
  return db
    .select()
    .from(servers)
    .where(and(eq(servers.category, categoryId), ne(servers.id, excludeId)))
    .orderBy(servers.name)
    .limit(limit)
    .all();
}
