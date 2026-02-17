# MCP Servers Directory - Build Plan

## Strategy (Based on Frey Chu's Directory Playbook)

### The Vision
Build the definitive MCP (Model Context Protocol) Servers directory - a searchable, filterable database of all MCP servers, tools, and integrations. First-mover advantage in a rapidly growing niche.

### Why This Niche Works (Frey's 70/30 Rule)
**Data (70%):**
- MCP is exploding - Anthropic, OpenAI, and every AI company is adopting it
- No authoritative directory exists yet
- Developer audience = high value, willing to pay for visibility
- Growing search volume: "MCP servers", "MCP tools", "Claude MCP", etc.

**Passion (30%):**
- You (Surya) are deep in this space - LangChain, agents, MCP
- You can identify quality servers others can't
- You understand what developers need

### The "Bounty"
Current state: MCP servers are scattered across:
- GitHub repos (hard to discover)
- Awesome lists (no filtering, no details)
- Random blog posts
- Anthropic's docs (limited)

We consolidate, enrich, and own the niche.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** SQLite (via Drizzle ORM) - simple, file-based, no hosting costs
- **Search:** Built-in full-text search
- **Deployment:** Vercel (free tier to start)
- **Data Collection:** Puppeteer/Playwright + manual curation

---

## Data Schema

### MCP Server
```
- id: string (slug)
- name: string
- description: string
- category: string (filesystem, database, api, browser, dev-tools, ai, communication, etc.)
- author: string
- github_url: string
- npm_package: string (optional)
- stars: number
- last_updated: date
- install_command: string
- config_example: json
- features: string[] (array of feature tags)
- official: boolean (Anthropic official or community)
- logo_url: string (optional)
- documentation_url: string (optional)
- created_at: date
- updated_at: date
```

### Category
```
- id: string (slug)
- name: string
- description: string
- icon: string
- server_count: number
```

---

## Site Structure (Pillar + Individual Pages)

### Pages
1. **Homepage** (`/`)
   - Hero: "Find the perfect MCP server for your AI agent"
   - Search bar (prominent)
   - Featured servers (top 6)
   - Category grid
   - Latest additions
   - Stats (total servers, categories, etc.)

2. **Category Pages** (`/category/[slug]`)
   - Category description
   - Filtered server list
   - Sub-filters (stars, official, recently updated)

3. **Server Detail Pages** (`/server/[slug]`)
   - Full server info
   - Installation instructions
   - Config examples
   - GitHub stats
   - Related servers
   - Schema markup for SEO

4. **All Servers** (`/servers`)
   - Full list with search/filter
   - Sort by: stars, name, recently added, recently updated

5. **Submit Server** (`/submit`)
   - Form for community submissions
   - Validates GitHub URL

6. **About** (`/about`)
   - What is MCP?
   - Why this directory?
   - How to contribute

---

## Data Collection Strategy

### Phase 1: Seed Data (Manual + Scraping)
1. Scrape official Anthropic MCP servers list
2. Scrape awesome-mcp-servers GitHub repos
3. Search GitHub for "mcp-server" repos
4. Extract: name, description, stars, author, URL

### Phase 2: Enrichment
1. For each server:
   - Fetch README for detailed description
   - Extract install commands
   - Extract config examples
   - Categorize by function
   - Add feature tags

### Phase 3: Ongoing
1. GitHub Actions to update star counts weekly
2. Community submissions
3. Monitor for new releases

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- [x] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind + shadcn/ui
- [ ] Create database schema (Drizzle + SQLite)
- [ ] Build seed data CSV
- [ ] Import seed data

**Git commits after each step!**

### Phase 2: Core Pages
- [ ] Homepage with hero + search
- [ ] Server listing page with filters
- [ ] Individual server detail pages
- [ ] Category pages

### Phase 3: Data & SEO
- [ ] Full data collection script
- [ ] Schema.org markup
- [ ] Sitemap generation
- [ ] Meta tags + Open Graph

### Phase 4: Polish
- [ ] Responsive design
- [ ] Dark mode
- [ ] Submit form
- [ ] Analytics

---

## SEO Strategy

### Target Keywords
- "mcp servers" 
- "mcp tools"
- "claude mcp servers"
- "model context protocol servers"
- "[category] mcp server" (e.g., "database mcp server")

### On-Page SEO
- Unique title/description per page
- Schema.org SoftwareApplication markup
- Internal linking between related servers
- Fast load times (static generation)

---

## Monetization (Future)
1. **Display Ads** - Mediavine once traffic hits 50k sessions/month
2. **Featured Listings** - $50-200/month for top placement
3. **Sponsored Categories** - Companies sponsor category pages
4. **Affiliate** - Link to hosting providers, dev tools

---

## Commands to Run

```bash
# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
npm install drizzle-orm better-sqlite3 @types/better-sqlite3
npm install -D drizzle-kit
npm install lucide-react class-variance-authority clsx tailwind-merge
npx shadcn@latest init

# Add shadcn components
npx shadcn@latest add button card input badge separator
```

---

## File Structure

```
mcp-directory/
├── src/
│   ├── app/
│   │   ├── page.tsx (homepage)
│   │   ├── servers/
│   │   │   └── page.tsx (all servers)
│   │   ├── server/
│   │   │   └── [slug]/
│   │   │       └── page.tsx (server detail)
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx (category page)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn)
│   │   ├── server-card.tsx
│   │   ├── search-bar.tsx
│   │   ├── category-grid.tsx
│   │   └── header.tsx
│   ├── lib/
│   │   ├── db.ts (database connection)
│   │   └── utils.ts
│   └── db/
│       ├── schema.ts (Drizzle schema)
│       └── seed.ts (seed script)
├── data/
│   ├── servers.csv (seed data)
│   └── categories.csv
├── drizzle.config.ts
└── package.json
```

---

## Team Agent Strategy

Use sub-agents for parallel work:
1. **Data Agent** - Scrapes and enriches server data
2. **UI Agent** - Builds components and pages
3. **SEO Agent** - Adds meta tags, schema markup, sitemap

Each agent commits after completing their task.

---

## Success Metrics

- 100+ servers indexed in week 1
- Page 1 Google ranking for "mcp servers" in 3 months
- 1,000 monthly visitors in month 2
- First featured listing sale in month 3

---

Let's build! 🚀
