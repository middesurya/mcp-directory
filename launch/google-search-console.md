# Search Console Setup Guide

## Google Search Console

### Step 1: Go to Search Console
Visit: https://search.google.com/search-console

### Step 2: Add Property
- Click "Add Property"
- Choose "URL prefix"
- Enter: `https://mcp-directory-pi.vercel.app`

### Step 3: Verify Ownership
Choose **HTML file** method:
1. Download the verification file (e.g., `google1234567890abcdef.html`)
2. Add it to `public/` folder in the project
3. Deploy to Vercel
4. Click "Verify" in Search Console

### Step 4: Submit Sitemap
After verification:
1. Go to "Sitemaps" in left menu
2. Enter: `sitemap.xml`
3. Click "Submit"

### Step 5: Request Indexing
1. Go to "URL Inspection"
2. Enter homepage URL
3. Click "Request Indexing"

---

## Bing Webmaster Tools

### Step 1: Go to Bing Webmaster Tools
Visit: https://www.bing.com/webmasters

### Step 2: Add Site
- Sign in with Microsoft account
- Click "Add Site"
- Enter: `https://mcp-directory-pi.vercel.app`

### Step 3: Verify Ownership
Choose **XML file** method (recommended) or use the same approach as Google:
1. Download `BingSiteAuth.xml`
2. Add it to `public/` folder
3. Deploy to Vercel
4. Click "Verify"

**Alternative:** If you've already verified with Google Search Console:
- Choose "Import from Google Search Console" option
- This auto-imports your site and sitemap

### Step 4: Submit Sitemap
1. Go to "Sitemaps" in left menu
2. Click "Submit sitemap"
3. Enter: `https://mcp-directory-pi.vercel.app/sitemap.xml`

### Step 5: Request Indexing
1. Go to "URL Inspection"
2. Enter URLs you want indexed
3. Click "Submit to Bing"

---

## Verification Files Location

After downloading verification files, place them in:
```
mcp-directory/
├── public/
│   ├── google1234567890abcdef.html  ← Google verification
│   ├── BingSiteAuth.xml              ← Bing verification
│   ├── sitemap.xml                   ← Already exists
│   └── robots.txt                    ← Already exists
```

## Notes
- Verification files are safe to commit (they're just ownership proof)
- Sitemap is automatically generated at `/sitemap.xml`
- Indexing can take a few days to weeks depending on the search engine
