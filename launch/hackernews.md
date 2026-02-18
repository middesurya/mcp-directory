# Hacker News Launch

## Title (80 chars max)

**74 chars:** `Show HN: MCP Directory – 181 Model Context Protocol servers, one-click config`

**Alternatives:**
- `Show HN: Directory of 181 MCP servers with one-click config generator` (70 chars)
- `Show HN: MCP Directory – Find and configure servers for Claude, Cursor` (72 chars)

---

## URL

https://mcp-directory-pi.vercel.app

---

## Top-Level Comment

MCP (Model Context Protocol) is Anthropic's open protocol for connecting AI assistants to external tools and data sources. Think of it as a standard way for Claude Desktop, Cursor, Windsurf, and other AI tools to talk to databases, APIs, browsers, and more.

The problem: there are now 180+ MCP servers scattered across GitHub. Finding them is tedious. Configuring them is worse—you have to read through each README, figure out the JSON config format, and manually edit your config file.

I built MCP Directory to solve this:

1. **Search**: 181 servers indexed with instant autocomplete. Filter by category (databases, cloud, DevOps, etc.) or compatible client.

2. **One-click Config Generator**: This is the main feature. Click a button, get the ready-to-paste JSON config copied to your clipboard. No more digging through READMEs.

3. **Browse by Client**: See which servers work with Claude Desktop, Cursor, Windsurf, Cline, or Continue.

The directory includes 89 official servers from the MCP team plus community contributions. It's free, no login required.

Technical notes:
- Built with Next.js, statically generated
- Server metadata sourced from official MCP repo + community submissions
- Config templates generated based on each server's requirements

Happy to answer questions about MCP more broadly—it's an interesting approach to tool-use standardization that seems to be gaining traction.

---

## Anticipated Questions & Answers

**Q: How is this different from the official MCP repo?**
A: The official repo lists servers but doesn't have search, filtering, or config generation. This is a discovery layer on top.

**Q: What about security? MCP servers can access a lot.**
A: Good question. Each server's permissions/capabilities are listed. Users should review what access they're granting. The directory just helps you find and configure servers—security decisions are still on the user.

**Q: Will you add ratings/reviews?**
A: Planning to. Want to get the core discovery experience right first.

**Q: Is this open source?**
A: Not yet, but considering it. Would love feedback on whether that would be useful.

**Q: How do you keep the server list updated?**
A: Combination of monitoring the official repo and community submissions. There's a submit form for new servers.

---

## Posting Tips

**Best times:** Tuesday-Thursday, 8-10am EST or 6-8pm EST

**HN etiquette:**
- Be factual, not promotional
- Respond to every comment
- Accept criticism gracefully
- Don't ask for upvotes

**First hour is critical:** Be ready to respond to comments immediately
