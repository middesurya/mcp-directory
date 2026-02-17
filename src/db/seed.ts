import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "mcp-directory.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove existing DB for clean seed
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    github_url TEXT NOT NULL,
    npm_package TEXT,
    official INTEGER DEFAULT 0,
    features TEXT,
    stars INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    server_count INTEGER DEFAULT 0
  );
`);

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",");
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

// Seed categories
const categoriesCSV = fs.readFileSync(
  path.join(process.cwd(), "data", "categories.csv"),
  "utf-8"
);
const categoryRows = parseCSV(categoriesCSV);

const insertCategory = sqlite.prepare(
  "INSERT INTO categories (id, name, description, icon, server_count) VALUES (?, ?, ?, ?, ?)"
);

// Seed servers
const serversCSV = fs.readFileSync(
  path.join(process.cwd(), "data", "servers.csv"),
  "utf-8"
);
const serverRows = parseCSV(serversCSV);

// Count servers per category
const categoryCounts: Record<string, number> = {};
for (const row of serverRows) {
  const cat = row.category;
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

// Insert categories with actual server counts
for (const row of categoryRows) {
  const count = categoryCounts[row.id] || 0;
  insertCategory.run(row.id, row.name, row.description, row.icon, count);
}

const insertServer = sqlite.prepare(
  "INSERT INTO servers (id, name, description, category, author, github_url, npm_package, official, features, stars) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

for (const row of serverRows) {
  insertServer.run(
    row.id,
    row.name,
    row.description,
    row.category,
    row.author,
    row.github_url,
    row.npm_package || null,
    row.official === "true" ? 1 : 0,
    row.features || null,
    0
  );
}

console.log(`Seeded ${categoryRows.length} categories`);
console.log(`Seeded ${serverRows.length} servers`);
console.log(`Database created at ${dbPath}`);

sqlite.close();
