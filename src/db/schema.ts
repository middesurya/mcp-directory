import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const servers = sqliteTable("servers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  githubUrl: text("github_url").notNull(),
  npmPackage: text("npm_package"),
  official: integer("official", { mode: "boolean" }).default(false),
  features: text("features"),
  stars: integer("stars").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  serverCount: integer("server_count").default(0),
});

export type Server = typeof servers.$inferSelect;
export type Category = typeof categories.$inferSelect;
