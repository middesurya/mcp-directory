# Claude Code Instructions

You are building an MCP Servers Directory website following Frey Chu's directory playbook.

## Project Overview
A searchable, filterable directory of MCP (Model Context Protocol) servers. The goal is to become the definitive resource for discovering MCP servers.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- SQLite + Drizzle ORM (file-based, no hosting costs)
- Lucide React icons

## Data
Seed data is in `data/servers.csv` and `data/categories.csv`. Import this into SQLite.

## Pages to Build

### 1. Homepage (`/`)
- Hero section: "Discover MCP Servers" with prominent search bar
- Stats bar: Total servers, categories, official count
- Featured servers (6 cards)
- Category grid with icons
- Latest additions section

### 2. All Servers (`/servers`)
- Search + filter controls
- Server cards in grid
- Filter by: category, official/community, sort by name/date

### 3. Server Detail (`/server/[slug]`)
- Full server info with nice layout
- Installation instructions (copy button)
- Features as badges
- GitHub link prominent
- Related servers
- Schema.org markup

### 4. Category (`/category/[slug]`)
- Category description
- All servers in category
- Filters

### 5. Submit (`/submit`)
- Simple form: GitHub URL, name, description, category

## Component Structure
```
components/
├── ui/              (shadcn)
├── header.tsx       (nav + search)
├── footer.tsx
├── server-card.tsx  (reusable card)
├── search-bar.tsx   (with suggestions)
├── category-card.tsx
├── stats-bar.tsx
└── feature-badge.tsx
```

## Database Schema (Drizzle)

```typescript
// db/schema.ts
export const servers = sqliteTable('servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  githubUrl: text('github_url').notNull(),
  npmPackage: text('npm_package'),
  official: integer('official', { mode: 'boolean' }).default(false),
  features: text('features'), // JSON array as string
  stars: integer('stars').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  serverCount: integer('server_count').default(0),
});
```

## Design Guidelines
- Clean, modern design
- Dark mode support
- Fast (static generation where possible)
- Mobile responsive
- Accessible

## Colors
- Primary: Blue (#3b82f6)
- Background: White/Slate-950 (dark)
- Cards: Light gray/Slate-900 (dark)

## SEO Requirements
- Dynamic meta tags per page
- Schema.org SoftwareApplication markup on server pages
- Sitemap
- Canonical URLs

## Git Strategy
**IMPORTANT: Commit after each major feature!**

Commit messages:
1. "feat: initialize Next.js with Tailwind and shadcn"
2. "feat: add Drizzle ORM and database schema"
3. "feat: add seed script to import CSV data"
4. "feat: build homepage with hero and category grid"
5. "feat: build server listing page with filters"
6. "feat: build server detail page with schema markup"
7. "feat: build category pages"
8. "feat: add search functionality"
9. "feat: add dark mode support"
10. "chore: final polish and cleanup"

Push after each commit: `git push origin master`

## Commands to Start

```bash
# 1. Initialize Next.js (answer prompts appropriately)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# 2. Install dependencies
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
npm install lucide-react class-variance-authority clsx tailwind-merge

# 3. Initialize shadcn
npx shadcn@latest init

# 4. Add shadcn components
npx shadcn@latest add button card input badge separator command dialog
```

## File Structure
```
mcp-directory/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── servers/
│   │   │   └── page.tsx
│   │   ├── server/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── submit/
│   │       └── page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── db.ts
│   │   └── utils.ts
│   └── db/
│       ├── schema.ts
│       └── seed.ts
├── data/
│   ├── servers.csv
│   └── categories.csv
├── drizzle.config.ts
└── package.json
```

## Priority Order
1. Get the foundation working (Next.js + DB)
2. Homepage that looks great
3. Server listing with search
4. Server detail pages
5. Category pages
6. Polish

Start building now!
