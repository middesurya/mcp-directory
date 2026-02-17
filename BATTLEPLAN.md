# MCP Directory - Battle Plan v1

## 🎯 Mission
Make this THE definitive MCP directory. Not just another listing — the one developers bookmark.

## 🏆 Competitive Gap Analysis

| Feature | mcpservers.org | directorymcp | Us (Current) | Us (Target) |
|---------|---------------|--------------|--------------|-------------|
| Servers | 50+ | 94+ | 45 | 150+ |
| Dark mode | ✅ | ✅ | ❌ | ✅ |
| Search | Basic | Basic | ✅ Autocomplete | ✅ |
| Config Generator | ❌ | ❌ | ✅ | ✅ Enhanced |
| Browse by Client | ❌ | ✅ | ❌ | ✅ |
| Star counts | ✅ | ❌ | ❌ | ✅ Live |
| Deployed | ✅ | ✅ | ❌ | ✅ |
| SEO/Schema | ? | ? | ✅ | ✅ Enhanced |

## 🔥 Our Differentiators (Double Down)

1. **Config Generator** — NO ONE else has this. Enhance it:
   - Add Zed, Windsurf configs
   - Show env var setup
   - "Test connection" button (future)

2. **Client-First Browse** — "I use Cursor, show me what works"

3. **Live GitHub Stats** — Real star counts, last updated, health score

4. **Installation Wizard** — Step-by-step for each client

## 📋 Execution Phases

### Phase 1: Deploy & Dark Mode (30 min)
- [ ] Deploy to Vercel
- [ ] Add dark mode toggle
- [ ] Verify everything works

### Phase 2: Data Expansion (parallel)
- [ ] Scrape modelcontextprotocol/servers GitHub
- [ ] Scrape awesome-mcp-servers repos
- [ ] Scrape mcpservers.org listings
- [ ] Extract: name, description, GitHub URL, category, author
- [ ] Dedupe against existing 45
- [ ] Target: 150+ unique servers

### Phase 3: Feature Parity+ (parallel)
- [ ] Browse by Client filter page
- [ ] Live GitHub star counts (API or scrape)
- [ ] Last updated dates
- [ ] Health indicators (active/stale)

### Phase 4: Standout Features
- [ ] Enhanced Config Generator (more clients, env vars)
- [ ] Installation wizard component
- [ ] "Works with" badges on cards
- [ ] Comparison tool (compare 2-3 servers)

### Phase 5: SEO & Launch
- [ ] Sitemap.xml generation
- [ ] robots.txt
- [ ] OG images for social sharing
- [ ] Submit to Google Search Console
- [ ] Submit to Product Hunt
- [ ] Post on r/ClaudeAI, r/LocalLLaMA, HackerNews

## 🤖 Team Agent Assignments

### Agent 1: Deploy & Infrastructure
- Vercel deployment
- Environment setup
- Domain config (if available)

### Agent 2: Dark Mode & Polish
- Dark mode implementation
- UI polish
- Mobile responsiveness check

### Agent 3: Data Scraper
- Scrape all MCP server sources
- Clean and categorize data
- Generate seed SQL/CSV
- Import to database

### Agent 4: Feature Builder
- Browse by Client page
- GitHub stats integration
- Enhanced filters

## 📊 Success Metrics

- [ ] 150+ servers indexed
- [ ] Dark mode working
- [ ] Live on Vercel
- [ ] Page 1 Google for "mcp servers directory" (3 months)
- [ ] 1000+ monthly visitors (month 2)

## 🚀 Let's Ship

Execute in parallel. Communicate via commits. Ship fast.
